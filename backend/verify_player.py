import requests
import json
import time
import sys
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000/api"

def test_player_fixes():
    print("--- PlayerPage Fix Verification ---")
    
    email = f"player_test_{int(time.time())}@example.com"
    reg_data = {"name": "Player Tester", "email": email, "age": 25, "password": "Pass123!"}
    
    print(f"1. Registering: {email}")
    reg_res = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    if reg_res.status_code != 201:
        print(f"   Registration failed: {reg_res.text}")
        return
    
    login_data = {"username": email, "password": "Pass123!"}
    login_res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    if login_res.status_code != 200:
        print(f"   Login failed: {login_res.text}")
        return
    
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("   Auth OK")
    
    print("2. Generating course (~15s)...")
    gen_res = requests.post(f"{BASE_URL}/courses/generate", 
                           json={"topic": "HTML Basics", "difficulty": "Beginner"}, 
                           headers=headers)
    if gen_res.status_code != 201:
        print(f"   Generation failed ({gen_res.status_code}): {gen_res.text}")
        return
    
    course = gen_res.json()
    print(f"   Course: {course['title']} ({len(course['modules'])} modules)")
    
    first_topic = course['modules'][0]['topics'][0]
    topic_id = first_topic.get('id')
    print(f"3. First topic ID: {topic_id} (title: {first_topic['title']})")
    
    if topic_id is None:
        print("   FAIL: Topic ID is None!")
        return
    print("   Topic ID present - PASS")
    
    print(f"4. Fetching content for topic {topic_id}...")
    topic_res = requests.get(f"{BASE_URL}/courses/topics/{topic_id}", headers=headers)
    if topic_res.status_code == 200:
        td = topic_res.json()
        print(f"   Beginner: {'PASS' if td.get('beginner_content') else 'EMPTY'}")
        print(f"   Intermediate: {'PASS' if td.get('intermediate_content') else 'EMPTY'}")
        print(f"   Expert: {'PASS' if td.get('expert_content') else 'EMPTY'}")
        print(f"   Quizzes: {len(td.get('quizzes', []))}")
    else:
        print(f"   Topic fetch failed ({topic_res.status_code}): {topic_res.text}")
    
    print(f"5. Completing topic {topic_id}...")
    complete_res = requests.post(f"{BASE_URL}/courses/topics/{topic_id}/complete", headers=headers)
    if complete_res.status_code == 200:
        print(f"   Complete: PASS ({complete_res.json()})")
    else:
        print(f"   Complete failed ({complete_res.status_code}): {complete_res.text}")
    
    print("\n--- All checks done ---")

if __name__ == "__main__":
    test_player_fixes()
