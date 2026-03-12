import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api"

def test_system():
    print("--- System Verification ---")
    
    # 1. Register
    email = f"test_{int(time.time())}@example.com"
    reg_data = {
        "name": "Integration Tester",
        "email": email,
        "age": 30,
        "password": "Password123!"
    }
    print(f"Registering user: {email}")
    try:
        reg_res = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
        if reg_res.status_code != 201:
            print(f"Registration failed (Status {reg_res.status_code}): {reg_res.text}")
            if reg_res.status_code == 422:
                print("422 Error Details:", json.dumps(reg_res.json(), indent=2))
            return
        print("Registration successful.")
    except Exception as e:
        print(f"Connection error during registration: {e}")
        return
    
    # 2. Login
    print("Logging in...")
    login_data = {
        "username": email,
        "password": "Password123!"
    }
    try:
        login_res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
        if login_res.status_code != 200:
            print(f"Login failed (Status {login_res.status_code}): {login_res.text}")
            return
        
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("Login successful.")
    except Exception as e:
        print(f"Connection error during login: {e}")
        return
    
    # 3. Generate Course
    gen_data = {
        "topic": "Python Fundamentals",
        "difficulty": "Beginner"
    }
    print(f"Generating course for: {gen_data['topic']}")
    print("This may take 10-20 seconds...")
    start_time = time.time()
    try:
        gen_res = requests.post(f"{BASE_URL}/courses/generate", json=gen_data, headers=headers)
        duration = time.time() - start_time
        
        if gen_res.status_code == 201:
            print(f"SUCCESS! Course generated in {duration:.2f} seconds.")
            course = gen_res.json()
            print(f"Title: {course['title']}")
            print(f"Modules: {len(course['modules'])}")
        else:
            print(f"FAILED (Status {gen_res.status_code}): {gen_res.text}")
            if gen_res.status_code == 422:
                print("422 Error Details:", json.dumps(gen_res.json(), indent=2))
    except Exception as e:
        print(f"Connection error during course generation: {e}")

if __name__ == "__main__":
    test_system()
