from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import event
from datetime import datetime
import re


@login.user_loader
def load_user(id):
    return User.query.get(int(id))
    
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    workouts = db.relationship('Workout', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sport = db.Column(db.String(20), nullable=False)
    time = db.Column(db.Integer, nullable=False)
    distance = db.Column(db.Float, nullable=False)
    heart_rate = db.Column(db.Integer)
    workout_date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    __table_args__ = (
        db.CheckConstraint(
            "sport IN ('Swimming', 'Cycling', 'Running')",
            name='valid_sport'
        ),
        db.CheckConstraint(
            "distance > 0",
            name='positive_distance'
        ),
        db.CheckConstraint(
            "time >= 0",
            name='non_negative_time'
        ),
        db.CheckConstraint(
            "heart_rate IS NULL OR (heart_rate >= 0 AND heart_rate <= 220)",
            name='valid_heart_rate'
        ),
    )

    def validate_time_format(time_str):
        if not re.match(r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$', time_str):
            raise ValueError("Time must be in HH:MM:SS format (e.g., 01:30:00).")
        return time_str

    def convert_time_to_seconds(time_str):
        h, m, s = map(int, time_str.split(':'))
        return h * 3600 + m * 60 + s

    def validate_workout_date(date_str):
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        if date_obj > datetime.now():
            raise ValueError("Workout date cannot be in the future.")
        return date_obj
    
    def seconds_to_hms(seconds):
        if seconds is None or seconds == 0:
            return "00:00:00"
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        return f"{int(hours):02d}:{int(minutes):02d}:{int(secs):02d}"

@event.listens_for(Workout, 'before_insert')
def validate_workout(mapper, connection, target):
    if isinstance(target.workout_date, str):
        target.workout_date = Workout.validate_workout_date(target.workout_date)
    if isinstance(target.time, str):
        target.time = Workout.convert_time_to_seconds(Workout.validate_time_format(target.time))
    if target.heart_rate and (target.heart_rate < 0 or target.heart_rate > 220):
        raise ValueError("Heart rate must be between 0 and 220 bpm.")
    if target.distance <= 0:
        raise ValueError("Distance must be positive.")
    if target.sport not in ['Swimming', 'Cycling', 'Running']:
        raise ValueError("Sport must be Swimming, Cycling, or Running.")

class Share(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'), nullable=False)

    __table_args__ = (
        db.UniqueConstraint('from_user_id', 'to_user_id', 'workout_id', name='unique_share'),
    )
