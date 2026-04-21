import pymysql

try:
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="digitalpds"
    )
    cursor = conn.cursor()
    
    table_name = "brushing_checkins"
    cursor.execute(f"DESCRIBE {table_name}")
    print(f"--- {table_name} ---")
    for row in cursor.fetchall():
        print(f"Col: {row[0]}")
    
    table_name = "users"
    cursor.execute(f"DESCRIBE {table_name}")
    print(f"--- {table_name} ---")
    for row in cursor.fetchall():
        print(f"Col: {row[0]}")
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
