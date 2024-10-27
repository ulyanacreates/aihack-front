from flask import Blueprint, jsonify
from models import Chat

chat_bp = Blueprint('chat_bp', __name__)

@chat_bp.route('/chats/<string:user_id>/<string:category>', methods=['GET'])
def get_chats(group_id, category):
    chat = Chat.query.filter_by(group_id=group_id, category=category).first()
    if not chat:
        return jsonify({"error": "No chat records found for this user and category."})
    
    chat_data = {
        'id': chat.id,
        'group_id': chat.group_id,
        'category': chat.category,
        'messages': chat.messages,
        'timestamp': chat.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    }
    return jsonify({'chat': chat_data})