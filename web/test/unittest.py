import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from app.models import User, Workout, Share
from datetime import datetime, timedelta

class ModelTests(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['SECRET_KEY'] = 'test-secret-key'
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()
        self.user1 = User(username='testuser1', email='test1@example.com')
        self.user1.set_password('password')
        self.user2 = User(username='testuser2', email='test2@example.com')
        self.user2.set_password('password')
        db.session.add(self.user1)
        db.session.add(self.user2)
        db.session.commit()
        self.created_users = [self.user1, self.user2]
        self.created_workouts = []
        self.created_shares = []

    def tearDown(self):
        for share in self.created_shares:
            db.session.delete(share)
        for workout in self.created_workouts:
            db.session.delete(workout)
        for user in self.created_users:
            db.session.delete(user)
        db.session.commit()
        db.session.remove()
        self.app_context.pop()

    def test_signup_user(self):
        user = User(username='newuser', email='newuser@example.com')
        user.set_password('password')
        db.session.add(user)
        db.session.commit()
        self.created_users.append(user)
        found = User.query.filter_by(username='newuser').first()
        self.assertIsNotNone(found)
        self.assertTrue(found.check_password('password'))

    def test_login_user(self):
        user = User.query.filter_by(username='testuser1').first()
        self.assertIsNotNone(user)
        self.assertTrue(user.check_password('password'))
        self.assertFalse(user.check_password('wrongpassword'))

    def test_user_password_hashing(self):
        user = User(username='hashuser', email='hash@example.com')
        user.set_password('mysecret')
        self.assertTrue(user.check_password('mysecret'))
        self.assertFalse(user.check_password('wrongpass'))

    def test_workout_valid_insert(self):
        workout = Workout(
            sport='Swimming',
            time=3600,
            distance=2.5,
            heart_rate=120,
            workout_date=datetime.now(),
            user_id=self.user1.id
        )
        db.session.add(workout)
        db.session.commit()
        self.created_workouts.append(workout)
        self.assertIsNotNone(Workout.query.filter_by(user_id=self.user1.id).first())

    def test_workout_invalid_sport(self):
        workout = Workout(
            sport='Basketball',
            time=3600,
            distance=2.5,
            heart_rate=120,
            workout_date=datetime.now(),
            user_id=self.user1.id
        )
        db.session.add(workout)
        with self.assertRaises(Exception):
            db.session.commit()
        db.session.rollback()

    def test_workout_invalid_distance(self):
        workout = Workout(
            sport='Running',
            time=3600,
            distance=-5,
            heart_rate=120,
            workout_date=datetime.now(),
            user_id=self.user1.id
        )
        db.session.add(workout)
        with self.assertRaises(Exception):
            db.session.commit()
        db.session.rollback()

    def test_workout_invalid_heart_rate(self):
        workout = Workout(
            sport='Cycling',
            time=3600,
            distance=10,
            heart_rate=300,
            workout_date=datetime.now(),
            user_id=self.user1.id
        )
        db.session.add(workout)
        with self.assertRaises(Exception):
            db.session.commit()
        db.session.rollback()

    def test_workout_future_date(self):
        future_date = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        workout = Workout(
            sport='Running',
            time=3600,
            distance=5,
            heart_rate=100,
            workout_date=future_date,
            user_id=self.user1.id
        )
        db.session.add(workout)
        with self.assertRaises(Exception):
            db.session.commit()
        db.session.rollback()

    def test_share_unique_constraint(self):
        workout = Workout(
            sport='Running',
            time=3600,
            distance=5,
            heart_rate=100,
            workout_date=datetime.now(),
            user_id=self.user1.id
        )
        db.session.add(workout)
        db.session.commit()
        self.created_workouts.append(workout)
        share1 = Share(from_user_id=self.user1.id, to_user_id=self.user2.id, workout_id=workout.id)
        db.session.add(share1)
        db.session.commit()
        self.created_shares.append(share1)
        share2 = Share(from_user_id=self.user1.id, to_user_id=self.user2.id, workout_id=workout.id)
        db.session.add(share2)
        with self.assertRaises(Exception):
            db.session.commit()
        db.session.rollback()

if __name__ == '__main__':
    unittest.main()
