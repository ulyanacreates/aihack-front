from flask import Blueprint, jsonify
from utils import get_related_links, get_message_info, get_article_info
from flask import request
from models import db, Chat


llm_bp = Blueprint('llm_bp', __name__)

@llm_bp.route('/related_links/<string:user_id>/<string:category>', methods=['GET'])
def related_links(user_id, category):
    related_links_info = get_related_links(user_id, category)
    return jsonify({'related_links': related_links_info})

# Define an api for sending messages to a large model api
@llm_bp.route('/send_message', methods=['POST'])
def send_message():
    # Access the database to get the chat data, of the first entry
    # Cut the message length to 1024 characters
    message = Chat.query.first()
    message = message.messages[:4000]
    print(message)
    message_info = get_message_info(message)
    return jsonify({'message_info': message_info})


# how would I curl this?
# curl -X POST http://127.0.0.1:5000/send_message -H "Content-Type: application/json" -d '{"message":"hello"}'
# curl -X POST http://127.0.0.1:5000/generate_text -H "Content-Type: application/json" -d "{\"prompt\": \"你是谁\"}" 
# curl -X POST http://127.0.0.1:5000/generate_article -H "Content-Type: application/json"