CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Assessor') NOT NULL
);

CREATE TABLE Students (
    student_id VARCHAR(20) PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    programme VARCHAR(100) NOT NULL
);

CREATE TABLE Internships (
    internship_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL, 
    assessor_id INT NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (assessor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    internship_id INT UNIQUE NOT NULL, 
    task_mark DECIMAL(5,2),
    safety_mark DECIMAL(5,2),
    knowledge_mark DECIMAL(5,2),
    report_mark DECIMAL(5,2),
    clarity_mark DECIMAL(5,2),
    learning_mark DECIMAL(5,2),
    project_mgt_mark DECIMAL(5,2),
    time_mgt_mark DECIMAL(5,2),
    qualitative_comments TEXT,
    final_calculated_score DECIMAL(5,2),
    FOREIGN KEY (internship_id) REFERENCES Internships(internship_id) ON DELETE CASCADE
);

-- password "admin123"
INSERT INTO Users (username, password_hash, role) 
VALUES ('admin', '$2a$12$UP2FDaHvqrSQHW76zsZHWeqzc09VuR.euQbFSi41Wt..pMmRsSgyS', 'Admin');