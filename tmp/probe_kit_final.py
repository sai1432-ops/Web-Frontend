import urllib.request, json

BASE = "http://localhost:5050"

def req(path, data):
    url = BASE + path
    try:
        body = json.dumps(data).encode()
        h = {"Content-Type": "application/json"}
        r = urllib.request.Request(url, data=body, method="POST", headers=h)
        with urllib.request.urlopen(r, timeout=4) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as ex:
        return 0, str(ex)

endpoints = [
    "/user/confirm-kit-receipt",
    "/user/confirm-kit-receipt/",
    "/user/confirm_kit_receipt",
    "/user/confirm-distribution",
    "/user/confirm-kit",
    "/user/confirm-receipt",
    "/api/user/confirm-kit-receipt",
    "/api/user/confirm-distribution"
]

for p in endpoints:
    status, body = req(p, {"user_id": 10, "kit_unique_id": "test", "dealer_qr_value": "test"})
    print(f"{status} POST {p}: {body[:50]}")
