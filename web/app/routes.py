from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from app import app,db, User


# Route: Homepage
@app.route('/')
def homepage():
    return render_template("welcome-page.html")

# Route: Login
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')  # Login page
    elif request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Find the user
        user = User.query.filter_by(username=username).first()
        if user is None or not user.check_password(password):
          return jsonify({"status": "fail"}), 401  # Login failed, return 401 status
        session['username'] = user.username  # Login successful, set session
        return redirect(url_for('dashboard'))  # Redirect to dashboard after successful login

# Route: Logout
@app.route('/logout')
def logout():
    session.clear()  # Clear session
    return redirect(url_for('homepage'))  # Redirect to homepage

# Route: User Dashboard
@app.route('/dashboard')
def dashboard():
    # Redirect to homepage if the user is not logged in
    if 'username' not in session:
        return redirect(url_for('homepage'))
    return render_template("welcome-page.html", username=session['username'])

# Route: Forgot Password Page, need to add forgot password page
@app.route('/forgot-password')
def forgot_password():
    return render_template('forgot-password.html')



# @app.route('/create-user')
# def create_user():
#     user = User(username="admin")
#     user.set_password("123")
#     db.session.add(user)
#     db.session.commit()
#     return "user created"

# # login test only）
# @app.route('/simulate-login/<username>')
# def simulate_login(username):
#     user = User.query.filter_by(username=username).first()
#     if user:
#         session['username'] = user.username
#         return redirect(url_for('dashboard'))
#     return "user not exist", 404


