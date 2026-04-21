import requests

BASE_URL = "http://localhost:5050"
ENDPOINTS = [
    "/user/forgot-password",
    "/user/forgot_password",
    "/api/user/forgot-password",
    "/api/user/forgot_password",
    "/auth/forgot-password",
    "/auth/forgot_password",
    "/forgot-password",
    "/forgot_password",
    "/dealer/forgot-password",
    "/dealer/forgot_password",
    "/api/dealer/forgot-password",
    "/api/dealer/forgot_password",
    "/user/reset-password",
    "/user/reset_password",
    "/dealer/reset-password",
    "/dealer/reset_password",
    "/user/change-password",
    "/user/change_password"
]

METHODS = ["POST", "PUT"]

print("--- Endpoint Discovery ---")
for ep in ENDPOINTS:
    for method in METHODS:
        try:
            # We don't need real data, we just want to see if we get something OTHER than 404
            response = requests.request(method, f"{BASE_URL}{ep}", json={}, timeout=2)
            if response.status_code != 404:
                print(f"[FOUND] {method} {ep} -> Status: {response.status_code}")
            else:
                pass # print(f"[404] {method} {ep}")
        except Exception as e:
            print(f"[ERROR] {method} {ep} -> {str(e)}")

print("--- Discovery Complete ---")
