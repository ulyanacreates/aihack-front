import pandas as pd
import requests
import uuid
from datetime import datetime
import os
from models import Article, Chat, db, Summary
import pdb
import re
from zhipuai import ZhipuAI
import time
from bs4 import BeautifulSoup
import json

def get_article_title(url):
    # Create a session and set headers
    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    # Get the page
    response = session.get(url, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')

        paragraphs = soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'])
        text = [p.get_text(strip=True) for p in paragraphs]
        return text[0], text[1]
    else:
        print("Failed to retrieve the page:", response.status_code)
        return "", ""

# Define a functionn to get the activity information from the content
def get_activity(content):
    prompt= (  
            "请你阅读输入给你的content查找活动信息，并按范例格式生成键对应的信息：\n"
            "{\n"
            "  title: 金融科技, (生成3个label)\n"
            "  location: 1,\n"
            "  date: ……\n"
            "}  要求如下：1. 生成目标是活动title、date (%Y-%m-%d)、location。千万不要输出别的内容"
            )
    client = ZhipuAI(api_key=os.getenv("ZHIPU_KEY")) # Fill in your own APIKey
    response = client.chat.completions.create(
        model="glm-4-plus",  # Fill in the model code you need to call
        messages=[
            {"role": "system", "content": "你好！作为一名数据分析与自然语言处理专家，你需要根据用户提供的文章内容，对文本进行分析并按格式输出关键信息。"},
            {"role": "user", "content": prompt + content},
        ],
    )
    response = response.to_dict()
    content = response['choices'][0]['message']['content']
    # print(content)
    json_str = content.replace("```json\n", "").replace("\n```", "")
    content_dict = json.loads(json_str)
    print(content_dict)

    title = content_dict['title']
    date = content_dict['date']
    location = content_dict['location']

    return title, date, location


def get_labels(content):
    prompt= (  
            "请你阅读输入给你的content，并按范例格式生成键对应的信息：\n"
            "{\n"
            "  labels: 金融科技, (生成3个label)\n"
            "  link: https://blog.csdn.net/2301_78217634/article/details/142791446,\n"
            "  activity_bool: 1,\n"
            "  summary: ……\n"
            "}  要求如下：1. 生成目标是title、date (%Y-%m-%d)、publisher、label、activity_bool、summary（200字左右）2.activity_bool：判断内容中是否包含活动，判断规则是这段描述包括：时间、地点、主办方、主题（不需要都有，时间和主题比较重要）千万不要输出别的内容"
            )
    client = ZhipuAI(api_key=os.getenv("ZHIPU_KEY")) # Fill in your own APIKey
    response = client.chat.completions.create(
        model="glm-4-plus",  # Fill in the model code you need to call
        messages=[
            {"role": "system", "content": "你好！作为一名数据分析与自然语言处理专家，你需要根据用户提供的文章内容，对文本进行分析并按格式输出关键信息。"},
            {"role": "user", "content": prompt + content},
        ],
    )
    response = response.to_dict()
    content = response['choices'][0]['message']['content']
    # print(content)
    json_str = content.replace("```json\n", "").replace("\n```", "")
    content_dict = json.loads(json_str)

    title = content_dict['title']
    date = content_dict['date']
    summary = content_dict['summary']
    labels = content_dict['labels']
    activity_bool = content_dict['activity_bool']
    publisher = content_dict['publisher']


    return title, date, summary, labels, activity_bool, publisher

    
# Define a function that visits the given urls and returns the title, publisher, and date of the article, as well as keywords
def get_article_info(url):

    msg = [
        {
            "role": "user",
            "content":url
        }
    ]
    tool = "web-search-pro"
    url = "https://open.bigmodel.cn/api/paas/v4/tools"
    request_id = str(uuid.uuid4())
    data = {
        "request_id": request_id,
        "tool": tool,
        "stream": False,
        "messages": msg
    }

    resp = requests.post(
        url,
        json=data,
        headers={'Authorization': os.getenv("ZHIPU_KEY")},
        timeout=300
    )
    response = resp.content.decode()
    response = json.loads(response)
    # Extract some json data from the response
    content = response['choices'][0]['message']['tool_calls'][1]['search_result'][0]['content']
    return content

# Define a function to obtain the user's interest based on the group chat message history of the user.
def get_message_info(message):
    url = "https://cloud.infini-ai.com/maas/chatglm3/nvidia/chat/completions"
    payload = {
        "model": "chatglm3",
        "messages": [
            {
                "role": "user",
                "content": f"查看以下消息，如果用户是讨论以下内容的群聊的一部分，请告诉我用户的兴趣: {message}. \n 给我一些关键词或者标签来描述用户的兴趣。"
            }
        ]
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('API_KEY')}"
    }

    response = requests.post(url, json=payload, headers=headers)
    print(response.json())  # Print the API response to the console
    return response.json()

