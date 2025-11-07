# dbms-mini-project-lost-and-found-system
Lost and Found Management System
A full-stack DBMS project to help students report lost items, post found items, and request matches to verify ownership.

Built using:
React.js for the frontend
Flask for the backend API
MySQL for the database

Project Features

Student Login and Signup

Students can register and log in using their student ID and password.

Create Lost/Found Posts

Students can create posts for items they lost or found.

Posts store item details, location, description, status.

Match Request System

Students can send match requests for posts.

Duplicate match requests for the same post by the same student are prevented using a trigger.

When a match request is approved, a trigger updates the post status to "returned".

Dashboard

Shows total lost items, total posts by the logged-in student, counts of statuses, and recent activity.

Database Overview (MySQL)

Tables:
Student
Item
Location
Status
Post
Match_Request

DDL (Data Definition Language) used:

CREATE DATABASE

CREATE TABLE for all six tables

PRIMARY KEY, FOREIGN KEY, UNIQUE constraints

ENUM datatype

Triggers

Functions

Stored Procedures

CRUD Operations:
Create: Insert students, items, posts, match requests
Read: View posts with joins, view dashboard values
Update: Update post status, update match request message
Delete: Delete posts (with cascading deletes)

Queries Used:

Join Query
Inside the stored procedure ViewPostsByStatus, which joins Student, Item, Post, Status, and Location tables.

Nested Query
Used in the function TotalLostItems():
status_id = (SELECT status_id FROM Status WHERE status_name = 'lost')

Aggregate Queries
COUNT(*) for:

Total posts

Total lost items

Total posts by a specific student

Functions Created
GetStudentFullName
TotalPostsByStudent
TotalLostItems

Stored Procedures
ViewPostsByStatus
ApproveMatchRequest (if included)

Triggers

Trigger to auto-update post status to "returned" when a match request message contains approval text.

Trigger to prevent duplicate match requests for the same post by the same student.

How to Run

Backend (Flask)
cd backend
python app.py
Runs at http://127.0.0.1:5000

Frontend (React)
cd lostfound-frontend
npm start
Runs at http://localhost:3000

Modules Implemented
Login
Signup
Dashboard
View Posts
Create Posts
Match Requests
Navbar

Purpose
This project demonstrates full-stack development with a relational database, including triggers, stored procedures, functions, join queries, nested queries, and aggregate queries.
