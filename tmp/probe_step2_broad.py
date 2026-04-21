import urllib.request, json

BASE = "http://localhost:5050"

def req(path, data=None):
    url = BASE + path
    try:
        body = json.dumps(data).encode() if data else None
        h = {"Content-Type": "application/json"}
        r = urllib.request.Request(url, data=body, method="POST", headers=h)
        with urllib.request.urlopen(r, timeout=4) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as ex:
        return 0, str(ex)

# Probable endpoints according to user pattern
paths = [
    "/user/confirm-kit-receipt",
    "/user/confirm_kit_receipt",
    "/user/kit-receipt-confirm",
    "/user/confirm-receipt",
    "/user/kit-confirmation",
    "/api/user/confirm-kit-receipt"
]

for p in paths:
    s, b = req(p, {"user_id": 10, "kit_unique_id": "test"})
    print(f"{s} POST {p}: {b[:50]}")
