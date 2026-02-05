# GenHire AI - AI Interview Practice Platform

A comprehensive React-based interview practice platform with AI-powered mock interviews, performance analysis, and personalized coaching.

## 🚀 Features

### Authentication System
- User login and registration
- Password recovery
- Email verification
- Profile setup

### Dashboard & Analytics
- Admin dashboard for management
- User dashboard with performance overview
- Weakness analysis and improvement recommendations
- Interview history and statistics

### Interview System
- Live AI interview setup and configuration
- Voice-based interview sessions
- Real-time feedback and scoring
- Multiple interview types (Behavioral, Technical, Situational)

### Content Management
- Question bank with categorized questions
- Personalized coaching recommendations
- Performance tracking and analytics

### Account Management
- User profile management
- Subscription plans and billing
- App settings and preferences
- Pricing and plan selection

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.1.0 (React 19)
- **Backend & Database**: Supabase (PostgreSQL, Auth)
- **Icons**: Lucide React 0.539.0
- **Build Tool**: Next.js
- **Styling**: Tailwind CSS

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🌐 Deployment

### Netlify Deployment

This project is configured for easy Netlify deployment:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your repository to Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`
   - The `netlify.toml` and `_redirects` files are already configured

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure your server to serve `index.html` for all routes (SPA routing)

## 📱 Available Routes

### Authentication
- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password recovery
- `/email-verification` - Email verification
- `/setup-profile` - Profile setup

### Dashboards
- `/dashboard` - Admin dashboard
- `/user-dashboard` - User dashboard

### Interview System
- `/live-ai-interview` - Interview setup
- `/voice-interview` - Voice interview session
- `/interview-results` - Interview results

### Analysis & Content
- `/weakness-overview` - Performance analysis
- `/question-bank` - Question repository

### Account Management
- `/profile` - User profile
- `/my-plan` - Subscription management
- `/pricing` - Pricing plans
- `/settings` - App settings

### Utility
- `/categories` - Site navigation overview

## 🎨 Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface
- **Consistent Branding**: GenHire AI design language throughout
- **Interactive Elements**: Smooth animations and hover effects
- **Accessibility**: Proper contrast ratios and semantic HTML

## 🔧 Configuration

### Environment Variables
No environment variables required for this prototype version.

### Build Configuration
- Output directory: `dist`
- Asset optimization: Enabled
- Code splitting: Configured for optimal loading
- Source maps: Disabled for production

## 📊 Performance

- **Optimized Bundle**: Code splitting for faster loading
- **Asset Optimization**: Images and assets optimized
- **Modern Build**: ES6+ with Vite for fast builds
- **Lazy Loading**: Components loaded on demand

## 🤝 Contributing

This is a prototype application. For production use, consider:
- Adding proper authentication backend
- Implementing real AI interview functionality
- Adding database integration
- Setting up proper error handling
- Adding comprehensive testing

## 📄 License

This project is a prototype for demonstration purposes.

## 🚀 Quick Start for Development

1. Navigate to `/categories` to see all available routes
2. Start with `/login` for the authentication flow
3. Use `/user-dashboard` as the main user interface
4. Explore `/live-ai-interview` for the interview system

---

**GenHire AI** - Empowering your interview success with AI-powered practice and feedback.
