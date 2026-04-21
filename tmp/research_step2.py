import urllib.request, json

BASE = "http://localhost:5050"

def req(method, path, data=None):
    url = BASE + path
    try:
        body = json.dumps(data).encode() if data else None
        h = {"Content-Type": "application/json"}
        r = urllib.request.Request(url, data=body, method=method, headers=h)
        with urllib.request.urlopen(r, timeout=4) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as ex:
        return 0, str(ex)

# Test Step 2 endpoint with various methods
print("Testing /user/confirm-kit-receipt...")
s1, b1 = req("POST", "/user/confirm-kit-receipt", {"user_id": 10, "kit_unique_id": "test"})
print(f"POST: {s1}")
print(f"BODY Snippet: {b1[:100]}")

s2, b2 = req("PUT", "/user/confirm-kit-receipt", {"user_id": 10, "kit_unique_id": "test"})
print(f"PUT: {s2}")
print(f"BODY Snippet: {b2[:100]}")

print("\nTesting /user/confirm_kit_receipt (underscore)...")
s3, b3 = req("POST", "/user/confirm_kit_receipt", {"user_id": 10, "kit_unique_id": "test"})
print(f"POST: {s3}")
print(f"BODY Snippet: {b3[:100]}")
