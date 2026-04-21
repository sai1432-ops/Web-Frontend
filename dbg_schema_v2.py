import pymysql

output_file = r"c:\Users\APPANAGIRI\OneDrive\Desktop\digitalpds-web\Digitalpds\db_schema_output.txt"

try:
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="digitalpds"
    )
    cursor = conn.cursor()
    with open(output_file, "w") as f:
        for t in ['users', 'family_members', 'brushing_checkins', 'kit_distributions']:
            cursor.execute(f"DESCRIBE {t}")
            f.write(f"--- {t} ---\n")
            cols = [row[0] for row in cursor.fetchall()]
            f.write(", ".join(cols) + "\n\n")
    conn.close()
    print("Schema written to file successfully.")
except Exception as e:
    print(f"Error: {e}")
