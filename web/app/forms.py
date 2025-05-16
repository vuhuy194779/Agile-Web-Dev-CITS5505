from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, DateField, FileField, SelectMultipleField, widgets
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo
from app.models import User

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Login')

class SignupForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    password2 = PasswordField(
        'Repeat Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Please use a different username.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError('Please use a different email address.')

class UploadForm(FlaskForm):
    date = DateField('Workout Date', validators=[DataRequired()])
    swimming = BooleanField('Swimming')
    cycling = BooleanField('Cycling')
    running = BooleanField('Running')
    submit = SubmitField('Upload Workout')

class CSVUploadForm(FlaskForm):
    csv_file = FileField('CSV File', validators=[DataRequired()])
    submit = SubmitField('Upload CSV')

class ProfileForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    avatar = FileField('ChangeAvatar')
    submit = SubmitField('Update Profile')

    def __init__(self, original_email, *args, **kwargs):
        super(ProfileForm, self).__init__(*args, **kwargs)
        self.original_email = original_email

    def validate_email(self, email):
        if email.data != self.original_email:
            user = User.query.filter_by(email=email.data).first()
            if user is not None:
                raise ValidationError('Please use a different email address.')

class PasswordForm(FlaskForm):
    current_password = PasswordField('Current Password', validators=[DataRequired()])
    new_password = PasswordField('New Password', validators=[DataRequired()])
    new_password2 = PasswordField('Repeat New Password', validators=[DataRequired(), EqualTo('new_password')])
    submit = SubmitField('Change Password')

class ShareDataForm(FlaskForm):
    workouts = SelectMultipleField('Workouts to Share', coerce=int, option_widget=widgets.CheckboxInput(), validators=[DataRequired()])
    users = SelectMultipleField('Share with Users', coerce=int, option_widget=widgets.CheckboxInput(), validators=[DataRequired()])
    submit = SubmitField('Share')
