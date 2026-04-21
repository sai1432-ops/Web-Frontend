import urllib.request, json
import os

BASE = "http://localhost:5050"

def check_endpoint(method, path):
    url = BASE + path
    try:
        r = urllib.request.Request(url, method=method)
        with urllib.request.urlopen(r, timeout=2) as resp:
            return resp.status, "EXIST"
    except urllib.error.HTTPError as e:
        # 400 or 401 means the route exists but request is bad
        if e.code in [400, 401, 422, 405]:
            return e.code, "EXIST (BAD REQ/AUTH)"
        return e.code, "NOT EXIST"
    except Exception as ex:
        return 0, str(ex)

endpoints = [
    ("/user/profile-image/1", "POST"),
    ("/api/user/profile-image/1", "POST"),
    ("/user/profile-photo/1", "POST"),
    ("/api/user/profile-photo/1", "POST"),
    ("/user/upload-image/1", "POST"),
    ("/api/user/upload-image/1", "POST"),
    ("/user/profile-image/1", "PUT"),
    ("/api/user/profile-image/1", "PUT"),
]

results = []
for path, method in endpoints:
    code, status = check_endpoint(method, path)
    results.append(f"{method} {path} -> {code} ({status})")

print("\n".join(results))
with open("c:/Users/APPANAGIRI/OneDrive/Desktop/digitalpds-web/Digitalpds/tmp/route_probe.txt", "w") as f:
    f.write("\n".join(results))
