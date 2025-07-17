# Habitude - AI-Powered Habit Tracking App

A modern, AI-driven habit tracking application built with React, TypeScript, and Tailwind CSS.

## Features

- **AI-Powered Habit Coaching**: Personalized habit suggestions and tracking
- **Mood Tracking**: Integrated mood monitoring with habit correlation
- **Goal Management**: Set and track personal goals
- **Social Features**: Share progress and connect with accountability buddies
- **Admin Panel**: Comprehensive admin dashboard for system management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8080`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd habitude
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Authentication & Routing

### Routes

- `/` - Main dashboard (protected, requires login)
- `/login` - Login/Registration page
- `/logout` - Logout and redirect to login
- `/profile` - User profile page (protected)
- `/admin` - Admin panel
- `/test-adaptive` - AI adaptive engine test (protected)

### Authentication Flow

1. **Login**: Users can log in via email/password or social providers
2. **Registration**: New users are automatically redirected to onboarding
3. **Protected Routes**: All main routes require authentication
4. **Auto-redirect**: Unauthenticated users are redirected to `/login`

### Backend API

The app connects to a backend API at `http://localhost:8080/api/v1`:

- **Login**: `POST /api/v1/auth/login`
- **Registration**: `POST /api/v1/users`
- **Health Check**: `GET /api/v1/health`

### Backend Status

The login page includes a real-time backend status indicator that shows:
- ✅ **Backend Connected**: Server is running and accessible
- ❌ **Backend Disconnected**: Server is not running or unreachable

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── ai/             # AI-related components
│   ├── habits/         # Habit tracking components
│   ├── goals/          # Goal management components
│   ├── mood/           # Mood tracking components
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts
├── services/           # API services
├── pages/              # Page components
└── hooks/              # Custom React hooks
```

### Key Technologies

- **React 18** with TypeScript
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Query** for data fetching
- **Framer Motion** for animations

## Troubleshooting

### Login Issues

1. **Backend Not Running**: Ensure your backend server is running on `http://localhost:8080`
2. **API Endpoint**: Verify the login endpoint is `/api/v1/auth/login`
3. **CORS Issues**: Check that your backend allows requests from `http://localhost:5173`

### Common Issues

- **"Backend Disconnected"**: Start your backend server
- **Login Fails**: Check browser console for detailed error messages
- **Routing Issues**: Clear browser cache and restart the dev server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 