from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db
#Get posts - get all posts (with joins)

app = Flask(__name__)
CORS(app)


@app.route("/students", methods=["POST"])
def add_student():
    data = request.json
    conn = get_db()
    cur = conn.cursor()

    sql = """
        INSERT INTO Student (
            student_id, first_name, middle_name, last_name,
            section, course, DOB, student_password, phone_number, alternate_phone
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);
    """

    values = (
        data["student_id"],
        data["first_name"],
        data["middle_name"],
        data["last_name"],
        data["section"],
        data["course"],
        data["DOB"],
        data["password"],
        data["phone_number"],
        data["alternate_phone"]
    )

    cur.execute(sql, values)
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"message": "Student added successfully"})

@app.route("/login", methods=["POST"])
def login_student():
    data = request.json
    conn = get_db()
    cur = conn.cursor()

    sql = """
        SELECT * FROM Student WHERE student_id = %s AND student_password = %s;
    """

    values = (
        data["student_id"],
        data["password"]
    )

    cur.execute(sql, values)
    user=cur.fetchone()

    cur.close()
    conn.close()

    if user:
        return jsonify({"success":True, "message": "Login successful", "user":user})
    else:
        return jsonify({"success":False, "message": "Wrong ID or Password"})
    
@app.route("/students", methods=["GET"])
def get_student():
    
    conn=get_db()
    cur=conn.cursor()

    sql = """
        SELECT * FROM Student;
    """

    cur.execute(sql)
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"List of Students who Have Lost Items"})

@app.route("/items", methods=["GET"])
def get_items():
    
    conn=get_db()
    cur=conn.cursor()

    sql="""
        SELECT * FROM Item GROUP BY category;
    """
    cur.execute(sql)
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"List of Items Lost"})

@app.route("/locations", methods=["GET"])
def get_location():
    
    conn=get_db()
    cur=conn.cursor()

    sql="""
        SELECT * FROM Location GROUP BY building_name;
    """
    cur.execute(sql)
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"List of Locations"})

@app.route("/status", methods=["GET"])
def get_status():
    
    conn=get_db()
    cur=conn.cursor()

    sql="""
        SELECT DISTINCT status_name FROM status;
    """

    cur.execute(sql)
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"Statuses"})

