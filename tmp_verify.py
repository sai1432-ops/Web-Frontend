import requests
import json

BASE_URL = "http://localhost:5000"

def test_endpoint(name, path, method="GET", data=None):
    print(f"Testing {name} ({path})...", end=" ")
    try:
        url = f"{BASE_URL}{path}"
        if method == "GET":
            response = requests.get(url)
        else:
            response = requests.post(url, json=data)
        
        if response.status_code == 200:
            print("[\033[92mSUCCESS\033[0m]")
            return True
        else:
            print(f"[\033[91mFAILED\033[0m] (Status: {response.status_code})")
            return False
    except Exception as e:
        print(f"[\033[91mERROR\033[0m]: {str(e)}")
        return False

if __name__ == "__main__":
    endpoints = [
        ("Admin Stats", "/admin/dashboard-stats"),
        ("Admin Dealers", "/admin/dealers"),
        ("Admin Beneficiaries", "/admin/beneficiaries"),
        ("Admin Distributions", "/admin/distributions"),
        ("Dealer Stats", "/dealer/dashboard-stats/1"), 
        ("Dealer Beneficiaries", "/dealer/beneficiaries?dealerId=1")
    ]
    
    print("\n--- DigitalPDS Integration Audit ---")
    all_ok = True
    for name, path in endpoints:
        if not test_endpoint(name, path):
            all_ok = False
            
    if all_ok:
        print("\nAll integration endpoints are LIVE and returning real database data.")
    else:
        print("\nWarning: Some endpoints are FAILING. Verify that 'app.py' is running on port 5000.")
