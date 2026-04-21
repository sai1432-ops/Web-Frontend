import urllib.request, json

BASE = "http://localhost:5050"

def req(method, path, data=None):
    url = BASE + path
    try:
        body = json.dumps(data).encode() if data else None
        h = {"Content-Type": "application/json"}
        r = urllib.request.Request(url, data=body, method=method, headers=h)
        with urllib.request.urlopen(r, timeout=4) as resp:
            return resp.status, resp.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "ignore")
    except Exception as ex:
        return 0, str(ex)

# Test registration and dealer selection endpoints
tests = [
    ("POST", "/api/user/register", {"name": "Test"}),
    ("POST", "/user/register", {"name": "Test"}),
    ("POST", "/api/user/select-dealer", {"user_id": 1, "dealer_id": 1}),
    ("POST", "/user/select-dealer", {"user_id": 1, "dealer_id": 1}),
    ("POST", "/user/select-dealer", {"userId": 1, "dealerId": 1}),
]

print("Checking other /api/ user endpoints...")
results = []
for m, p, d in tests:
    c, b = req(m, p, d)
    is_json = b.strip().startswith("{") or b.strip().startswith("[")
    results.append(f"{c} {m} {p} -> {'JSON' if is_json else 'HTML'} | {b[:80]}")

with open("tmp/api_check_results.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(results))
