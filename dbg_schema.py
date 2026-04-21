import pymysql

try:
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="digitalpds"
    )
    cursor = conn.cursor()
    for t in ['users', 'family_members', 'brushing_checkins', 'kit_distributions']:
        cursor.execute(f"DESCRIBE {t}")
        print(f"--- {t} ---")
        cols = [row[0] for row in cursor.fetchall()]
        print(cols)
    conn.close()
except Exception as e:
    print(f"Error: {e}")
