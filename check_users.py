import pymysql
try:
    conn = pymysql.connect(host='localhost', user='root', password='', db='digitalpds')
    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute("SELECT id, name, email, password_hash FROM users")
        users = cursor.fetchall()
        print(f"Users in DB: {users}")
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
