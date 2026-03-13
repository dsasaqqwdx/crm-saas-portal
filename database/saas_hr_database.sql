
-- Database name
CREATE DATABASE saas_hr_system;

\c saas_hr_system;

-- Companies Table
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    pricing_plan VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
-- Roles: software_owner, super_admin, company_admin, employee
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL,
    company_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Departments Table
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    company_id INT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Designations Table
CREATE TABLE designations (
    designation_id SERIAL PRIMARY KEY,
    designation_name VARCHAR(100) NOT NULL,
    company_id INT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

--  Employees Table
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id INT,
    designation_id INT,
    company_id INT,
    joining_date DATE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (designation_id) REFERENCES designations(designation_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Attendance Table
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(50),  -- Present, Absent, Leave
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Leave Applications Table
CREATE TABLE leave_applications (
    leave_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type VARCHAR(50),  -- Casual, Sick, Disciplinary
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(50),  -- Pending, Approved, Rejected
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Holidays Table
CREATE TABLE holidays (
    holiday_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    holiday_date DATE NOT NULL,
    description VARCHAR(200),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Payroll Policies Table
CREATE TABLE payroll_policies (
    policy_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    policy_name VARCHAR(150),
    salary_structure TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

--  Transactions Table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    amount DECIMAL(10,2),
    payment_date DATE,
    status VARCHAR(50),  -- Completed, Pending, Failed
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

--  Email Queries Table
CREATE TABLE email_queries (
    query_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  Letterheads Table
CREATE TABLE letterheads (
    letterhead_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(150),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

--  Super Admin Assignment Table
-- Which super admins are linked to which companies
CREATE TABLE super_admin_assignments (
    id SERIAL PRIMARY KEY,
    super_admin_id INT NOT NULL,
    company_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (super_admin_id) REFERENCES users(user_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

--  Sample Data
-- Companies
INSERT INTO companies (company_name, pricing_plan) VALUES ('ABC Tech','Premium');
INSERT INTO companies (company_name, pricing_plan) VALUES ('XYZ Solutions','Basic');

-- Users
INSERT INTO users (name,email,password,role,company_id) VALUES
('Owner','owner@saas.com','123456','software_owner',NULL),
('SuperAdmin1','super1@saas.com','123456','super_admin',NULL);
INSERT INTO users (name,email,password,role,company_id) VALUES
('Admin1','admin1@abc.com','123456','company_admin',1),
('Admin2','admin2@xyz.com','123456','company_admin',2),
('Admin3','admin3@pqr.com','123456','company_admin',2);
-- Departments
INSERT INTO departments (department_name, company_id) VALUES ('HR', 1),('Engineering',1),('HR',2),('Sales',2);

-- Designations
INSERT INTO designations (designation_name, company_id) VALUES ('Manager',1),('Engineer',1),('Manager',2),('Sales Executive',2);

-- Employees
INSERT INTO employees (name,email,phone,department_id,designation_id,company_id,joining_date) 
VALUES 
('Greeshmitha','greeshmitha@abc.com','9999999999',1,1,1,'2026-03-13'),
('pallavi','pallavi@abc.com','8888888888',2,2,1,'2026-03-14'),
('thanu','thanu@xyz.com','7777777777',3,3,2,'2026-03-15'),
('Abi','abi@xyz.com','6666666666',4,4,2,'2026-03-16'),
('aswin','aswin@pqr.com','9999999999',4,4,2,'2026-03-20');