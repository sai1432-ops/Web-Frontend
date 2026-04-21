import requests
import json

BASE_URL = "http://localhost:5050"

def check_endpoint(name, path):
    url = f"{BASE_URL}{path}"
    try:
        print(f"Pinging {name} ({url})...", end=" ")
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            print("[ONLINE] ✅")
            return True
        else:
            print(f"[ERROR {response.status_code}] ❌")
            return False
    except Exception as e:
        print(f"[OFFLINE] ❌ ({str(e)})")
        return False

if __name__ == "__main__":
    print("\n--- DigitalPDS Live Integration Check (Port 5050) ---")
    
    # Core endpoints needed for the web app to function
    endpoints = [
        ("Admin Dashboard Stats", "/admin/dashboard-stats"),
        ("Admin Dealer Listing", "/admin/dealers"),
        ("Admin Beneficiary Listing", "/admin/beneficiaries"),
        ("Admin Distribution List", "/admin/distributions"),
    ]
    
    success_count = 0
    for name, path in endpoints:
        if check_endpoint(name, path):
            success_count += 1
            
    print(f"\nSummary: {success_count}/{len(endpoints)} core integration points are LIVE.")
    if success_count == len(endpoints):
        print("RESULT: YES, your application is fully integrated with the backend on port 5050.")
    else:
        print("RESULT: PARTIAL integration. Some endpoints are missing or the backend is not fully ready.")
