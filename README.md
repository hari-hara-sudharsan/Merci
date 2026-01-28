# Business Intelligence Platform

A comprehensive business health checker application that helps business owners analyze their performance, visualize competitors in 3D, receive AI-powered insights, and get dynamic trend notifications.

## 🚀 Features

- **🔐 Authentication**: Secure login and signup with NextAuth.js
- **📋 Business Onboarding**: Comprehensive multi-step forms or document upload with AI parsing
- **🌍 3D Competitor Globe**: Visualize nearby competitors on an interactive 3D globe
- **🤖 AI-Powered Reports**: Get detailed business insights covering 8 key challenges
- **📈 Market Trends**: Real-time trend notifications for your industry
- **📊 Dashboard**: Beautiful analytics and actionable insights

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4
- **3D Visualization**: Globe.GL, Three.js
- **Maps**: Geoapify API
- **UI**: Framer Motion, Lucide Icons

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Merci
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your actual API keys.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

See `.env.example` for all required environment variables:

- `MONGODB_URI`: MongoDB Atlas connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `OPENAI_API_KEY`: OpenAI API key for AI reports
- `GEOAPIFY_API_KEY`: Geoapify API key for maps

## 📁 Project Structure

```
Merci/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── onboarding/        # Business onboarding
│   └── dashboard/         # Main dashboard
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── onboarding/       # Onboarding components
│   └── globe/            # 3D globe components
├── lib/                   # Utility functions
├── models/                # MongoDB models
└── public/                # Static assets
```

## 🎯 User Flow

1. **Sign Up / Login** → User authentication
2. **Business Onboarding** → Complete detailed forms OR upload business document
3. **Dashboard Access** → Unlocked after profile completion
4. **Features** → Competitor globe, AI reports, trends, notifications

## 🧪 Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

MIT

## 👥 Contributors

Built for hackathon by [Your Team Name]

---

**Note**: This project is built for educational and hackathon purposes. Ensure you comply with all API terms of service when using third-party services.
