import json
import os
import random

MIN_MESSAGES_PER_ROOM = 15
MAX_MESSAGES_PER_ROOM = 25

room_names = ["thunderdome", "ftails", "korea", "suisse",
              "testnet", "ftmsonic", "test", "mclb", "nodo", "hi", "abcd", "afgh", "testasd", "haha"]

names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve',
         'Frank', 'Grace', 'Helen', 'Ivy', 'Jack']
avatars = [
    '/img/avatar-1.jpg',
    '/img/avatar-2.jpg',
    '/img/avatar-3.png'
]

potential_messages = [
    "Hello",
    "Hi",
    "How are you?",
    "I'm fine",
    "What are you doing?",
    "Nothing much",
    "How about you?",
]


def mock_chat():
    rooms = []
    for i in range(len(room_names)):
        messages = []
        for j in range(random.randint(MIN_MESSAGES_PER_ROOM, MAX_MESSAGES_PER_ROOM)):
            is_me = random.randint(0, 3) != 3
            message = {
                "username": "Me" if is_me else names[i % len(names)],
                "avatar": avatars[0] if is_me else random.choice(avatars),
                "time": f"{(i+1) * 2} days ago",
                "isMe": is_me,
                "content": [
                    random.choice(potential_messages) for _ in range(
                        random.randint(1, 3)
                    )
                ]
            }
            messages.append(message)
        room = {
            "roomName": room_names[i % len(room_names)],
            "unread": f"{random.randint(0, 10)}",
            "price": f"{random.randint(0, 10)}FTM",
            "messages": messages,
            "lastMessage": messages[-1]["content"][-1],
            "lastTime": messages[-1]["time"]
        }
        rooms.append(room)
    with open("./public/mock/chat_history.json", "w") as f:
        f.write(json.dumps(rooms, indent=4))


def mock_leaderboard():
    leaderboard = []
    for i in range(10):
        user = {
            "user": names[i % len(names)],
            "avatar": random.choice(avatars),
            "points": random.randint(0, 10) + 10 * (10-i),
            "x": '@' + names[i % len(names)].replace(' ', ''),
        }
        leaderboard.append(user)
    with open("./public/mock/leaderboard.json", "w") as f:
        f.write(json.dumps(leaderboard, indent=4))


def mock_activities():
    activities = []
    for i in range(10):
        activity = {
            "user": names[i % len(names)],
            "group": random.choice(room_names),
            "avatar": random.choice(avatars),
            "avatar2": random.choice(avatars),
            "time": f"{(i+1) * 2} days ago",
            "price": f"{random.randint(0, 10)}FTM",
        }
        activities.append(activity)
    with open("./public/mock/activities.json", "w") as f:
        f.write(json.dumps(activities, indent=4))


MAX_DOCS_PER_CAT = 10
MAX_TAGS_PER_DOC = 3


def mock_documentation():
    tags = ['Trade', 'Media', 'Earn', 'Security']
    cats = ['Security', 'Mode', 'Earn']
    docs = {}
    for cat in cats:
        subdocs = []
        for i in range(MAX_DOCS_PER_CAT):
            doc = {
                "title": f"A {cat} Document {i+1}",
                "tags": random.sample(tags, random.randint(1, MAX_TAGS_PER_DOC)),
                "category": cat,
                "link": "/documentation"
            }
            subdocs.append(doc)
        docs[cat] = subdocs
    with open("./public/mock/documentation.json", "w") as f:
        f.write(json.dumps(docs, indent=4))


def main():
    mock_chat()
    mock_leaderboard()
    mock_activities()
    mock_documentation()


main()
