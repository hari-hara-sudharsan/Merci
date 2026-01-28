# Merci - AI-Powered Business Intelligence Platform

A comprehensive business intelligence platform that helps businesses track competitors, analyze market trends, and generate AI-powered reports.

## 🚀 Features

### 🔐 Authentication & User Management
- Secure authentication with NextAuth.js
- Email/password login and signup
- Protected routes with middleware

### 🏢 Business Onboarding
- Multi-step onboarding process
- Manual form input or document upload
- AI-powered document parsing (PDF, DOCX)
- Business profile with location, industry, and challenges

### 🌍 3D Competitor Globe
- Interactive 3D globe visualization using Globe.GL
- Track competitors worldwide
- Threat level analysis (low, medium, high)
- Distance-based competitor ranking
- AI-powered competitive insights

### 📊 AI-Powered Reports
- Generate comprehensive business intelligence reports
- Multiple report types:
  - Market Analysis
  - Competitor Deep Dive
  - Growth Strategy
  - Financial Insights
- AI-generated insights using OpenAI GPT-4o-mini
- 7 chart types (pie, bar, line, area, histogram, scatter, radar)
- PDF export functionality
- Strategic recommendations

### 📈 Market Trends Analysis
- Track industry trends
- AI-powered trend insights
- Impact and timeframe classification
- Confidence scoring
- Filter by category, impact, and timeframe

### 🔔 Notifications System
- Real-time notifications
- Notification bell with unread count
- Multiple notification types (trend, competitor, report, system, alert)
- Priority levels (low, medium, high)
- Mark as read functionality

### 📱 Main Dashboard
- Overview of key metrics
- Quick actions
- Recent reports and competitors
- Trending market insights
- Activity feed

### ⚙️ Settings
- Profile management
- Business settings
- Notification preferences
- Security settings

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **3D Visualization**: Globe.GL
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4o-mini
- **Document Parsing**: pdf-parse, mammoth

### Utilities
- **Validation**: Zod
- **Forms**: React Hook Form
- **Date Handling**: date-fns
- **HTTP Client**: Axios

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/hari-hara-sudharsan/Merci.git
cd Merci
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Optional: Geocoding API (for location services)
GEOCODING_API_KEY=your_geocoding_api_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
Merci/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── business/             # Business management
│   │   ├── competitors/          # Competitor tracking
│   │   ├── reports/              # Report generation
│   │   ├── trends/               # Trend analysis
│   │   ├── notifications/        # Notifications
│   │   └── dashboard/            # Dashboard stats
│   ├── dashboard/                # Dashboard pages
│   │   ├── competitors/          # Competitor globe
│   │   ├── reports/              # Reports list
│   │   ├── trends/               # Trends dashboard
│   │   ├── settings/             # Settings page
│   │   └── page.tsx              # Main dashboard
│   ├── login/                    # Login page
│   ├── signup/                   # Signup page
│   └── onboarding/               # Onboarding flow
├── components/                   # React components
│   ├── ui/                       # UI primitives
│   ├── dashboard/                # Dashboard components
│   ├── globe/                    # 3D globe components
│   ├── onboarding/               # Onboarding components
│   ├── reports/                  # Report components
│   └── trends/                   # Trend components
├── lib/                          # Utility libraries
│   ├── mongodb.ts                # Database connection
│   ├── utils.ts                  # Utility functions
│   ├── competitors.ts            # Competitor analysis
│   ├── trends.ts                 # Trend analysis
│   ├── report-generator.ts       # Report generation
│   └── pdf-export.ts             # PDF export
├── models/                       # Mongoose models
│   ├── User.ts                   # User model
│   ├── Business.ts               # Business model
│   ├── Competitor.ts             # Competitor model
│   ├── Report.ts                 # Report model
│   ├── Trend.ts                  # Trend model
│   └── Notification.ts           # Notification model
├── middleware.ts                 # Next.js middleware
└── types/                        # TypeScript types
```

## 🎨 Design System

The platform uses a custom design system with:
- **Glassmorphism effects**: Translucent cards with backdrop blur
- **Dark mode support**: Automatic theme switching
- **Responsive design**: Mobile-first approach
- **Vibrant color palette**: Primary, secondary, accent colors
- **Smooth animations**: Framer Motion transitions

## 🔑 Key Features Explained

### AI-Powered Document Parsing
Upload business documents (PDF, DOCX) and let AI extract:
- Business name and industry
- Location and contact information
- Business description
- Key challenges and goals

### Competitive Threat Analysis
Automatically calculate threat levels based on:
- Geographic proximity
- Market share comparison
- Revenue comparison
- Industry overlap

### Market Trend Insights
AI analyzes trends and provides:
- Opportunities for your business
- Potential threats
- Strategic recommendations
- Confidence scoring

### Report Generation
Generate comprehensive reports with:
- Executive summary
- Key metrics and KPIs
- Data visualizations
- Strategic recommendations
- Export to PDF

## 🚦 Getting Started

1. **Sign up** for an account
2. **Complete onboarding** by entering business details or uploading a document
3. **Add competitors** to track on the 3D globe
4. **Generate reports** for market analysis
5. **Explore trends** relevant to your industry
6. **Configure settings** and notification preferences

## 📝 API Documentation

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Business
- `GET /api/business/get` - Get business profile
- `POST /api/business/create` - Create business profile
- `PATCH /api/business/update` - Update business profile
- `POST /api/business/parse-document` - Parse business document

### Competitors
- `GET /api/competitors/fetch` - Get competitors
- `POST /api/competitors/create` - Add competitor
- `POST /api/competitors/analyze` - AI competitor analysis

### Reports
- `GET /api/reports/list` - List reports
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/[id]` - Get report details

### Trends
- `GET /api/trends/fetch` - Get trends
- `POST /api/trends/create` - Create trend

### Notifications
- `GET /api/notifications/create` - Get notifications
- `POST /api/notifications/create` - Create notification
- `PATCH /api/notifications/[id]/read` - Mark as read
- `PATCH /api/notifications/mark-all-read` - Mark all as read

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Hari Hara Sudharsan**
- GitHub: [@hari-hara-sudharsan](https://github.com/hari-hara-sudharsan)

## 🙏 Acknowledgments

- OpenAI for GPT-4o-mini API
- Globe.GL for 3D visualization
- Next.js team for the amazing framework
- MongoDB for the database
- All open-source contributors

---

Built with ❤️ using Next.js, TypeScript, and AI
