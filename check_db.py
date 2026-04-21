import pymysql
try:
    conn = pymysql.connect(host='localhost', user='root', password='')
    with conn.cursor() as cursor:
        cursor.execute("SHOW DATABASES")
        databases = [db[0] for db in cursor.fetchall()]
        print(f"Databases: {databases}")
        if 'digitalpds' in databases:
            cursor.execute("USE digitalpds")
            cursor.execute("SHOW TABLES")
            tables = [tb[0] for tb in cursor.fetchall()]
            print(f"Tables in digitalpds: {tables}")
            if 'users' in tables:
                cursor.execute("DESCRIBE users")
                columns = cursor.fetchall()
                print("\nColumns in 'users' table:")
                for col in columns:
                    print(col)
        else:
            print("ERROR: database 'digitalpds' DOES NOT EXIST")
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
