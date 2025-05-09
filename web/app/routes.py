from flask import request, render_template, redirect, url_for, flash
from flask_login import current_user, login_user, logout_user, login_required
from app.forms import LoginForm, SignupForm
from app.models import User
from app import app, db

# Route: Homepage
@app.route('/')
def homepage():
    return render_template("welcome-page.html")

# Route: User Dashboard
@app.route('/dashboard')
@login_required
def dashboard():
    # user = User.query.filter_by(username=current_user.username).first_or_404()
    return render_template("welcome-page.html")
    # return render_template("visulize.html", title="Home", user=user)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('dashboard'))
    return render_template('login.html', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('homepage'))

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = SignupForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('signup.html', form=form)


# # Route: Forgot Password Page, need to add forgot password page
# @app.route('/forgot-password')
# def forgot_password():
#     return render_template('forgot-password.html')
