from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.models import db, User



db.init_app(app)

# Create the database and tables
with app.app_context():
    db.create_all()
# Import routes after initializing the app and db to avoid circular imports
from app import routes
