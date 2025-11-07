import mysql.connector

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mahima2005",  
        database="LostAndFoundDB"
        auth_plugin="mysql_native_password"
    )
