import pymysql

def check_table(cursor, table_name):
    try:
        cursor.execute(f"DESCRIBE {table_name}")
        columns = [row[0] for row in cursor.fetchall()]
        print(f"Table: {table_name}")
        print(f"Columns: {columns}")
        return columns
    except Exception as e:
        print(f"Error checking {table_name}: {e}")
        return []

try:
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="digitalpds"
    )
    cursor = conn.cursor()
    
    check_table(cursor, "users")
    check_table(cursor, "family_members")
    check_table(cursor, "brushing_checkins")
    check_table(cursor, "kit_distributions")
    
    conn.close()
except Exception as e:
    print(f"Connection Error: {e}")
