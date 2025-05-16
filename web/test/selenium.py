import unittest
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from app import app, db
from app.models import User

class TestBase(unittest.TestCase):
    WAIT_TIMEOUT = 10
    BASE_URL = "http://127.0.0.1:5000"

    @classmethod
    def setUpClass(cls):
        cls.options = Options()
        cls.options.add_argument("--headless")
        cls.options.add_argument("--disable-gpu")
        cls.options.add_argument("--no-sandbox")
        cls.options.add_argument("--disable-dev-shm-usage")

    def setUp(self):
        app.config.update(
            TESTING=True,
            SQLALCHEMY_DATABASE_URI='sqlite:///:memory:',
            WTF_CSRF_ENABLED=False,
            SERVER_NAME='127.0.0.1:5000'
        )
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()
        self.driver = webdriver.Edge(options=self.options)
        self.wait = WebDriverWait(self.driver, self.WAIT_TIMEOUT)

        # Create test user for login
        self.test_user = User(username='testuser123', email='test123@example.com')
        self.test_user.set_password('Test123!')
        db.session.add(self.test_user)
        db.session.commit()

    def tearDown(self):
        if hasattr(self, 'driver'):
            self.driver.quit()
        # Remove test users
        for uname in ['testuser123', 'newuser']:
            user = User.query.filter_by(username=uname).first()
            if user:
                db.session.delete(user)
        db.session.commit()
        db.session.remove()
        self.app_context.pop()

    def wait_for_element(self, by, value, timeout=None):
        timeout = timeout or self.WAIT_TIMEOUT
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((by, value))
            )
            return element
        except TimeoutException:
            self.fail(f"Element not found: {by}={value}")

    def wait_for_url_change(self, url_part, timeout=None):
        timeout = timeout or self.WAIT_TIMEOUT
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.url_contains(url_part)
            )
        except TimeoutException:
            self.fail(f"URL did not change to contain: {url_part}")

class TestWebApp(TestBase):
    def test_homepage_navbar(self):
        self.driver.get(f"{self.BASE_URL}/")
        # Check for navigation menu items from base.html
        nav_items = ['Features', 'Processes']
        for item in nav_items:
            self.assertTrue(
                self.wait_for_element(By.XPATH, f"//*[contains(text(), '{item}')]")
            )

    def test_signup_flow(self):
        self.driver.get(f"{self.BASE_URL}/signup")
        # Fill signup form (based on signup.html)
        self.wait_for_element(By.NAME, "username").send_keys("newuser")
        self.wait_for_element(By.NAME, "email").send_keys("newuser@example.com")
        self.wait_for_element(By.NAME, "password").send_keys("Test123!")
        self.wait_for_element(By.NAME, "password2").send_keys("Test123!")
        self.wait_for_element(By.NAME, "submit").click()
        # After signup, should redirect to login or show login link
        self.wait_for_url_change("login")
        self.assertIn("login", self.driver.current_url)

    def test_login_flow(self):
        self.driver.get(f"{self.BASE_URL}/login")
        # Fill login form (based on login.html)
        self.wait_for_element(By.NAME, "username").send_keys("testuser123")
        self.wait_for_element(By.NAME, "password").send_keys("Test123!")
        self.wait_for_element(By.NAME, "submit").click()
        # After login, should redirect to home or show user menu
        self.wait_for_url_change("/")
        # Check for user menu/avatar from base.html
        self.assertTrue(self.wait_for_element(By.CLASS_NAME, "user-menu"))

    def test_login_fail(self):
        self.driver.get(f"{self.BASE_URL}/login")
        self.wait_for_element(By.NAME, "username").send_keys("wronguser")
        self.wait_for_element(By.NAME, "password").send_keys("wrongpass")
        self.wait_for_element(By.NAME, "submit").click()
        # Should stay on login and show error
        self.wait_for_element(By.CLASS_NAME, "flash-message")        
        self.assertIn("login", self.driver.current_url)

    def test_nav_login_signup_links(self):
        self.driver.get(f"{self.BASE_URL}/")
        # If not logged in, should see Login and Sign Up links
        login_link = self.wait_for_element(By.ID, "login-btn")
        signup_link = self.wait_for_element(By.ID, "signup-btn")
        self.assertTrue(login_link.is_displayed() or signup_link.is_displayed())

if __name__ == '__main__':
    unittest.main()