@app.route("/posts", methods=["POST"])
def add_posts():
    data = request.json
    conn = get_db()
    cur = conn.cursor()

    try:
        # 1️⃣ Insert into Item
        cur.execute("""
            INSERT INTO Item (name, category, description)
            VALUES (%s, %s, %s)
        """, (data["item_name"], data["item_category"], data["item_description"]))
        item_id = cur.lastrowid

        # 2️⃣ Insert into Location
        cur.execute("""
            INSERT INTO Location (building_name, area_name, loc_description)
            VALUES (%s, %s, %s)
        """, (data["building_name"], data["area_name"], data["loc_description"]))
        location_id = cur.lastrowid

        # 3️⃣ Insert into Post
        cur.execute("""
            INSERT INTO Post (student_id, item_id, location_id, status_id, p_description)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data["student_id"],
            item_id,
            location_id,
            data["status_id"],
            data["item_description"],  # using same as item desc
        ))

        conn.commit()
        return jsonify({"message": "Post added successfully!"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()

@app.route("/posts", methods=["GET"])
def get_posts():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    
    cur.execute("""
        SELECT 
            p.post_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
            i.name AS item_name,
            i.description AS item_description,
            l.building_name,
            l.area_name,
            l.loc_description,
            p.p_description,
            st.status_name,
            p.date_posted
        FROM Post p
        JOIN Student s ON p.student_id = s.student_id
        JOIN Item i ON p.item_id = i.item_id
        LEFT JOIN Location l ON p.location_id = l.location_id
        JOIN Status st ON p.status_id = st.status_id
        ORDER BY p.date_posted DESC
    """)
    
    posts = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(posts)





#PUT /posts/<post_id>/status - update the status of a post


@app.route("/posts/<int:post_id>/status", methods=["PUT"])
def update_post_status(post_id):
    data = request.json
    conn = get_db()
    cur = conn.cursor()

    sql = "UPDATE Post SET status_id = %s WHERE post_id = %s"
    cur.execute(sql, (data["status_id"], post_id))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"message": "Post status updated successfully"})

#DELETE /posts/<post_id> - delete a post

@app.route("/posts/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("DELETE FROM Post WHERE post_id = %s", (post_id,))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"message": f"Post {post_id} deleted successfully"})

# POST /requests - create match request
@app.route("/requests", methods=["POST"])
def add_request():
    data = request.json
    conn = get_db()
    cur = conn.cursor()

    sql = """
        INSERT INTO Match_Request (post_id, student_id, message)
        VALUES (%s, %s, %s)
    """
    values = (
        data["post_id"],
        data["student_id"],
        data["message"]
    )

    cur.execute(sql, values)
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"message": "Match request created successfully"})

# GET /requests - get all match requests
@app.route("/requests", methods=["GET"])
def get_requests():
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    sql = """
        SELECT 
            r.request_id,
            r.post_id,
            CONCAT_WS(' ', s.first_name, s.last_name) AS requester_name,
            r.message,
            r.request_date,
            p.p_description AS post_description
        FROM Match_Request r
        JOIN Student s ON r.student_id = s.student_id
        JOIN Post p ON r.post_id = p.post_id
        ORDER BY r.request_date DESC
    """

    cur.execute(sql)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(rows)

@app.route("/items", methods=["POST"])
def add_item():
    data = request.json
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO Item (name, category, description) VALUES (%s, %s, %s)",
        (data["name"], data["category"], data["description"]),
    )
    conn.commit()
    item_id = cur.lastrowid
    cur.close()
    conn.close()
    return jsonify({"item_id": item_id})

@app.route("/locations", methods=["POST"])
def add_location():
    data = request.json
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO Location (building_name, area_name, loc_description) VALUES (%s, %s, %s)",
        (data["building_name"], data["area_name"], data["loc_description"]),
    )
    conn.commit()
    location_id = cur.lastrowid
    cur.close()
    conn.close()
    return jsonify({"location_id": location_id})


# PUT /requests/<request_id>/approve - approve a match request
@app.route("/requests/<int:request_id>/approve", methods=["PUT"])
def approve_request(request_id):
    conn = get_db()
    cur = conn.cursor()

    try:
        # Get the post_id related to this match request
        cur.execute("SELECT post_id FROM Match_Request WHERE request_id = %s", (request_id,))
        result = cur.fetchone()

        if not result:
            return jsonify({"error": "Match request not found"}), 404

        post_id = result[0]

        # Update post status to 'returned' (status_id = 3)
        cur.execute("UPDATE Post SET status_id = 3, status_updated = CURDATE() WHERE post_id = %s", (post_id,))

        # Optionally, delete or mark the request as approved (if you add a column for that)
        # cur.execute("UPDATE Match_Request SET approved = TRUE WHERE request_id = %s", (request_id,))

        conn.commit()

        return jsonify({
            "message": f"Match request {request_id} approved successfully",
            "post_updated": post_id
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()


# GET /dashboard/summary
@app.route("/dashboard/summary", methods=["GET"])
def get_dashboard_summary():
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    sql = """
        SELECT st.status_name, COUNT(p.post_id) AS total_posts
        FROM Post p
        JOIN Status st ON p.status_id = st.status_id
        GROUP BY st.status_name
    """

    cur.execute(sql)
    rows = cur.fetchall()

    # You can also add total students or requests if you want
    cur.execute("SELECT COUNT(*) AS total_students FROM Student")
    students = cur.fetchone()

    cur.execute("SELECT COUNT(*) AS total_requests FROM Match_Request")
    requests = cur.fetchone()

    cur.close()
    conn.close()

    summary = {
        "status_summary": rows,
        "total_students": students["total_students"],
        "total_requests": requests["total_requests"]
    }

    return jsonify(summary)

@app.route("/dashboard/all", methods=["GET"])
def get_all_tables():
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    tables = {}

    for table in ["Student", "Item", "Location", "Post", "Match_Request"]:
        cur.execute(f"SELECT * FROM {table}")
        tables[table] = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(tables)

@app.route("/matchrequests", methods=["GET"])
def get_match_requests():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT 
            m.request_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
            p.post_id,
            i.name AS item_name,
            l.building_name,
            l.area_name,
            m.message,
            m.request_date
        FROM Match_Request m
        JOIN Post p ON m.post_id = p.post_id
        JOIN Student s ON m.student_id = s.student_id
        JOIN Item i ON p.item_id = i.item_id
        LEFT JOIN Location l ON p.location_id = l.location_id
        ORDER BY m.request_date DESC
    """)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

