# Sanskriti - Admin & Customer Panel

**Secure wallet-based ordering & billing system**

A production-grade admin and customer panel built with React, TypeScript, and modern web technologies.

## 🚀 Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **Zustand** - State management
- **TanStack Query** - Data fetching
- **React Hook Form** + **Zod** - Forms & validation
- **Axios** - HTTP client

### Backend (Coming Soon)
- Node.js + Express + TypeScript
- PostgreSQL + Prisma
- JWT Authentication
- Razorpay Integration

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   ├── features/     # Feature-specific components
│   │   └── shared/       # Shared components
│   ├── pages/
│   │   ├── admin/        # Admin panel pages
│   │   └── customer/     # Customer panel pages
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities
│   ├── services/         # API services
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   └── router/           # Route configuration
├── public/
└── ...config files
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 20 LTS or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd sanskriti-project

# Install frontend dependencies
cd frontend
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

## 🌿 Git Workflow

### Branches
- `main` (prod) - Production branch
- `qa` - QA/Staging branch for testing
- `develop` - Integration branch
- `feature/*` - Feature branches

### Development Process
1. Create feature branch from `develop`
2. Develop and test locally
3. Create PR to `develop`
4. Merge to `qa` for E2E testing
5. Deploy to production via `main`

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🎨 Design System

See [`design-system.md`](./docs/design-system.md) for comprehensive design guidelines including:
- Color palette
- Typography
- Spacing system
- Component specifications
- Accessibility guidelines

## 📚 Documentation

- [Frontend Phases](./docs/frontend-phases.md) - Development roadmap
- [Tech Stack](./docs/tech-stack.md) - Technology decisions
- [Implementation Plan](./docs/implementation_plan.md) - Detailed plan

## 🔐 Default Credentials (Development)

**Admin:**
- User ID: `admin`
- Password: `admin123`

**Customer:**
- User ID: `test_user`
- Password: (see seed data)

## 📦 Deployment

### Frontend
- Staging (QA): Deployed from `qa` branch
- Production: Deployed from `main` branch

### CI/CD
GitHub Actions workflows handle:
- Linting and type checking
- Build process
- Automated deployments

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Create a PR with clear description
4. Wait for code review
5. Merge after approval

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ for modern web development**
