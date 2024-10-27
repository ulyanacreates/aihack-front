from flask import Blueprint, jsonify
from sqlalchemy import func
from utils import get_related_links, get_message_info, get_article_info, scrape_article_info, get_labels, get_article_title, generate_daily_summary, get_activity
from models import Article, Summary, Activity
from models import db
from datetime import datetime
from flask_cors import CORS

article_bp = Blueprint('article_bp', __name__)
CORS(article_bp)

@article_bp.route('/activities', methods=['GET'])
def get_activities():
    activities = Activity.query.all()
    
    output = []
    for activity in activities:
        activity_data = {
            'id': activity.id,
            'title': activity.title,
            'organizer': activity.organizer,
            'location': activity.location,
            'date': activity.date,
            'link': activity.link,
        }
        output.append(activity_data)
    return jsonify({'activities': output})

@article_bp.route('/articles/<string:category>', methods=['GET'])
def get_articles_by_category(category):
    articles = Article.query.filter_by(category=category).all()
    output = []
    for article in articles:
        article_data = {
            'id': article.id,
            'title': article.title,
            'date': article.date.strftime('%Y-%m-%d'),
            'publisher': article.publisher,
            'category': article.category,
            'link': article.link
        }
        print(article_data)
        output.append(article_data)
    
    print(output)
    return jsonify({'articles': output})

# GET method to take a specific number of random articles
# curl -X GET http://127.0.0.1:5000/articles/random/3
@article_bp.route('/articles/random/<int:number>', methods=['GET'])
def get_random_articles(number):
    articles = Article.query.order_by(func.random()).limit(number)
    output = []
    for article in articles:
        article_data = {
            'id': article.id,
            'title': article.title,
            'date': article.date.strftime('%Y-%m-%d'),
            'publisher': article.publisher,
            'text': article.text,
            'link': article.link,
            'labels': [article.label1, article.label2, article.label3],
        }
        output.append(article_data)
    print(output)
    return jsonify({'isUserNew': True, 'articles': output})

# GET method to take a specific number of random articles
# curl -X GET http://127.0.0.1:5000/articles/daily
@article_bp.route('/articles/daily', methods=['GET'])
def get_daily_articles():
    articles = Article.query.order_by(func.random()).limit(9)
    # Check if there is an existing summary that was also generated today
    today = datetime.today().date()
    summary = Summary.query.filter_by(date=today).first()
    if summary:
        print(f"Summary for {today} already exists in the database.")
    else: 
        gen_summary = generate_daily_summary(articles)
        summary = Summary(
            date=datetime.today().date(),
            summary=gen_summary
        )
        db.session.add(summary)
        db.session.commit()

    output = []
    for article in articles:
        article_data = {
            'id': article.id,
            'title': article.title,
            'date': article.date.strftime('%Y-%m-%d'),
            'publisher': article.publisher,
            'text': article.text,
            'link': article.link,
            'labels': [article.label1, article.label2, article.label3],
        }
        output.append(article_data)
    return jsonify({'articles': output, 'summary': summary.summary})

@article_bp.route('/articles/<path:url>', methods=['POST'])
def post_article(url):
    # Fetch article information
    title, publisher = get_article_title(url)
    content = get_article_info(url)
    title_str, date_str, summary, labels, activity_bool, publisher_str = get_labels(content)
    
    date = datetime.strptime(date_str, '%Y-%m-%d')

    if title is "":
        title = title_str

    if publisher is "":
        publisher = publisher_str

    print(title, date, summary, labels, activity_bool, publisher)
    
    # Check if there is an existing article with the same title
    existing_article = Article.query.filter_by(title=title).first()
    if existing_article:
        return jsonify({'info': "Article already exists"}), 400

    #Create an article object
    new_article = Article(
        title=title,
        date=date,
        publisher=publisher,
        label1=labels[0],
        label2= labels[1] if labels[1] is not None else None,
        label3=labels[2] if labels[1] is not None else None,
        link=url,
        text=summary,
        activity=True if activity_bool == 1 else False
    )

    db.session.add(new_article)
    db.session.commit()

    # Generate an activity object if the article is an activity
    if activity_bool == 1:
        print("generating activity")
        title, date, location = get_activity(content)
        date = datetime.strptime(date_str, '%Y-%m-%d')
        # Check if there is an existing activity with the same title
        existing_activity = Activity.query.filter_by(title=title).first()
        if existing_activity:
            return jsonify({'info': "Activity already exists"}), 400
        new_activity = Activity(
            title=title,
            date=date,
            organizer=publisher,
            location=location,
            link=url
        )
        db.session.add(new_activity)
        db.session.commit()

    # Generate a new summary for the day
    today = datetime.today().date()
    summary = Summary.query.filter_by(date=today).first()
    articles = Article.query.all()
    gen_summary = generate_daily_summary(articles)

    if summary:
        # Update the summary
        summary.summary = gen_summary
    else:
        summary = Summary(
            date=datetime.today().date(),
            summary=gen_summary
        )
        db.session.add(summary)
        db.session.commit()
    
    return jsonify({'info': "SUCCESS"}), 200

@article_bp.route('/articleshtml/<path:url>', methods=['POST'])
def post_article_html(url):
    # Fetch article information
    scrape_article_info(url)

    # Save the new article to the database
    # db.session.add(new_article)
    # db.session.commit()

    return jsonify({'info': "SUCCESS"}), 200

# curl -X POST http://127.0.0.1:5000/articles/https://mp.weixin.qq.com/s/7i7_pIgS6tPA276jnKfr_A -H "Content-Type: application/json"