# ✅ Get requests for a student's posts
@app.route("/matchrequests/<student_id>", methods=["GET"])
def get_requests_for_owner(student_id):
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT m.request_id, m.message, m.request_date,
               CONCAT(r.first_name, ' ', r.last_name) AS requester_name,
               i.name AS item_name
        FROM Match_Request m
        JOIN Post p ON m.post_id = p.post_id
        JOIN Student r ON m.student_id = r.student_id
        JOIN Item i ON p.item_id = i.item_id
        WHERE p.student_id = %s
        ORDER BY m.request_date DESC
    """, (student_id,))
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

# ✅ Get student summary (total posts, total match requests received)
@app.route("/student/<student_id>/summary", methods=["GET"])
def get_student_summary(student_id):
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    # Count total posts by the student
    cur.execute("SELECT COUNT(*) AS total_posts FROM Post WHERE student_id = %s", (student_id,))
    total_posts = cur.fetchone()["total_posts"]

    # Count total match requests for the student's posts
    cur.execute("""
        SELECT COUNT(*) AS match_requests_received
        FROM Match_Request mr
        JOIN Post p ON mr.post_id = p.post_id
        WHERE p.student_id = %s
    """, (student_id,))
    total_requests = cur.fetchone()["match_requests_received"]

    cur.close()
    conn.close()

    return jsonify({
        "total_posts": total_posts,
        "match_requests_received": total_requests
    })

# ✅ Get all posts created by a specific student
@app.route("/student/<student_id>/posts", methods=["GET"])
def get_student_posts(student_id):
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT 
            p.post_id,
            i.name AS item_name,
            i.description AS item_description,
            l.building_name,
            l.area_name,
            st.status_name,
            p.date_posted
        FROM Post p
        JOIN Item i ON p.item_id = i.item_id
        LEFT JOIN Location l ON p.location_id = l.location_id
        JOIN Status st ON p.status_id = st.status_id
        WHERE p.student_id = %s
        ORDER BY p.date_posted DESC
    """, (student_id,))

    posts = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(posts)

@app.route("/requests/<int:request_id>/approve", methods=["PUT"])
def approve_match_request(request_id):
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    # Check if request exists
    cur.execute("SELECT post_id FROM Match_Request WHERE request_id = %s", (request_id,))
    result = cur.fetchone()
    if not result:
        cur.close()
        conn.close()
        return jsonify({"error": "Request not found"}), 404

    post_id = result["post_id"]

    # Update match request status → approved
    cur.execute(
        "UPDATE Match_Request SET request_status = 'approved' WHERE request_id = %s",
        (request_id,)
    )

    # Update post status → returned (status_id = 3)
    cur.execute(
        "UPDATE Post SET status_id = 3, status_updated = CURDATE() WHERE post_id = %s",
        (post_id,)
    )

    conn.commit()

    # Fetch the updated request to confirm
    cur.execute("SELECT * FROM Match_Request WHERE request_id = %s", (request_id,))
    updated_request = cur.fetchone()

    cur.close()
    conn.close()

    return jsonify({
        "message": "Match request approved and post marked as returned",
        "updated_request": updated_request
    })


if __name__ == "__main__":
    from flask_cors import CORS
    CORS(app)
    app.run(debug=True)
