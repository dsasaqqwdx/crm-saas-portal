-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.attendance (
  attendance_id integer NOT NULL DEFAULT nextval('attendance_attendance_id_seq'::regclass),
  employee_id integer NOT NULL,
  attendance_date date NOT NULL,
  status character varying,
  CONSTRAINT attendance_pkey PRIMARY KEY (attendance_id),
  CONSTRAINT attendance_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id)
);
CREATE TABLE public.companies (
  company_id integer NOT NULL DEFAULT nextval('companies_company_id_seq'::regclass),
  company_name character varying NOT NULL,
  pricing_plan character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT companies_pkey PRIMARY KEY (company_id)
);
CREATE TABLE public.departments (
  department_id integer NOT NULL DEFAULT nextval('departments_department_id_seq'::regclass),
  department_name character varying NOT NULL,
  company_id integer NOT NULL,
  CONSTRAINT departments_pkey PRIMARY KEY (department_id),
  CONSTRAINT departments_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id)
);
CREATE TABLE public.designations (
  designation_id integer NOT NULL DEFAULT nextval('designations_designation_id_seq'::regclass),
  designation_name character varying NOT NULL,
  company_id integer NOT NULL,
  CONSTRAINT designations_pkey PRIMARY KEY (designation_id),
  CONSTRAINT designations_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id)
);
CREATE TABLE public.email_queries (
  query_id integer NOT NULL DEFAULT nextval('email_queries_query_id_seq'::regclass),
  name character varying,
  email character varying,
  message text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT email_queries_pkey PRIMARY KEY (query_id)
);
CREATE TABLE public.employee_shifts (
  id integer NOT NULL DEFAULT nextval('employee_shifts_id_seq'::regclass),
  employee_id integer,
  shift_id integer,
  assigned_date date,
  CONSTRAINT employee_shifts_pkey PRIMARY KEY (id),
  CONSTRAINT employee_shifts_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id),
  CONSTRAINT employee_shifts_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.shifts(shift_id)
);
CREATE TABLE public.employees (
  employee_id integer NOT NULL DEFAULT nextval('employees_employee_id_seq'::regclass),
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  phone character varying,
  department_id integer,
  designation_id integer,
  company_id integer,
  joining_date date,
  CONSTRAINT employees_pkey PRIMARY KEY (employee_id),
  CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id),
  CONSTRAINT employees_designation_id_fkey FOREIGN KEY (designation_id) REFERENCES public.designations(designation_id),
  CONSTRAINT employees_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id)
);
CREATE TABLE public.holidays (
  holiday_id integer NOT NULL DEFAULT nextval('holidays_holiday_id_seq'::regclass),
  company_id integer NOT NULL,
  holiday_date date NOT NULL,
  description character varying,
  CONSTRAINT holidays_pkey PRIMARY KEY (holiday_id),
  CONSTRAINT holidays_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id)
);
CREATE TABLE public.leave_applications (
  leave_id integer NOT NULL DEFAULT nextval('leave_applications_leave_id_seq'::regclass),
  employee_id integer NOT NULL,
  leave_type character varying,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  status character varying,
  CONSTRAINT leave_applications_pkey PRIMARY KEY (leave_id),
  CONSTRAINT leave_applications_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id)
);
CREATE TABLE public.leave_balances (
  balance_id integer NOT NULL DEFAULT nextval('leave_balances_balance_id_seq'::regclass),
  employee_id integer,
  leave_type character varying,
  total_leaves integer,
  used_leaves integer,
  remaining_leaves integer,
  CONSTRAINT leave_balances_pkey PRIMARY KEY (balance_id),
  CONSTRAINT leave_balances_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id)
);
CREATE TABLE public.letterheads (
  letterhead_id integer NOT NULL DEFAULT nextval('letterheads_letterhead_id_seq'::regclass),
  company_id integer NOT NULL,
  title character varying,
  content text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT letterheads_pkey PRIMARY KEY (letterhead_id),
  CONSTRAINT letterheads_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id)
);
CREATE TABLE public.payroll (
  payroll_id integer NOT NULL DEFAULT nextval('payroll_payroll_id_seq'::regclass),
  employee_id integer,
  salary numeric,
  bonus numeric,
  deductions numeric,
  net_salary numeric,
  pay_date date,
  CONSTRAINT payroll_pkey PRIMARY KEY (payroll_id),
  CONSTRAINT payroll_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id)
);
CREATE TABLE public.payroll_policies (
  policy_id integer NOT NULL DEFAULT nextval('payroll_policies_policy_id_seq'::regclass),
  company_id integer NOT NULL,
  policy_name character varying,
  salary_structure text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT payroll_policies_pkey PRIMARY KEY (policy_id),
  CONSTRAINT payroll_policies_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id)
);
CREATE TABLE public.shifts (
  shift_id integer NOT NULL DEFAULT nextval('shifts_shift_id_seq'::regclass),
  shift_name character varying,
  start_time time without time zone,
  end_time time without time zone,
  company_id integer,
  CONSTRAINT shifts_pkey PRIMARY KEY (shift_id),
  CONSTRAINT shifts_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id)
);
CREATE TABLE public.super_admin_assignments (
  id integer NOT NULL DEFAULT nextval('super_admin_assignments_id_seq'::regclass),
  super_admin_id integer NOT NULL,
  company_id integer NOT NULL,
  assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT super_admin_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT super_admin_assignments_super_admin_id_fkey FOREIGN KEY (super_admin_id) REFERENCES public.users(user_id),
  CONSTRAINT super_admin_assignments_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id)
);
CREATE TABLE public.transactions (
  transaction_id integer NOT NULL DEFAULT nextval('transactions_transaction_id_seq'::regclass),
  company_id integer NOT NULL,
  amount numeric,
  payment_date date,
  status character varying,
  CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id),
  CONSTRAINT transactions_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id)
);
CREATE TABLE public.users (
  user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  role character varying NOT NULL,
  company_id integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
  CONSTRAINT users_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id)
);