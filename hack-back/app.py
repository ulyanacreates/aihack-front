import os
from flask import Flask
from dotenv import load_dotenv
from models import db
from utils import create_database
from routes import article_bp, chat_bp, llm_bp
import pdb
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///articles.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

app.register_blueprint(article_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(llm_bp)

if __name__ == "__main__":
    with app.app_context():
        create_database()
    app.run(host="0.0.0.0")