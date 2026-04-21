import sys
import os

# Add the directory containing app.py to sys.path
sys.path.append(r'C:\xampp\htdocs\pdssystem')

try:
    from app import app, db, User, FamilyMember, BrushingCheckin
    with app.app_context():
        print("User Columns:", [c.name for c in User.__table__.columns])
        print("FamilyMember Columns:", [c.name for c in FamilyMember.__table__.columns])
        print("BrushingCheckin Columns:", [c.name for c in BrushingCheckin.__table__.columns])
except Exception as e:
    print(f"ERROR: {str(e)}")
