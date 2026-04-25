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

-- All seeded accounts use the password "admin123"
INSERT INTO Users (username, password_hash, role) VALUES
    ('admin',   '$2a$12$UP2FDaHvqrSQHW76zsZHWeqzc09VuR.euQbFSi41Wt..pMmRsSgyS', 'Admin'),
    ('jchen',   '$2a$12$UP2FDaHvqrSQHW76zsZHWeqzc09VuR.euQbFSi41Wt..pMmRsSgyS', 'Assessor'),
    ('slin',    '$2a$12$UP2FDaHvqrSQHW76zsZHWeqzc09VuR.euQbFSi41Wt..pMmRsSgyS', 'Assessor'),
    ('madams',  '$2a$12$UP2FDaHvqrSQHW76zsZHWeqzc09VuR.euQbFSi41Wt..pMmRsSgyS', 'Assessor'),
    ('rpatel',  '$2a$12$UP2FDaHvqrSQHW76zsZHWeqzc09VuR.euQbFSi41Wt..pMmRsSgyS', 'Assessor');

INSERT INTO Students (student_id, student_name, programme) VALUES
    ('20210456', 'Aisha Rahman',    'Computer Science'),
    ('20221287', 'Marcus Johnson',  'Software Engineering'),
    ('20203098', 'Priya Nair',      'Data Science'),
    ('20224410', 'Tomas Horak',     'Information Technology'),
    ('20212201', 'Lina Osei',       'Cybersecurity'),
    ('20231005', 'Chen Wei',        'Computer Science'),
    ('20208842', 'Sofia Martinez',  'Software Engineering'),
    ('20225531', 'Daniel Kim',      'Data Science'),
    ('20217764', 'Emma Williams',   'Cybersecurity'),
    ('20234120', 'Yusuf Ahmed',     'Information Technology');

-- assessor_id values map to the Users insert order: jchen=2, slin=3, madams=4, rpatel=5
INSERT INTO Internships (student_id, assessor_id, company_name) VALUES
    ('20210456', 2, 'Acme Corp'),
    ('20221287', 2, 'Globex Ltd'),
    ('20203098', 3, 'Initech Analytics'),
    ('20224410', 3, 'Umbrella Systems'),
    ('20212201', 4, 'Stark Security'),
    ('20231005', 4, 'Wayne Robotics'),
    ('20208842', 5, 'Hooli'),
    ('20225531', 5, 'Pied Piper'),
    ('20217764', 2, 'Cyberdyne'),
    ('20234120', 3, 'Massive Dynamic');

-- Final score = average of the 8 marks. Seed a mix of completed and in-progress assessments.
INSERT INTO Assessments
    (internship_id, task_mark, safety_mark, knowledge_mark, report_mark,
     clarity_mark, learning_mark, project_mgt_mark, time_mgt_mark,
     qualitative_comments, final_calculated_score)
VALUES
    (1, 85, 90, 80, 78, 82, 88, 84, 86, 'Strong technical contribution and good team integration.', 84.13),
    (2, 72, 75, 70, 68, 74, 76, 71, 73, 'Solid work, room to grow on documentation.',                72.38),
    (3, 91, 88, 93, 90, 89, 92, 87, 90, 'Outstanding analytical work on the data pipeline.',         90.00),
    (5, 78, 82, 76, 74, 80, 79, 77, 81, 'Reliable contributor on the security audit team.',          78.38),
    (7, 88, 85, 87, 86, 90, 88, 84, 89, 'Excellent UX research and stakeholder communication.',      87.13);