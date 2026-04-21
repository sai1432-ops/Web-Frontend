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

# Try different payload structures for confirm-kit-by-dealer-qr
payloads = [
    # 1. Current (likely what produces the "Please confirm" toast)
    {
        "beneficiary_id": 10,
        "dealer_qr_value": "D-778899",
        "brush_received": 1,
        "paste_received": 1,
        "iec_received": 1,
        "old_kit_returned": True
    },
    # 2. Try with user_id instead of beneficiary_id
    {
        "user_id": 10,
        "dealer_qr_value": "D-778899",
        "brush_received": 1,
        "paste_received": 1,
        "iec_received": 1,
        "old_kit_returned": True
    },
    # 3. Try with confirm: True
    {
        "beneficiary_id": 10,
        "confirm": True,
        "dealer_qr_value": "D-778899",
        "brush_received": 1,
        "paste_received": 1,
        "iec_received": 1,
        "old_kit_returned": True
    },
    # 4. Try with auto_confirm: True
    {
        "beneficiary_id": 10,
        "auto_confirm": True,
        "dealer_qr_value": "D-778899",
        "brush_received": 1,
        "paste_received": 1,
        "iec_received": 1,
        "old_kit_returned": True
    }
]

for i, p in enumerate(payloads):
    c, b = req("/user/confirm-kit-by-dealer-qr", p)
    print(f"--- TEST {i+1} ---")
    print(f"PAYLOAD: {p}")
    print(f"STATUS: {c}")
    print(f"BODY: {b}")
    print()
