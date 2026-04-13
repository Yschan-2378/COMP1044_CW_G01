-- Create Users Table (Handles both Admin and Assessors)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Assessor') NOT NULL
);

-- Create Students Table
CREATE TABLE Students (
    student_id VARCHAR(20) PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    programme VARCHAR(100) NOT NULL
);

-- Create Internship Details Table (Links Students to Assessors and Companies)
CREATE TABLE Internships (
    internship_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    assessor_id INT NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (assessor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Create Assessments Table (Enforces the 8 specific criteria)
CREATE TABLE Assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    internship_id INT NOT NULL,
    task_mark DECIMAL(5,2) CHECK (task_mark <= 100),       -- Weight: 10%
    safety_mark DECIMAL(5,2) CHECK (safety_mark <= 100),     -- Weight: 10%
    knowledge_mark DECIMAL(5,2) CHECK (knowledge_mark <= 100),  -- Weight: 10%
    report_mark DECIMAL(5,2) CHECK (report_mark <= 100),     -- Weight: 15%
    clarity_mark DECIMAL(5,2) CHECK (clarity_mark <= 100),    -- Weight: 10%
    learning_mark DECIMAL(5,2) CHECK (learning_mark <= 100),   -- Weight: 15%
    project_mgt_mark DECIMAL(5,2) CHECK (project_mgt_mark <= 100),-- Weight: 15%
    time_mgt_mark DECIMAL(5,2) CHECK (time_mgt_mark <= 100),   -- Weight: 15%
    qualitative_comments TEXT,
    final_calculated_score DECIMAL(5,2),
    FOREIGN KEY (internship_id) REFERENCES Internships(internship_id) ON DELETE CASCADE
);

-- Insert Sample Admin Data (Password: 'admin123' hashed for security)
INSERT INTO Users (username, password_hash, role) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin');