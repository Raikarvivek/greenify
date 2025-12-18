# Greenify - Sustainable Living Platform

A modern web application built with Next.js that helps users track their environmental impact and promotes sustainable living practices.

## Features

- **User Authentication**: Secure registration and login system
- **Admin Portal**: Dedicated admin interface for platform management
- **User Dashboard**: Track recycling, water usage, and environmental impact
- **Admin Dashboard**: Monitor user activity and platform statistics
- **Responsive Design**: Beautiful, mobile-friendly interface
- **Role-based Access**: Separate user and admin roles with appropriate permissions

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd greenify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your MongoDB connection string and JWT secret:
   ```
   MONGODB_URI=mongodb://localhost:27017/greenify
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Creating an Admin User

To create an admin user, you'll need to manually set the role in your MongoDB database:

1. Register a new user through the normal registration process
2. In your MongoDB database, find the user and update their role:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## Project Structure

```
greenify/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   └── page.tsx          # Admin login
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       ├── register/
│   │       └── me/
│   ├── components/
│   ├── dashboard/
│   │   └── page.tsx          # User dashboard
│   ├── lib/
│   │   ├── models/
│   │   ├── auth.ts
│   │   ├── mongodb.ts
│   │   └── AuthProvider.tsx
│   ├── login/
│   │   └── page.tsx          # User login
│   ├── register/
│   │   └── page.tsx          # User registration
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Homepage
├── package.json
├── tailwind.config.js
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### User Features
- **Registration/Login**: Secure user authentication
- **Dashboard**: Track environmental activities and impact
- **Activity Logging**: Record recycling, water saving, tree planting
- **Impact Visualization**: See carbon footprint reduction

### Admin Features
- **Admin Portal**: Secure admin-only access
- **User Management**: Monitor user activity and registrations
- **Platform Analytics**: View system statistics and performance
- **Environmental Impact**: Track platform-wide environmental benefits

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NEXTAUTH_URL` | Base URL for the application | No |
| `NEXTAUTH_SECRET` | NextAuth secret key | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@greenify.com or create an issue in this repository.
