from db import get_db

try:
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SHOW TABLES;")
    tables = cur.fetchall()
    print("✅ Connection successful!")
    print("Tables in database:", [t[0] for t in tables])
    cur.close()
    conn.close()
except Exception as e:
    print("❌ Connection failed:", e)
