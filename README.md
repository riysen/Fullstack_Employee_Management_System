Title: Employee Management System	
A full-stack web application for managing employee records with advanced features like search, filtering, caching, and offline support. Built with Django REST Framework and React.

Features:
Full CRUD Operations - Create, Read, Update, Delete employees 
JWT Authentication- Secure token-based authentication 
Soft Delete (Archive) - Archive employees instead of permanent deletion 
Advanced Search - Debounced search (500ms) across multiple fields 
Multi-Filter System- Filter by department, status, date range 
Column Sorting - Sort by name, date, department, performance  
Pagination - Customizable page size (5, 10, 20, 50 items) 
Responsive Design- Mobile, tablet, and desktop optimized
Hybrid Cache System - localStorage + PostgreSQL for optimal performance
Offline Support - View cached data when backend is unavailable
Performance Tracking - Progress bars for employee performance scores
Statistics Dashboard - Real-time employee metrics
Dual View Modes - Table view and Card view with toggle
User Preferences- Persistent sort order and page size preferences
Form Validation - Frontend and backend validation
Error Handling- Comprehensive error messages and loading states

UI/UX Features
Modern Design- Ant Design component library
Loading Indicators- Spinners for API calls and button actions
Toast Notifications- Success, error, and info messages
Empty States- Friendly messages when no data available
Cache Indicators- Visual badges for cache status and offline mode
Drawer Forms- Slide-in forms for add/edit operations
Save & Continue Editing - Quick workflow for multiple edits

Tech Stack:
Frontend
•	React 18.2.0                  
•	Ant Design 5.12.8            
•	Axios 1.6.5                  
•	React Router DOM 6.21.1      
•	Day.js                       
•	localStorage API   
Backend
•	Django 5.0.1 (Web Framework)
•	Django REST Framework 3.14.0 ( API Framework)
•	JWT (Simple JWT) 5.3.1 (Authentication)
•	django-filter 23.5  (Query filtering)
•	django-cors-headers 4.3.1 ( CORS handling)
•	psycopg2-binary 2.9.9
database:
•	PostgreSQL 15+  ( Database)
•	Indexes on department, status, is_archived
•	Timestamps (created_at, updated_at)
•	Soft delete support
Development Tools
•	Postman (API Testing)
•	Chrome DevTools (Debugging)
•	Git  (Version Control)
•	VS Code  ( Code Editor)

Installation:
•	Python3.8 or higher
•	Node.js 16 or higher
•	PostgreSQL
•	Git
Database Setup (PostgreSQL)

•	CREATE DATABASE employee_db;
•	CREATE USER employee_user WITH PASSWORD 'StrongPassword123!';
•	ALTER ROLE employee_user SET client_encoding TO 'utf8';
•	ALTER ROLE employee_user SET default_transaction_isolation TO 'read committed';
•	ALTER ROLE employee_user SET timezone TO 'UTC';
•	GRANT ALL PRIVILEGES ON DATABASE employee_db TO employee_user;
•	\c employee_db
•	GRANT ALL ON SCHEMA public TO employee_user;
•	GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO employee_user;
•	GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO employee_user;
•	\q
Backend Setup (Django)
•	mkdir employee-management-system
•	mkdir backend
•	cd backend
•	python -m venv venv
•	venv\Scripts\activate
•	pip install -r requirements.txt
•	django-admin startproject employee_system .
•	python manage.py startapp employees
Run migrations:
•	 python manage.py makemigrations 
•	python manage.py migrate
•	python manage.py createsuperuser
•	python manage.py runserver
•	Server will run on http://127.0.0.1:8000/

 Frontend Setup (React)
•	cd employee-management
•	npx create-react-app frontend
•	cd frontend
•	npm install antd
•	npm install axios
•	npm install react-router-dom
•	npm install @ant-design/icons
•	npm start
•	  will run on http://localhost:3000/

