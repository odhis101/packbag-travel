# PackBag - Travel Booking Platform

A full-stack travel booking platform with user and admin interfaces, built with Next.js, Express, MongoDB, and TypeScript.

## Features

### User Features
- Browse travel packages
- View detailed package information
- User authentication (signup/login)
- Book travel packages
- View booking history

### Admin Features
- Admin authentication
- Create, edit, and delete travel packages
- Manage all bookings
- Update booking status (pending, confirmed, cancelled)
- View analytics and statistics

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript**
- **Tailwind CSS**
- **React Hooks** for state management

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing

## Project Structure

```
SFE4020/
├── frontend/              # Next.js frontend application
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── login/                # User login
│   │   ├── signup/               # User registration
│   │   ├── packages/             # Package browsing
│   │   │   └── [id]/             # Package details
│   │   └── admin/                # Admin portal
│   │       ├── login/            # Admin login
│   │       ├── packages/         # Package management
│   │       └── bookings/         # Booking management
│   └── ...
└── backend/               # Express backend API
    ├── src/
    │   ├── config/               # Database configuration
    │   ├── models/               # Mongoose schemas
    │   │   ├── User.ts
    │   │   ├── Package.ts
    │   │   └── Booking.ts
    │   ├── controllers/          # Route controllers
    │   │   ├── authController.ts
    │   │   ├── packageController.ts
    │   │   └── bookingController.ts
    │   ├── middleware/           # Auth middleware
    │   ├── routes/               # API routes
    │   └── server.ts             # Main server file
    └── ...
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally or MongoDB Atlas account
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd /Users/Joshua/SFE4020
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install

   # Copy and configure environment variables
   cp .env.example .env
   # Edit .env and update MongoDB URI if needed

   # Start the backend server
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

3. **Set up the Frontend**
   ```bash
   cd frontend
   npm install

   # Start the frontend development server
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

### MongoDB Setup

1. **Local MongoDB**
   - Install MongoDB Community Edition
   - Start MongoDB service:
     ```bash
     # macOS (with Homebrew)
     brew services start mongodb-community

     # Linux
     sudo systemctl start mongod
     ```

2. **MongoDB Atlas (Cloud)**
   - Create a free account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster
   - Get your connection string
   - Update `MONGODB_URI` in `backend/.env`

### Default Admin Account

To create an admin account, you can either:

1. **Using API**
   ```bash
   curl -X POST http://localhost:5000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@packbag.com",
       "password": "admin123",
       "role": "admin"
     }'
   ```

2. **Using MongoDB Shell**
   ```bash
   mongosh
   use packbag
   db.users.insertOne({
     email: "admin@packbag.com",
     password: "$2a$10$...",  // Hash "admin123" using bcrypt
     role: "admin",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages` - Create package (admin only)
- `PUT /api/packages/:id` - Update package (admin only)
- `DELETE /api/packages/:id` - Delete package (admin only)

### Bookings
- `POST /api/bookings` - Create booking (authenticated)
- `GET /api/bookings/my-bookings` - Get user bookings (authenticated)
- `GET /api/bookings` - Get all bookings (admin only)
- `PUT /api/bookings/:id/status` - Update booking status (admin only)
- `PUT /api/bookings/:id/cancel` - Cancel booking (authenticated)

## Usage

### For Users
1. Visit `http://localhost:3000`
2. Sign up for an account
3. Browse available travel packages
4. Click on a package to view details
5. Book a package by selecting number of guests
6. View your bookings in your profile

### For Admins
1. Visit `http://localhost:3000/admin/login`
2. Login with admin credentials
3. Manage packages (create, edit, delete)
4. View and manage all bookings
5. Update booking status

## Development

### Frontend Development
```bash
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
```

### Backend Development
```bash
cd backend
npm run dev     # Start with nodemon (auto-restart)
npm run build   # Compile TypeScript
npm run start   # Start production server
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/packbag
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## Future Enhancements
- Payment gateway integration
- Email notifications
- Image upload for packages
- User reviews and ratings
- Search and filter functionality
- Booking date selection
- Multi-language support
- Mobile responsive improvements

## License
This project is for educational purposes as part of SFE4020 coursework.
