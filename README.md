# 🚀 PDD — Core Scheduler | Multi-Domain Task Manager

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![Tests](https://img.shields.io/badge/tests-125%20passed-brightgreen) ![Pass Rate](https://img.shields.io/badge/pass%20rate-100%25-brightgreen) ![Selenium](https://img.shields.io/badge/selenium-4.x-43B02A) ![Appium](https://img.shields.io/badge/appium-mobile-662D91) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![License](https://img.shields.io/badge/license-MIT-blue)

> Intelligently assign and manage tasks across different domains like roommates, software teams, and college projects.

---

## 📋 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Run Tests](#-run-tests)
- [Testing Report](#-e2e-testing-report)
  - [Executive Summary](#executive-summary)
  - [UI/UX Tests](#-uiux-tests-2525-passed)
  - [Functional Tests](#-functional-tests-3535-passed)
  - [Validation Tests](#-validation-tests-2525-passed)
  - [E2E Integration Tests](#-e2e-integration-tests-2020-passed)
  - [Deployable Status Tests](#-deployment-status-tests-55-passed)
  - [Appium Mobile Tests](#-appium-mobile-tests-1515-passed)
- [Deployment Status](#-deployment-status)

---

## About

**Core Scheduler** is a modern, full-stack multi-domain task management platform built with Next.js 16 and React 19. It provides:

- 🏠 **Multi-Domain Workspaces** — Room Core, Software Team, College Project templates + custom domains
- 👥 **Team Collaboration** — Invite members, assign roles (Admin/Sub-Admin/Member)
- ✅ **Smart Task Management** — Auto-assign tasks, track progress, manage deadlines
- 📊 **Visual Progress Tracking** — Per-domain progress bars and statistics
- 🌍 **Multi-Language Support** — English, Telugu, Hindi
- 🎨 **Premium UI** — Dark/Light themes, glassmorphism, animations, responsive design

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 | Full-stack React framework |
| React 19 | UI library |
| Prisma ORM | Database access layer |
| MySQL (TiDB Cloud) | Cloud database |
| JWT + bcryptjs | Authentication & security |
| Framer Motion | Animations |
| Lucide React | Icon library |
| Selenium WebDriver 4.x | E2E Testing (Desktop) |
| Appium (Chrome Mobile Emulation) | E2E Testing (Mobile) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🧪 Run Tests

Execute the full Selenium + Appium test suite (125 test cases):

```bash
node tests/selenium/test_runner.js
```

This will:
1. Launch Chrome in headless mode
2. Run all 125 test cases across 6 categories
3. Generate `apptestingreport.xlsx` in the project root
4. Save raw results to `tests/selenium/test_results.json`

---

## 📊 E2E Testing Report

**Automated Selenium + Appium E2E Test Suite** — 125 unique test cases executed with Chrome Headless

### Executive Summary

| Metric | Value |
|--------|-------|
| **Project** | PDD Core Scheduler |
| **Framework** | Selenium WebDriver 4.x + Appium (Mobile Emulation) |
| **Browser** | Chrome Headless |
| **Total Test Cases** | 125 |
| **Passed** | 125 ✅ |
| **Failed** | 0 |
| **Pass Rate** | 100.0% |
| **Report File** | [`apptestingreport.xlsx`](apptestingreport.xlsx) |

### Category Breakdown

| # | Category | Tests | Passed | Status |
|---|----------|-------|--------|--------|
| 1 | UI/UX Tests | 25 | 25 | ✅ All Passed |
| 2 | Functional Tests | 35 | 35 | ✅ All Passed |
| 3 | Validation Tests | 25 | 25 | ✅ All Passed |
| 4 | E2E Integration Tests | 20 | 20 | ✅ All Passed |
| 5 | Deployable Status Tests | 5 | 5 | ✅ All Passed |
| 6 | Appium Mobile Tests | 15 | 15 | ✅ All Passed |

---

### 🎨 UI/UX Tests (25/25 Passed)

| Test ID | Test Name | Description | Status |
|---------|-----------|-------------|--------|
| TC001 | Homepage loads correctly | Verify the homepage/onboarding page loads without errors | ✅ PASS |
| TC002 | Onboarding slide 1 content renders | Verify first onboarding slide shows Organize Your Life title | ✅ PASS |
| TC003 | Onboarding slide navigation buttons present | Verify Next button exists on onboarding slides | ✅ PASS |
| TC004 | Onboarding multi-slide content available | Verify all 3 onboarding slides content is defined | ✅ PASS |
| TC005 | Skip button visibility on onboarding | Verify Skip button is present on non-final onboarding slides | ✅ PASS |
| TC006 | Get Started CTA button present | Verify Get Started button on the final onboarding slide | ✅ PASS |
| TC007 | Login page layout renders correctly | Verify login page shows Welcome Back title, subtitle, fields, submit | ✅ PASS |
| TC008 | Register page layout renders correctly | Verify register page shows Create Account title with fields | ✅ PASS |
| TC009 | Dark theme applied as default | Verify the app uses dark theme as default color scheme | ✅ PASS |
| TC010 | Glassmorphism CSS styling applied | Verify glass-panel class with backdrop-filter blur on UI panels | ✅ PASS |
| TC011 | Animated background component renders | Verify AnimatedBackground component renders on auth pages | ✅ PASS |
| TC012 | Login form has email and password fields | Verify login form has both email and password input fields | ✅ PASS |
| TC013 | Sign Up navigation link on login page | Verify Sign up link on login page pointing to /register | ✅ PASS |
| TC014 | Sign In navigation link on register page | Verify Sign in link on register page pointing to /login | ✅ PASS |
| TC015 | Page title contains application name | Verify browser tab title contains Core Scheduler | ✅ PASS |
| TC016 | Favicon loads correctly | Verify favicon/icon resource is referenced in HTML head | ✅ PASS |
| TC017 | Meta description tag present | Verify meta description tag exists with SEO content | ✅ PASS |
| TC018 | Inter font family loaded | Verify Google Font Inter is loaded and applied to body | ✅ PASS |
| TC019 | CSS design system variables defined | Verify CSS custom properties like --accent-primary in :root | ✅ PASS |
| TC020 | Button hover effects CSS applied | Verify btn-primary with hover transform and box-shadow | ✅ PASS |
| TC021 | Input field focus styling works | Verify input fields show accent border and shadow on focus | ✅ PASS |
| TC022 | Error message styling with danger color | Verify error messages use var(--danger) color for feedback | ✅ PASS |
| TC023 | Success message styling with success color | Verify success messages use var(--success) color | ✅ PASS |
| TC024 | Loading spinner animation defined | Verify CSS spin animation keyframes for loading states | ✅ PASS |
| TC025 | Responsive viewport meta tag present | Verify meta viewport with width=device-width for mobile | ✅ PASS |

---

### ⚙️ Functional Tests (35/35 Passed)

| Test ID | Test Name | Description | Status |
|---------|-----------|-------------|--------|
| TC026 | Login with valid credentials succeeds | Verify successful login redirects to dashboard | ✅ PASS |
| TC027 | Login with invalid credentials shows error | Verify failed login shows error message on screen | ✅ PASS |
| TC028 | Login with empty email shows validation | Verify HTML5 validation prevents empty email submission | ✅ PASS |
| TC029 | Login with empty password shows validation | Verify HTML5 validation prevents empty password submission | ✅ PASS |
| TC030 | Forgot password link present on login | Verify Forgot password link is visible and clickable | ✅ PASS |
| TC031 | Back to login from forgot password works | Verify back navigation from forgot password returns to login | ✅ PASS |
| TC032 | Register page shows step 1 fields | Verify register step 1 shows name and email fields | ✅ PASS |
| TC033 | Registration link from login page works | Verify Sign up link navigates to /register page | ✅ PASS |
| TC034 | Dashboard redirects unauthenticated to login | Verify unauthenticated users are redirected to /login | ✅ PASS |
| TC035 | Dashboard loads for authenticated users | Verify authenticated users can access the dashboard | ✅ PASS |
| TC036 | Dashboard displays Your Workspaces heading | Verify dashboard shows Your Workspaces heading | ✅ PASS |
| TC037 | Create workspace button visible on dashboard | Verify Create Workspace button is visible | ✅ PASS |
| TC038 | New domain page shows template selection | Verify template selection page renders with cards | ✅ PASS |
| TC039 | Room Core template card displayed | Verify Room Core template is shown | ✅ PASS |
| TC040 | Software Team template card displayed | Verify Software Team template is shown | ✅ PASS |
| TC041 | College Project template card displayed | Verify College Project template is shown | ✅ PASS |
| TC042 | Custom domain creation page loads | Verify custom domain creation form renders | ✅ PASS |
| TC043 | Domain creation with name succeeds | Verify domain creation with valid name works | ✅ PASS |
| TC044 | Domain creation without name shows error | Verify domain creation without name shows error | ✅ PASS |
| TC045 | Domain detail page loads tasks section | Verify domain detail shows Active Tasks section | ✅ PASS |
| TC046 | Domain detail page loads members section | Verify domain detail shows Team Members section | ✅ PASS |
| TC047 | Task creation form renders for admin | Verify Create Task form appears for admin | ✅ PASS |
| TC048 | Invite member form renders for admin | Verify Invite Member form appears for admin | ✅ PASS |
| TC049 | Sidebar navigation contains all links | Verify sidebar has all navigation links | ✅ PASS |
| TC050 | Dashboard link in sidebar navigable | Verify Dashboard sidebar link works | ✅ PASS |
| TC051 | New Domain link in sidebar navigable | Verify New Domain sidebar link works | ✅ PASS |
| TC052 | Create Domain link in sidebar navigable | Verify Create Domain sidebar link works | ✅ PASS |
| TC053 | Invitations link in sidebar navigable | Verify Invitations sidebar link works | ✅ PASS |
| TC054 | Progress link in sidebar navigable | Verify Progress sidebar link works | ✅ PASS |
| TC055 | Terms link in sidebar navigable | Verify Terms sidebar link works | ✅ PASS |
| TC056 | Profile link in sidebar navigable | Verify Profile sidebar link works | ✅ PASS |
| TC057 | Logout button present in sidebar | Verify logout button is visible | ✅ PASS |
| TC058 | Logout functionality works | Verify logout clears session and redirects | ✅ PASS |
| TC059 | Profile page displays user information | Verify profile shows user name and email | ✅ PASS |
| TC060 | Profile page shows change password section | Verify change password form on profile | ✅ PASS |

---

### 🔒 Validation Tests (25/25 Passed)

| Test ID | Test Name | Description | Status |
|---------|-----------|-------------|--------|
| TC061 | Email field validates email format on login | Verify email input has type=email | ✅ PASS |
| TC062 | Password field is type=password on login | Verify password input masks characters | ✅ PASS |
| TC063 | Email field validates format on register | Verify register email has type=email | ✅ PASS |
| TC064 | Name field required on register | Verify name field has required attribute | ✅ PASS |
| TC065 | OTP field max length is 6 | Verify OTP input maxLength=6 | ✅ PASS |
| TC066 | Password minimum length enforced | Verify password minLength=6 | ✅ PASS |
| TC067 | Empty form submission prevented on login | Verify required prevents empty login | ✅ PASS |
| TC068 | Empty form submission prevented on register | Verify required prevents empty register | ✅ PASS |
| TC069 | Domain name required for workspace creation | Verify workspace requires non-empty name | ✅ PASS |
| TC070 | Task title required for task creation | Verify task creation requires title | ✅ PASS |
| TC071 | Invite email validates email format | Verify invite validates email format | ✅ PASS |
| TC072 | Change password requires current password | Verify current password is required | ✅ PASS |
| TC073 | Change password requires new password | Verify new password is required | ✅ PASS |
| TC074 | Change password requires confirm password | Verify confirm password is required | ✅ PASS |
| TC075 | New passwords must match validation | Verify mismatch shows error | ✅ PASS |
| TC076 | New password minimum 6 characters | Verify minLength=6 on new password | ✅ PASS |
| TC077 | Forgot password OTP field maxlength 6 | Verify OTP maxLength=6 on reset | ✅ PASS |
| TC078 | Delete account OTP field maxlength 6 | Verify delete OTP maxLength=6 | ✅ PASS |
| TC079 | Form prevents double submission on login | Verify button disables during login | ✅ PASS |
| TC080 | Form prevents double submission on register | Verify button disables during register | ✅ PASS |
| TC081 | XSS protection - script tags in inputs | Verify script tags handled safely | ✅ PASS |
| TC082 | SQL injection protection in inputs | Verify SQL injection handled safely | ✅ PASS |
| TC083 | HTML entities escaped in display | Verify HTML entities escaped in UI | ✅ PASS |
| TC084 | Long text input handled gracefully | Verify long text does not break UI | ✅ PASS |
| TC085 | Special characters in name field handled | Verify international chars work | ✅ PASS |

---

### 🔗 E2E Integration Tests (20/20 Passed)

| Test ID | Test Name | Description | Status |
|---------|-----------|-------------|--------|
| TC086 | Full login to dashboard flow | Verify complete login→dashboard flow | ✅ PASS |
| TC087 | Full login to create workspace flow | Verify login→create workspace flow | ✅ PASS |
| TC088 | Full login to progress page flow | Verify login→progress page flow | ✅ PASS |
| TC089 | Full login to invitations page flow | Verify login→invitations page flow | ✅ PASS |
| TC090 | Full login to profile page flow | Verify login→profile page flow | ✅ PASS |
| TC091 | Full login to terms page flow | Verify login→terms page flow | ✅ PASS |
| TC092 | Settings panel toggle in sidebar | Verify settings panel opens/closes | ✅ PASS |
| TC093 | Theme switch to light mode persists | Verify light mode saves to localStorage | ✅ PASS |
| TC094 | Theme switch to dark mode persists | Verify dark mode saves to localStorage | ✅ PASS |
| TC095 | Language setting available in settings | Verify EN/TE/HI language options | ✅ PASS |
| TC096 | Font size setting available in settings | Verify S/M/L font size options | ✅ PASS |
| TC097 | Settings panel opens and closes | Verify settings gear icon toggles panel | ✅ PASS |
| TC098 | Scroll to top button appears on scroll | Verify scroll-to-top button on scroll | ✅ PASS |
| TC099 | Mobile menu button on narrow viewport | Verify hamburger menu on mobile | ✅ PASS |
| TC100 | Dashboard empty state rendering | Verify empty state when no domains | ✅ PASS |
| TC101 | Terms page displays all sections | Verify About, Workflow, Roles, ToS | ✅ PASS |
| TC102 | Profile page change password section | Verify change password form exists | ✅ PASS |
| TC103 | Profile page danger zone section | Verify Danger Zone with delete account | ✅ PASS |
| TC104 | Progress page displays content | Verify progress shows data or empty | ✅ PASS |
| TC105 | Navigation breadcrumbs work correctly | Verify back/breadcrumb navigation | ✅ PASS |

---

### 🚀 Deployment Status Tests (5/5 Passed)

| Test ID | Test Name | Description | Status |
|---------|-----------|-------------|--------|
| TC106 | Application serves on port 3000 | Verify app responds on localhost:3000 | ✅ PASS |
| TC107 | All critical routes return responses | Verify all routes serve content | ✅ PASS |
| TC108 | API routes return proper responses | Verify API endpoints respond properly | ✅ PASS |
| TC109 | Static assets load correctly | Verify favicon and assets return 200 | ✅ PASS |
| TC110 | HTML document proper structure | Verify html, head, body, meta elements | ✅ PASS |

---

### 📱 Appium Mobile Tests (15/15 Passed)

| Test ID | Test Name | Description | Status |
|---------|-----------|-------------|--------|
| TC111 | Mobile: Homepage renders on small viewport | Verify homepage renders on 375x812 mobile viewport | ✅ PASS |
| TC112 | Mobile: Login page renders responsively | Verify login page adapts to mobile viewport | ✅ PASS |
| TC113 | Mobile: Register page renders responsively | Verify register page adapts to mobile viewport | ✅ PASS |
| TC114 | Mobile: Login form fields accessible | Verify email and password fields tappable on mobile | ✅ PASS |
| TC115 | Mobile: Login form submission works | Verify login form submits successfully on mobile | ✅ PASS |
| TC116 | Mobile: Hamburger menu visible | Verify hamburger menu icon on narrow viewport | ✅ PASS |
| TC117 | Mobile: Dashboard loads on mobile | Verify dashboard renders on mobile without overflow | ✅ PASS |
| TC118 | Mobile: Template selection page responsive | Verify template cards stack on mobile | ✅ PASS |
| TC119 | Mobile: Profile page renders on mobile | Verify profile page accessible on mobile | ✅ PASS |
| TC120 | Mobile: Progress page renders on mobile | Verify progress bars render on mobile | ✅ PASS |
| TC121 | Mobile: Invitations page renders on mobile | Verify invitation cards on mobile | ✅ PASS |
| TC122 | Mobile: Terms page scrollable on mobile | Verify terms content scrollable on mobile | ✅ PASS |
| TC123 | Mobile: Touch events supported | Verify touch event APIs accessible | ✅ PASS |
| TC124 | Mobile: Viewport prevents unwanted zoom | Verify viewport meta prevents pinch-zoom | ✅ PASS |
| TC125 | Mobile: Landscape orientation renders | Verify app renders in landscape orientation | ✅ PASS |

---

## ✅ Deployment Status

| Check | Status |
|-------|--------|
| Build | ✅ Passing |
| TypeScript | ✅ No Errors |
| Selenium Tests | ✅ 110/110 Passed |
| Appium Mobile Tests | ✅ 15/15 Passed |
| **All Tests** | **✅ 125/125 Passed** |
| Server Health | ✅ Running |
| API Endpoints | ✅ Responsive |
| Static Assets | ✅ Loading |
| HTML Structure | ✅ Valid |
| Mobile Responsive | ✅ Verified |
| **Overall** | **✅ READY FOR DEPLOYMENT** |

---

## 📂 Project Structure

```
PDD/
├── app/
│   ├── api/                 # API routes (auth, domains, tasks, invitations)
│   ├── components/          # Reusable components
│   ├── dashboard/           # Dashboard pages
│   │   ├── domains/         # Domain management
│   │   ├── invitations/     # Invitations page
│   │   ├── profile/         # User profile
│   │   ├── progress/        # Progress tracking
│   │   └── terms/           # Terms of service
│   ├── login/               # Login page
│   └── register/            # Registration page
├── lib/                     # Shared utilities
├── prisma/                  # Database schema
├── tests/
│   └── selenium/            # E2E + Appium test suite (125 tests)
│       ├── config.js        # Test configuration
│       ├── helpers.js       # Selenium helper functions
│       ├── test_runner.js   # Main test orchestrator
│       ├── generate_report.js  # Excel report generator
│       └── tests/           # Test suites (6 files)
├── apptestingreport.xlsx    # Test report (Excel)
└── README.md                # This file
```

---

## 🛡️ Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcryptjs
- OTP verification for registration and account deletion
- Role-based access control (Admin/Sub-Admin/Member)
- Input validation and sanitization
- XSS and SQL injection protection

---

## 📄 License

This project is for educational purposes. Built with ❤️ using Next.js and React.
