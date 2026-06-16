# 🚀 PDD — Core Scheduler | Multi-Domain Task Manager

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![Tests](https://img.shields.io/badge/tests-110%20passed-brightgreen) ![Coverage](https://img.shields.io/badge/pass%20rate-100%25-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Platform](https://img.shields.io/badge/platform-Next.js%2016-black)

> Intelligently assign and manage tasks across different domains like roommates, software teams, and college projects.

---

## 📋 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Testing Report](#-testing-report)
  - [Summary](#summary)
  - [UI/UX Tests](#-uiux-tests-2525-passed)
  - [Functional Tests](#-functional-tests-3535-passed)
  - [Validation Tests](#-validation-tests-2525-passed)
  - [E2E Integration Tests](#-e2e-integration-tests-2020-passed)
  - [Deployable Status Tests](#-deployable-status-tests-55-passed)
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
| Selenium WebDriver | E2E Testing |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📊 Testing Report

**Automated Selenium E2E Test Suite** — 110 unique test cases executed with Chrome Headless

### Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 110 |
| **Passed** | 110 ✅ |
| **Failed** | 0 |
| **Pass Rate** | 100.0% |
| **Test Framework** | Selenium WebDriver 4.x |
| **Browser** | Chrome Headless |
| **Report File** | `apptestingreport.xlsx` |

### Category Breakdown

| Category | Tests | Passed | Status |
|----------|-------|--------|--------|
| UI/UX Tests | 25 | 25 | ✅ All Passed |
| Functional Tests | 35 | 35 | ✅ All Passed |
| Validation Tests | 25 | 25 | ✅ All Passed |
| E2E Integration Tests | 20 | 20 | ✅ All Passed |
| Deployable Status Tests | 5 | 5 | ✅ All Passed |

---

### 🎨 UI/UX Tests (25/25 Passed)

| Test ID | Test Name | Status |
|---------|-----------|--------|
| TC001 | Homepage loads correctly | ✅ PASS |
| TC002 | Onboarding slide 1 content renders | ✅ PASS |
| TC003 | Onboarding slide navigation buttons present | ✅ PASS |
| TC004 | Onboarding multi-slide content available | ✅ PASS |
| TC005 | Skip button visibility on onboarding | ✅ PASS |
| TC006 | Get Started CTA button present | ✅ PASS |
| TC007 | Login page layout renders correctly | ✅ PASS |
| TC008 | Register page layout renders correctly | ✅ PASS |
| TC009 | Dark theme applied as default | ✅ PASS |
| TC010 | Glassmorphism CSS styling applied | ✅ PASS |
| TC011 | Animated background component renders | ✅ PASS |
| TC012 | Login form has email and password fields | ✅ PASS |
| TC013 | Sign Up navigation link on login page | ✅ PASS |
| TC014 | Sign In navigation link on register page | ✅ PASS |
| TC015 | Page title contains application name | ✅ PASS |
| TC016 | Favicon loads correctly | ✅ PASS |
| TC017 | Meta description tag present | ✅ PASS |
| TC018 | Inter font family loaded | ✅ PASS |
| TC019 | CSS design system variables defined | ✅ PASS |
| TC020 | Button hover effects CSS applied | ✅ PASS |
| TC021 | Input field focus styling works | ✅ PASS |
| TC022 | Error message styling with danger color | ✅ PASS |
| TC023 | Success message styling with success color | ✅ PASS |
| TC024 | Loading spinner animation defined | ✅ PASS |
| TC025 | Responsive viewport meta tag present | ✅ PASS |

---

### ⚙️ Functional Tests (35/35 Passed)

| Test ID | Test Name | Status |
|---------|-----------|--------|
| TC026 | Login with valid credentials succeeds | ✅ PASS |
| TC027 | Login with invalid credentials shows error | ✅ PASS |
| TC028 | Login with empty email shows validation | ✅ PASS |
| TC029 | Login with empty password shows validation | ✅ PASS |
| TC030 | Forgot password link present on login | ✅ PASS |
| TC031 | Back to login from forgot password works | ✅ PASS |
| TC032 | Register page shows step 1 fields | ✅ PASS |
| TC033 | Registration link from login page works | ✅ PASS |
| TC034 | Dashboard redirects unauthenticated to login | ✅ PASS |
| TC035 | Dashboard loads for authenticated users | ✅ PASS |
| TC036 | Dashboard displays Your Workspaces heading | ✅ PASS |
| TC037 | Create workspace button visible on dashboard | ✅ PASS |
| TC038 | New domain page shows template selection | ✅ PASS |
| TC039 | Room Core template card displayed | ✅ PASS |
| TC040 | Software Team template card displayed | ✅ PASS |
| TC041 | College Project template card displayed | ✅ PASS |
| TC042 | Custom domain creation page loads | ✅ PASS |
| TC043 | Domain creation with name succeeds | ✅ PASS |
| TC044 | Domain creation without name shows error | ✅ PASS |
| TC045 | Domain detail page loads tasks section | ✅ PASS |
| TC046 | Domain detail page loads members section | ✅ PASS |
| TC047 | Task creation form renders for admin | ✅ PASS |
| TC048 | Invite member form renders for admin | ✅ PASS |
| TC049 | Sidebar navigation contains all links | ✅ PASS |
| TC050 | Dashboard link in sidebar navigable | ✅ PASS |
| TC051 | New Domain link in sidebar navigable | ✅ PASS |
| TC052 | Create Domain link in sidebar navigable | ✅ PASS |
| TC053 | Invitations link in sidebar navigable | ✅ PASS |
| TC054 | Progress link in sidebar navigable | ✅ PASS |
| TC055 | Terms link in sidebar navigable | ✅ PASS |
| TC056 | Profile link in sidebar navigable | ✅ PASS |
| TC057 | Logout button present in sidebar | ✅ PASS |
| TC058 | Logout functionality works | ✅ PASS |
| TC059 | Profile page displays user information | ✅ PASS |
| TC060 | Profile page shows change password section | ✅ PASS |

---

### 🔒 Validation Tests (25/25 Passed)

| Test ID | Test Name | Status |
|---------|-----------|--------|
| TC061 | Email field validates email format on login | ✅ PASS |
| TC062 | Password field is type=password on login | ✅ PASS |
| TC063 | Email field validates format on register | ✅ PASS |
| TC064 | Name field required on register | ✅ PASS |
| TC065 | OTP field max length is 6 | ✅ PASS |
| TC066 | Password minimum length enforced | ✅ PASS |
| TC067 | Empty form submission prevented on login | ✅ PASS |
| TC068 | Empty form submission prevented on register | ✅ PASS |
| TC069 | Domain name required for workspace creation | ✅ PASS |
| TC070 | Task title required for task creation | ✅ PASS |
| TC071 | Invite email validates email format | ✅ PASS |
| TC072 | Change password requires current password | ✅ PASS |
| TC073 | Change password requires new password | ✅ PASS |
| TC074 | Change password requires confirm password | ✅ PASS |
| TC075 | New passwords must match validation | ✅ PASS |
| TC076 | New password minimum 6 characters | ✅ PASS |
| TC077 | Forgot password OTP field maxlength 6 | ✅ PASS |
| TC078 | Delete account OTP field maxlength 6 | ✅ PASS |
| TC079 | Form prevents double submission on login | ✅ PASS |
| TC080 | Form prevents double submission on register | ✅ PASS |
| TC081 | XSS protection - script tags in inputs | ✅ PASS |
| TC082 | SQL injection protection in inputs | ✅ PASS |
| TC083 | HTML entities escaped in display | ✅ PASS |
| TC084 | Long text input handled gracefully | ✅ PASS |
| TC085 | Special characters in name field handled | ✅ PASS |

---

### 🔗 E2E Integration Tests (20/20 Passed)

| Test ID | Test Name | Status |
|---------|-----------|--------|
| TC086 | Full login to dashboard flow | ✅ PASS |
| TC087 | Full login to create workspace flow | ✅ PASS |
| TC088 | Full login to progress page flow | ✅ PASS |
| TC089 | Full login to invitations page flow | ✅ PASS |
| TC090 | Full login to profile page flow | ✅ PASS |
| TC091 | Full login to terms page flow | ✅ PASS |
| TC092 | Settings panel toggle in sidebar | ✅ PASS |
| TC093 | Theme switch to light mode persists | ✅ PASS |
| TC094 | Theme switch to dark mode persists | ✅ PASS |
| TC095 | Language setting available in settings | ✅ PASS |
| TC096 | Font size setting available in settings | ✅ PASS |
| TC097 | Settings panel opens and closes | ✅ PASS |
| TC098 | Scroll to top button appears on scroll | ✅ PASS |
| TC099 | Mobile menu button on narrow viewport | ✅ PASS |
| TC100 | Dashboard empty state rendering | ✅ PASS |
| TC101 | Terms page displays all sections | ✅ PASS |
| TC102 | Profile page change password section | ✅ PASS |
| TC103 | Profile page danger zone section | ✅ PASS |
| TC104 | Progress page displays content | ✅ PASS |
| TC105 | Navigation breadcrumbs work correctly | ✅ PASS |

---

### 🚀 Deployable Status Tests (5/5 Passed)

| Test ID | Test Name | Status |
|---------|-----------|--------|
| TC106 | Application serves on port 3000 | ✅ PASS |
| TC107 | All critical routes return responses | ✅ PASS |
| TC108 | API routes return proper responses | ✅ PASS |
| TC109 | Static assets load correctly | ✅ PASS |
| TC110 | HTML document proper structure | ✅ PASS |

---

## ✅ Deployment Status

| Check | Status |
|-------|--------|
| Build | ✅ Passing |
| TypeScript | ✅ No Errors |
| All Tests | ✅ 110/110 Passed |
| Server Health | ✅ Running |
| API Endpoints | ✅ Responsive |
| Static Assets | ✅ Loading |
| HTML Structure | ✅ Valid |
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
│   └── selenium/            # E2E test suite (110 tests)
├── apptestingreport.xlsx    # Test report
└── README.md                # This file
```

---

## 🛡️ Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcryptjs
- OTP verification for registration and account deletion
- Role-based access control (Admin/Sub-Admin/Member)
- Input validation and sanitization

---

## 📄 License

This project is for educational purposes. Built with ❤️ using Next.js and React.
