from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY

db = SQLAlchemy()

class Summary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    summary = db.Column(db.String(1000), nullable=False)

    def __repr__(self):
        return f"Summary('{self.date}', '{self.summary}')"

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False, unique=True)
    date = db.Column(db.DateTime, nullable=False)
    publisher = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    priority = db.Column(db.String(100), nullable=False)
    label1 = db.Column(db.String(100), nullable=False)
    label2 = db.Column(db.String(100), nullable=False)
    label3 = db.Column(db.String(100), nullable=False)
    link = db.Column(db.String(200), nullable=False)
    text = db.Column(db.String(1000), nullable=False)
    activity = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return f"Article('{self.title}', '{self.date}', '{self.publisher}', '{self.category}')"

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    organizer = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    link = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"Activity('{self.title}', '{self.date}', '{self.publisher}', '{self.category}')"
    
class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.String(100), nullable=False, unique=True)
    messages = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"Chat('{self.group_id}', '{self.messages}')"