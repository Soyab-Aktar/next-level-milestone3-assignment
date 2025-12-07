# Vehicle Rental System (Backend API)

A simple backend project for managing a vehicle rental system.  
This API allows users to register/login, view vehicles, make bookings, and includes admin-level controls for managing everything.

---

## Live Deployment
https://vehiclerentalsystem-zeta.vercel.app/

---

## Project Overview

This system includes:

- Vehicle management  
- User accounts (admin & customer)  
- Booking creation and updates  
- Authentication using JWT  
- PostgreSQL database integration  

---

## Tech Stack

- Node.js  
- Express.js  
- TypeScript  
- PostgreSQL  
- bcrypt  
- jsonwebtoken  

---


## User Roles

### **Admin**
- Manage vehicles  
- View/delete users  
- Access all bookings  

### **Customer**
- View vehicles  
- Create and manage own bookings  

---

## Authentication Flow

- Signup → user saved with hashed password  
- Login → returns JWT token  
- Protected routes require:  

---

## Database Tables

### **Users**
- id  
- name  
- email  
- password  
- phone  
- role  

### **Vehicles**
- id  
- vehicle_name  
- type (car, bike, SUV, etc.)  
- registration_number  
- daily_rent_price  
- availability_status  

### **Bookings**
- id  
- customer_id  
- vehicle_id  
- rent_start_date  
- rent_end_date  
- total_price  
- status  

---

## API Endpoints

### **Auth**
- POST /api/v1/auth/signup
- POST /api/v1/auth/login

### **Vehicles**
- POST /api/v1/vehicles (admin)
- GET /api/v1/vehicles (public)
- GET /api/v1/vehicles/:id (public)
- PUT /api/v1/vehicles/:id (admin)
- DELETE /api/v1/vehicles/:id (admin)

### **Users**
- GET /api/v1/users (admin)
- PUT /api/v1/users/:id (admin / same user)
- DELETE /api/v1/users/:id (admin)

### **Bookings**
- POST /api/v1/bookings (customer/admin)
- GET /api/v1/bookings (role-based)
- PUT /api/v1/bookings/:id (role-based)

---

## Additional Notes
This project was built following a modular structure:  
`auth/`, `user/`, `vehicle/`, `booking/` contain separate controllers, routes, and services.
