CREATE DATABASE LostAndFoundDB;
USE LostAndFoundDB;


-- 1. STUDENT TABLE
CREATE TABLE Student (
    student_id VARCHAR(15) PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    middle_name VARCHAR(30),
    last_name VARCHAR(30),
    section CHAR(1),
    course VARCHAR(30),
    DOB DATE,
    student_password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    alternate_phone VARCHAR(10),
    UNIQUE (phone_number)
);

-- 2. ITEM TABLE
CREATE TABLE Item (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(30),
    description VARCHAR(200)
);

-- 3. LOCATION TABLE
CREATE TABLE Location (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    building_name VARCHAR(50),
    area_name VARCHAR(50),
    loc_description VARCHAR(200)
);

-- 4. STATUS TABLE
CREATE TABLE Status (
    status_id INT PRIMARY KEY AUTO_INCREMENT,
    status_name ENUM('lost','found','returned') NOT NULL
);



-- 5. POST TABLE
CREATE TABLE Post (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(15) NOT NULL,
    item_id INT NOT NULL,
    location_id INT NULL,
    status_id INT NOT NULL,
    date_posted DATE DEFAULT (CURDATE()),
    p_description VARCHAR(200),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_updated DATE DEFAULT (CURDATE()),
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Item(item_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (location_id) REFERENCES Location(location_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (status_id) REFERENCES Status(status_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. MATCH_REQUEST (Weak entity)
CREATE TABLE Match_Request (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    student_id VARCHAR(15) NOT NULL,
    request_date DATE DEFAULT (CURDATE()),
    message VARCHAR(200),
    FOREIGN KEY (post_id) REFERENCES Post(post_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);


-- Insert Students
INSERT INTO Student (student_id, first_name, middle_name, last_name, section, course, DOB, student_password, phone_number, alternate_phone)
VALUES
('PES1UG23AM164', 'Mahima', 'R', 'Shetty', 'A', 'AIML', '2005-07-14', 'mahima123', '9876543210', NULL),
('PES1UG23AM126', 'Jyotsana', NULL, 'S', 'A', 'AIML', '2005-09-21', 'hello123','9123456780', '7655678976'),
('PES1UG23CS056', 'Priya', NULL, 'Patel', 'B', 'CSE', '2004-05-10','priya123', '9988776655', NULL);

-- Insert Items
INSERT INTO Item (name, category, description)
VALUES
('Wallet', 'Accessory', 'Black leather wallet with cards'),
('Water Bottle', 'Utility', 'Blue Milton bottle with PES logo'),
('ID Card', 'Document', 'College ID with blue lanyard'),
('Earphones', 'Electronics', 'White wired earphones found near GJB');

-- Insert Locations
INSERT INTO Location (building_name, area_name, loc_description)
VALUES
('GJB', 'Canteen', 'Near Canteena'),
('BE', '2A', 'Beside Seminar HAll'),
('F BLOCK', 'Ground Floor', 'Lift area'),
('PANINI BLOCK', 'Student Lounge', 'Near seating area');

-- Insert Status Types
INSERT INTO Status (status_name)
VALUES ('lost'), ('found'), ('returned');
DESCRIBE Match_Request;


-- Insert Posts
INSERT INTO Post (student_id, item_id, location_id, status_id, p_description)
VALUES
('PES1UG23AM164', 1, 1, 1, 'Lost wallet after the TechFest event in Canteen'),
('PES1UG23AM126', 2, 2, 2, 'Found a blue Milton water bottle near the Seminar Hall Entrance'),
('PES1UG23CS056', 3, NULL, 1, 'Lost college ID card near lift'),
('PES1UG23AM164', 4, 4, 2, 'Found earphones somewhere on the way to F Block');

-- Insert Match Requests
INSERT INTO Match_Request (post_id, student_id, message)
VALUES
(1, 'PES1UG23AM126', 'I think I saw this wallet in canteen last week.'),
(2, 'PES1UG23AM164', 'This bottle looks like mine — could I check it?'),
(3, 'PES1UG23AM126', 'Found a similar ID card near GJB — might be yours.'),
(4, 'PES1UG23CS056', 'I think these earphones belong to my friend.');



-- Auto-update Post Status when Match Request is Approved
DELIMITER //
CREATE TRIGGER trg_update_status_on_approval
AFTER UPDATE ON Match_Request
FOR EACH ROW
BEGIN
    IF NEW.message LIKE '%approved%' THEN
        UPDATE Post
        SET 
            status_id = (SELECT status_id FROM Status WHERE status_name = 'returned'),
            status_updated = CURDATE()
        WHERE post_id = NEW.post_id;
    END IF;
END;
//
DELIMITER ;


-- Prevent Duplicate Match Requests for Same Post by Same Student
DELIMITER //
CREATE TRIGGER trg_prevent_duplicate_requests
BEFORE INSERT ON Match_Request
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM Match_Request 
        WHERE post_id = NEW.post_id AND student_id = NEW.student_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Duplicate match request not allowed for same post by same student';
    END IF;
END;
//
DELIMITER ;

INSERT INTO Match_Request (post_id, student_id, message)
VALUES (1, 'PES1UG23AM126', 'TRYING AGAIN ?');


-- Function 1 – Get Student Full Name
DELIMITER //
CREATE FUNCTION GetStudentFullName(sid VARCHAR(15))
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
    DECLARE fullName VARCHAR(100);
    SELECT CONCAT_WS(' ', first_name, middle_name, last_name) 
      INTO fullName FROM Student WHERE student_id = sid;
    RETURN fullName;
END;
//
DELIMITER ;

-- Function 2 – Total Posts by a Student
DELIMITER //
CREATE FUNCTION TotalPostsByStudent(sid VARCHAR(15))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total FROM Post WHERE student_id = sid;
    RETURN total;
END;
//
DELIMITER ;


-- Function 3 – Total Lost Items
DELIMITER //
CREATE FUNCTION TotalLostItems()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE totalLost INT;
    SELECT COUNT(*) INTO totalLost
    FROM Post 
    WHERE status_id = (SELECT status_id FROM Status WHERE status_name = 'lost');
    RETURN totalLost;
END;
//
DELIMITER ;


-- Procedure 1 – View Posts by Status (Lost/Found)
DELIMITER //
CREATE PROCEDURE ViewPostsByStatus(IN p_status_name ENUM('lost','found','returned'))
BEGIN
    SELECT 
        s.student_id,
        CONCAT_WS(' ', s.first_name, s.middle_name, s.last_name) AS StudentName,
        i.name AS ItemName,
        st.status_name,
        p.p_description,
        l.building_name,
        l.area_name
    FROM Post p
    JOIN Student s ON p.student_id = s.student_id
    JOIN Item i ON p.item_id = i.item_id
    JOIN Status st ON p.status_id = st.status_id
    LEFT JOIN Location l ON p.location_id = l.location_id
    WHERE st.status_name = p_status_name;
END;
//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetPostsByStudent(IN sid VARCHAR(15))
BEGIN
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
    WHERE p.student_id = sid
    ORDER BY p.date_posted DESC;
END;
//
DELIMITER ;


ALTER TABLE Match_Request ADD COLUMN request_status ENUM('pending', 'approved') DEFAULT 'pending';