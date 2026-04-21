import pymysql
import json

def check_table(cursor, table_name):
    with open('db_output.txt', 'a') as f:
        try:
            cursor.execute(f"DESCRIBE {table_name}")
            cols = cursor.fetchall()
            columns = [row[0] for row in cols]
            f.write(f"Table: {table_name}\n")
            f.write(f"Columns: {json.dumps(columns)}\n")
            
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 1")
            row = cursor.fetchone()
            if row:
                f.write(f"Sample Row: {list(row)}\n")
            return columns
        except Exception as e:
            f.write(f"Error checking {table_name}: {e}\n")
            return []

try:
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="digitalpds"
    )
    cursor = conn.cursor()
    
    check_table(cursor, "teeth_reports")
    
    conn.close()
except Exception as e:
    print(f"Connection Error: {e}")
