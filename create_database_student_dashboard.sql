create database student_dashboard;
USE student_dashboard;

CREATE TABLE Students (
    id INT Auto_increment primary key,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE Attendances (
    id INT Auto_increment primary key,
    courseName VARCHAR(255),
    semester VARCHAR(255),
    startDate DATE,
    endDate DATE,
    totalClasses INT,
    attended INT,
    studentID INT,
    FOREIGN Key (studentID) References Students(id)
);

INSERT INTO Students (firstName, lastName, email, password)
VALUES ('Kimberly', 'Test', 'ktest@example.com', 'test2025');

INSERT INTO Attendances (courseName, semester, startDate, endDate, totalClasses, attended, studentID)
VALUES ('INFO 530', 'Spring 2025', '2025-01-08', '2025-05-08', 40, 38, 1),
('INFO 544', 'Fall 2024', '2024-08-08', '2024-12-08', 46, 42, 1),
('INFO 600', 'Fall 2024', '2024-08-08', '2024-12-08', 40, 38, 1); 