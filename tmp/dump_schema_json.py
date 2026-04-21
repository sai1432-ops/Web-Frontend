
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/digitalpds'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

def dump_schema():
    schema = {}
    with app.app_context():
        inspector = inspect(db.engine)
        target_tables = ['teeth_reports', 'member_monthly_usage', 'appointments', 'kit_distributions', 'family_members', 'brushing_checkins']
        for table_name in target_tables:
            if table_name in inspector.get_table_names():
                schema[table_name] = []
                for column in inspector.get_columns(table_name):
                    schema[table_name].append({
                        'name': column['name'],
                        'type': str(column['type'])
                    })
    
    with open('tmp/full_schema.json', 'w') as f:
        json.dump(schema, f, indent=2)

if __name__ == "__main__":
    dump_schema()
