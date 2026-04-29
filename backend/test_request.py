import requests
try:
    res = requests.post("http://localhost:5002/seal", json={"data": "test payload", "type": "message", "name": "test asset"})
    print("STATUS:", res.status_code)
    print("TEXT:", res.text)
except Exception as e:
    print("REQUEST FAILED:", e)
