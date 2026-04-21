import urllib.request, json

BASE = "http://localhost:5050"

def req(method, path, data):
    url = BASE + path
    try:
        body = json.dumps(data).encode()
        h = {"Content-Type": "application/json"}
        r = urllib.request.Request(url, data=body, method=method, headers=h)
        with urllib.request.urlopen(r, timeout=4) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as ex:
        return 0, str(ex)

# Test Step 2 endpoints
tests = [
    ("POST", "/user/confirm-kit-receipt", {"user_id": 10, "kit_unique_id": "test"}),
    ("PUT", "/user/confirm-kit-receipt", {"user_id": 10, "kit_unique_id": "test"}),
    ("POST", "/api/user/confirm-kit-receipt", {"user_id": 10}),
    ("POST", "/user/finalize-kit", {"user_id": 10}),
    ("POST", "/user/confirm-receipt", {"user_id": 10}),
    ("POST", "/user/distribution-confirm", {"user_id": 10}),
]

for m, p, d in tests:
    status, body = req(m, p, d)
    print(f"{status} {m} {p}: {body[:100]}")
