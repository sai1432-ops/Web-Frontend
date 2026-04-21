import urllib.request, json

BASE = "http://localhost:5050"

def check(path):
    url = BASE + path
    try:
        r = urllib.request.Request(url, method="POST", data=json.dumps({"test":1}).encode(), headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(r, timeout=2) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except:
        return 0, ""

targets = [
    "/user/confirm-kit",
    "/user/confirm-kit-receipt",
    "/user/confirm-kit-distribution",
    "/user/confirm_kit_receipt",
    "/user/kit-confirm",
    "/user/confirm-distribution",
    "/user/confirm",
    "/user/receipt-confirm",
    "/user/kit/confirm",
    "/user/confirm-kit-by-dealer-qr",
    "/api/user/confirm-kit-receipt"
]

results = []
for t in targets:
    code, body = check(t)
    is_json = body.strip().startswith("{")
    results.append(f"{code} POST {t} -> JSON={is_json} | {body[:50]}")

with open("tmp/probe_exhaustive.txt", "w") as f:
    f.write("\n".join(results))