def process_csv(file_path):
    df = pd.read_csv(file_path)
    user_messages = []

    for index, row in df.iterrows():
        if 'StrContent' in row:
            message = row['StrContent']
            if isinstance(message, str) and not message.strip().startswith('<'):
                user_messages.append(message)
    
    concatenated_messages = "\n".join(user_messages)
    new_chat = Chat(
        group_id=file_path.split("/")[-1].split(".")[0],
        messages=concatenated_messages
    )
    # Check if the chat data already exists in the database
    chat = Chat.query.filter_by(group_id=new_chat.group_id).first()
    if chat:
        print(f"Chat data for group {new_chat.group_id} already exists in the database.")
        return
    db.session.add(new_chat)
    print(f"Added chat data for group {new_chat.group_id} to the database.")
    db.session.commit()

# Define a function to get related links based on the existing resources that the user is known to like
def get_related_links(user_id, category):
    chat = Chat.query.filter_by(user_id=user_id, category=category).first()
    if not chat:
        return {"error": "No chat records found for this user and category."}
    
    prompt = f"Find related or interesting links based on these messages:\n{chat.messages}"
    
    url = "https://cloud.infini-ai.com/maas/chatglm3/nvidia/chat/completions"
    payload = {
        "model": "chatglm3",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('API_KEY')}"
    }

    response = requests.post(url, json=payload, headers=headers)
    print(response.json())  # Print the API response to the console
    return response.json()

def generate_daily_summary(articles):

    # Iterate through the articles and append them all to a prompt so that the AI can generate a summary
    prompt = (
        "这些文章是用户今天收藏的文章。请进行一个总结，给用户介绍最他最关心的信息，并鼓励他来看。"
        "请以连续几段话输出，字数500字，主要介绍文章干货而不是交谈，不要使用标题符号或编号，成段输出即可。\n"
    )
    for article in articles:
        prompt += f"Title: {article.title}\nSummary: {article.text}\n"

    client = ZhipuAI(api_key=os.getenv("ZHIPU_KEY")) # Fill in your own APIKey
    response = client.chat.completions.create(
        model="glm-4-plus",  # Fill in the model code you need to call
        messages=[
            {"role": "system", "content": ""},
            {"role": "user", "content": prompt},
        ],
    )

    return response.choices[0].message.content

def create_database():
    db.create_all()
    # process all csv files under the chats folder
    # pdb.set_trace()
    for folder in os.listdir('chats'):
        for file in os.listdir(f'chats/{folder}'):
            if file.endswith('.csv'):
                # use the full path to the file
                process_csv(f'chats/{folder}/{file}')
    # process_csv('path/to/your/csvfile.csv')  # Process the CSV file at startup

# Define a function to scrape title, date, publisher from a given url
def scrape_article_info(url):

    client = ZhipuAI(api_key=os.getenv("ZHIPU_KEY")) # Fill in your own APIKey
    tools = [{
        "type": "web_search",
        "web_search": {
            "enable": True #默认为关闭状态（False） 禁用：False，启用：True。
        }
    }]

    messages = [
        {
            "role": "user",
            "content": "以json格式输出文章的总结包括title、date、publisher、label（1-3个）、summary（200字）：" + url
        }
    ]
    response = client.chat.completions.create(
        model="glm-4-plus", # 填写需要调用的模型名称
        messages=messages,
        tools=tools
    )
    # print(response.choices[0].message)
    response = response.to_dict()
    content = response['choices'][0]['message']['content']
    print(content)
    # json_str = content.replace("```json\n", "").replace("\n```", "")
    # content_dict = json.loads(json_str)
    # print(content_dict)

    # title = content_dict['title']
    # date = content_dict['date']
    # summary = content_dict['summary']
    # labels = content_dict['labels']
    # activity_bool = content_dict['activity_bool']
    # publisher = content_dict['publisher']


    # return title, date, summary, labels, activity_bool, publisher