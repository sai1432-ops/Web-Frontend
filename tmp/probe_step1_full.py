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

# Need a valid dealer QR for this to work
# I saw Krishna (9059892833) earlier. Maybe his phone is the QR?
# Or maybe D-10?
payload = {
    "beneficiary_id": 10,
    "dealer_qr_value": "9059892833", # try phone
    "brush_received": 1,
    "paste_received": 1,
    "iec_received": 1,
    "old_kit_returned": True
}

status, body = req("/user/confirm-kit-by-dealer-qr", payload)
print(f"STATUS: {status}")
print(f"BODY: {body}")
