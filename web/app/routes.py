from flask import request, render_template, redirect, url_for, flash, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from app.forms import LoginForm, SignupForm, UploadForm, CSVUploadForm
from app.models import User, Workout
from app import app, db
from datetime import datetime
import csv
from io import StringIO
from sqlalchemy.exc import IntegrityError

# Route: Homepage
@app.route('/')
def homepage():
    return render_template("welcome-page.html")

# Route: User Dashboard
@app.route('/dashboard')
@login_required
def dashboard():
    # user = User.query.filter_by(username=current_user.username).first_or_404()
    return render_template("dashboard.html", user=current_user)
    # return render_template("dashboard.html", title="Home", user=user)

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

@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload():
    form = UploadForm()
    csv_form = CSVUploadForm()
    if request.method == 'POST' and request.is_json:
        try:
            data = request.get_json()
            workout_date = data['date']
            sports = data['sportsData']

            if not sports:
                return jsonify({'error': 'At least one sport must be selected.'}), 400

            for sport in sports:
                workout = Workout(
                    sport=sport['sport_type'],
                    time=sport['time'],
                    distance=sport['distance'],
                    heart_rate=sport['heart_rate'],
                    workout_date=workout_date,
                    user_id=current_user.id
                )
                db.session.add(workout)

            db.session.commit()

            return jsonify({'message': 'Data submitted successfully!'}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    return render_template('upload.html', form=form, csv_form=csv_form, current_date=datetime.now().strftime('%Y-%m-%d'))

@app.route('/upload_csv', methods=['POST'])
@login_required
def upload_csv():
    if 'csv_files' not in request.files:
        return jsonify({'error': 'No file part in the request.'}), 400

    files = request.files.getlist('csv_files')
    if not files or all(file.filename == '' for file in files):
        return jsonify({'error': 'Please select at least one CSV file.'}), 400

    try:
        for file in files:
            if file and file.filename.endswith('.csv'):
                content = file.read().decode('utf-8')
                csv_reader = csv.DictReader(StringIO(content))
                data = list(csv_reader)

                if not data:
                    return jsonify({'error': 'CSV file is empty.'}), 400

                required_headers = ['date', 'sport', 'distance', 'time']
                headers = csv_reader.fieldnames
                missing_headers = [header for header in required_headers if header not in headers]
                if missing_headers:
                    return jsonify({'error': f'Missing required columns: {", ".join(missing_headers)}.'}), 400

                workout_date = data[0]['date']
                for row in data:
                    if 'heart_rate' not in row or not row['heart_rate']:
                        row['heart_rate'] = None

                for row in data:
                    workout = Workout(
                        sport=row['sport'].capitalize(),
                        time=row['time'], 
                        distance=float(row['distance']),
                        heart_rate=int(row['heart_rate']) if row['heart_rate'] else None,
                        workout_date=workout_date,
                        user_id=current_user.id
                    )
                    db.session.add(workout)

        db.session.commit()
        return jsonify({'message': 'File uploaded successfully!'}), 200

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'error': 'Database constraint violated: ' + str(e.orig)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# # Route: Forgot Password Page, need to add forgot password page
# @app.route('/forgot-password')
# def forgot_password():
#     return render_template('forgot-password.html')
