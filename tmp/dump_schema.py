
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/digitalpds'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

def dump_schema():
    with app.app_context():
        inspector = inspect(db.engine)
        target_tables = ['teeth_reports', 'member_monthly_usage', 'appointments', 'kit_distributions']
        for table_name in target_tables:
            if table_name in inspector.get_table_names():
                print(f"\nTable: {table_name}")
                for column in inspector.get_columns(table_name):
                    print(f"  Column: {column['name']} ({column['type']})")
            else:
                print(f"\nTable {table_name} NOT FOUND")

if __name__ == "__main__":
    dump_schema()
