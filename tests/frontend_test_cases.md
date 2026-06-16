# PDD Scheduler - Frontend Functionality & E2E Test Cases Suite (115 Unique Cases)

This document outlines 115 unique frontend functionality and E2E test cases designed to verify user experience, client-side validation, responsiveness, and state machines in the PDD Scheduler web interface.

---

## 1. Authentication & Security UI (TC-UI-001 to TC-UI-025)

| Test ID | Title | Test Type | Action / Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UI-001** | Signup Validation - Empty Fields | Functional / Validation | Navigate to `/register`, leave all inputs blank, and click "Sign Up". | Validation errors are displayed for Name, Email, and Password. |
| **TC-UI-002** | Signup Validation - Invalid Email Format | Functional / Validation | Enter name, invalid email (e.g., `user@domain`), password, and click "Sign Up". | Warning/error message appears: "Please enter a valid email address". |
| **TC-UI-003** | Signup Validation - Weak Password | Functional / Validation | Enter name, valid email, short password (< 6 chars), and click "Sign Up". | Error message indicates password must be at least 6 characters. |
| **TC-UI-004** | Signup OTP Request Trigger | Functional | Enter valid name, email, and password, then click "Send OTP". | OTP is sent successfully; countdown timer starts; OTP input field is visible. |
| **TC-UI-005** | Signup OTP Verification - Incorrect Code | Functional / Security | Input an incorrect 6-digit OTP code and click "Verify & Register". | Error message: "Invalid OTP code". Signup is not completed. |
| **TC-UI-006** | Signup OTP Verification - Expired Code | Functional / Security | Input a valid OTP code after the 5-minute expiration period. | Error message: "OTP has expired. Please request a new one". |
| **TC-UI-007** | Signup - Successful Registration | Functional / Validation | Enter correct details, request OTP, input correct OTP, and click "Verify". | Account is created; user is redirected to the login page or dashboard. |
| **TC-UI-008** | Login - Empty Fields | Functional / Validation | Navigate to `/login`, leave Email and Password blank, click "Log In". | Form validation errors highlight email and password fields. |
| **TC-UI-009** | Login - Invalid Credentials | Functional / Security | Input unregistered email or wrong password, click "Log In". | Error message displayed: "Invalid email or password". |
| **TC-UI-010** | Login - Successful Authentication | Functional | Input correct registered email and password, click "Log In". | Token is stored; user is redirected to the dashboard (`/dashboard`). |
| **TC-UI-011** | Password Reset - Request OTP | Functional | Navigate to `/forgot-password`, enter registered email, click "Send Reset Link/OTP". | OTP code is generated and sent to email; reset form page is revealed. |
| **TC-UI-012** | Password Reset - Invalid Email | Functional / Validation | Enter unregistered email on `/forgot-password` and click "Send". | Error message: "No account found with this email". |
| **TC-UI-013** | Password Reset - Execute Reset | Functional | Enter reset OTP, type new password, and click "Reset Password". | Password updated successfully; user redirected to login page. |
| **TC-UI-014** | Auth Middleware - Protected Dashboard Redirect | Security | Try to access `/dashboard` directly without logging in (no session token). | Redirected automatically to `/login` with clean query params. |
| **TC-UI-015** | Auth Middleware - Protected API Redirect | Security | Send a `GET` request to `/api/domains` using an API client without auth header. | API returns `401 Unauthorized` status. |
| **TC-UI-016** | Session Persistence - Page Reload | UI/UX / Security | Log in, navigate to dashboard, reload the page. | User remains logged in; session token persists (local storage or cookies). |
| **TC-UI-017** | Account Logout | Functional | Click the "Logout" button in the dashboard navigation sidebar. | Token cleared; user immediately redirected to `/login`. |
| **TC-UI-018** | Logout - Back Button Prevention | Security | Log out, then click the browser's "Back" button. | User stays on the login page; dashboard content is not accessible. |
| **TC-UI-019** | Profile - Change Password Match | Functional / Validation | In profile, enter new password and mismatching confirmation password. | Validation error: "Passwords do not match". |
| **TC-UI-020** | Profile - Change Password Executed | Functional | In profile, input current password, valid matching new passwords, click "Update". | Password is changed; session remains valid or prompts to re-login. |
| **TC-UI-021** | Delete Account - Trigger OTP | Functional | Click "Delete Account" in profile settings. | OTP is sent to the user's email; confirmation modal appears. |
| **TC-UI-022** | Delete Account - Invalid Verification | Functional / Security | Enter wrong OTP code in account deletion modal. | Error message: "Incorrect OTP". Account is not deleted. |
| **TC-UI-023** | Delete Account - Successful Execution | Functional | Enter correct OTP code in account deletion modal, click "Delete Permanently". | User account, owned domains, and tasks are deleted; redirected to `/register`. |
| **TC-UI-024** | CSRF / Session Hijacking Prevention | Security | Attempt to query `/api/me` with a malformed jwt cookie. | API rejects request and returns `400 Bad Request` or `401 Unauthorized`. |
| **TC-UI-025** | Password Storage Security | Security | Verify password format stored in database (via direct db check). | Passwords must be hashed using bcrypt (salting round > 10). |

---

## 2. User Dashboard & Navigation UI (TC-UI-026 to TC-UI-040)

| Test ID | Title | Test Type | Action / Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UI-026** | Dashboard Layout Render | UI/UX | Log in and verify rendering of Sidebar, Topbar, and Content Area. | All components render correctly without overlapping elements. |
| **TC-UI-027** | Navigation Links Clickability | UI/UX | Click through Sidebar links: Home, Domains, Invitations, Profile. | URLs update correctly and load matching page views. |
| **TC-UI-028** | Active Navigation Item Highlight | UI/UX | Navigate to `/dashboard/invitations`. | The "Invitations" item in the sidebar shows active styling (highlighted). |
| **TC-UI-029** | Sidebar Responsive Collapse | UI/UX | Resize viewport to mobile width (< 768px). | Sidebar collapses into a hamburger menu button. |
| **TC-UI-030** | Sidebar Hamburger Menu Toggle | UI/UX | Tap hamburger button on mobile viewport. | Sidebar drawers opens smoothly; clicking outside closes it. |
| **TC-UI-031** | Dashboard Welcome Banner | UI/UX | Verify the welcome banner displays the logged-in user's name. | Welcome message correctly pulls and displays the username (e.g. "Welcome, John!"). |
| **TC-UI-032** | Dashboard Summary Cards - Tasks count | Functional | Check "Total Tasks", "Pending Tasks", and "Completed Tasks" counters. | Numbers correspond to actual counts of tasks in database for this user. |
| **TC-UI-033** | Dashboard Summary Cards - Domains count | Functional | Check "My Domains" counter. | Display matches the count of domains the user is a member of. |
| **TC-UI-034** | Notification Badge Update | Functional | Receive a new notification. | The red notification indicator in the topbar header increases count. |
| **TC-UI-035** | Notification Dropdown Toggle | UI/UX | Click the Notification Bell icon in the header. | Dropdown menu slides open, showing list of recent notifications. |
| **TC-UI-036** | Mark Single Notification as Read | Functional | Open notification dropdown, click "Mark as read" on a notification. | Notification status changes in database; counter decreases dynamically. |
| **TC-UI-037** | Mark All Notifications as Read | Functional | Click "Mark all as read" in the notifications list. | All notifications set to read; counter badge disappears. |
| **TC-UI-038** | Dashboard Recent Activity List | UI/UX | Check "Recent Activity" feed on main dashboard page. | Displays latest tasks created, domain updates, or invitations received. |
| **TC-UI-039** | Dark Mode Toggle | UI/UX | Click theme toggle button in dashboard header. | Entire dashboard theme switches smoothly between Light and Dark mode. |
| **TC-UI-040** | Profile Avatar Render | UI/UX | Verify profile avatar image/initials are displayed in header. | Initial letter of username is displayed when no avatar image is set. |

---

## 3. Domain Management & Templating UI (TC-UI-041 to TC-UI-060)

| Test ID | Title | Test Type | Action / Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UI-041** | Domain List Page Loading | Functional | Click on "Domains" in the sidebar navigation. | Displays a list of all joined domains, grouped by role (Admin vs Member). |
| **TC-UI-042** | Create Domain Modal Trigger | UI/UX | Click "Create Domain" button on the domains page. | Modal form opens with name, description, and template selector. |
| **TC-UI-043** | Create Domain - Missing Fields | Functional / Validation | Leave Domain Name empty in creation modal, click "Submit". | Validation error: "Domain Name is required". |
| **TC-UI-044** | Create Domain - Success (Custom Template) | Functional | Enter name, description, select "Custom" template, click "Create". | Domain created; user redirected to the new domain workspace page. |
| **TC-UI-045** | Create Domain - Success (Predefined Template) | Functional | Create domain using template (e.g. "Educational" or "Corporate"). | Domain created with template-specific pre-configured settings/labels. |
| **TC-UI-046** | Domain Settings Access Control | Security | Navigate to settings tab of a domain where current user is a "MEMBER". | The Settings button is disabled, or page returns "Access Denied". |
| **TC-UI-047** | Domain Edit Details (Admin) | Functional | In Domain Settings, change name and description, click "Save". | Details update in database; sidebar and header show new name. |
| **TC-UI-048** | Invite Member - Invalid Email | Functional / Validation | Input an invalid email format into invite field, click "Send Invite". | Validation error shows: "Enter a valid email address". |
| **TC-UI-049** | Invite Member - Self Invitation | Functional / Security | Input current logged-in user's email, click "Send Invite". | Error message: "You cannot invite yourself to this domain". |
| **TC-UI-050** | Invite Member - Already a Member | Functional | Input email of someone who is already in the domain. | Error message: "User is already a member of this domain". |
| **TC-UI-051** | Invite Member - Success | Functional | Input email of a valid registered user, select role, click "Send Invite". | Invitation is sent; notification created for target user; status is PENDING. |
| **TC-UI-052** | Domain Member List Display | UI/UX | Navigate to "Members" tab within a domain workspace. | Displays all active and pending members with their emails and roles. |
| **TC-UI-053** | Update Member Role - Access Control | Security | Try to change member role while logged in as a "MEMBER" (using API request). | API returns `403 Forbidden` status. |
| **TC-UI-054** | Update Member Role (Admin) | Functional | Logged in as Admin, change member's role from "MEMBER" to "ADMIN". | Database updates; user now has admin privileges on the domain. |
| **TC-UI-055** | Transfer Ownership (Admin) | Functional | Admin clicks "Transfer Ownership" to another member. | Target member becomes owner/admin; original owner demoted or stays admin. |
| **TC-UI-056** | Remove Member from Domain (Admin) | Functional | Admin clicks "Remove" next to a member's name. | Member is removed from the domain; they lose access to domain tasks. |
| **TC-UI-057** | Leave Domain (Member) | Functional | Member clicks "Leave Domain" in domain workspace. | User is removed from domain; redirected to dashboard home. |
| **TC-UI-058** | Delete Domain - Cancel Confirmation | UI/UX | Admin clicks "Delete Domain", then clicks "Cancel" in confirmation dialog. | Modal closes; domain remains intact. |
| **TC-UI-059** | Delete Domain - Confirmed Success | Functional | Admin clicks "Delete Domain", type confirmation text, click "Confirm". | Domain and all associated tasks/invitations are deleted from database. |
| **TC-UI-060** | SQLite Database Explorer Page | Functional | Access SQL page `/dashboard/sql` and run a select query. | Displays query execution results in a structured data table format. |

---

## 4. Task Management & Scheduling UI (TC-UI-061 to TC-UI-085)

| Test ID | Title | Test Type | Action / Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UI-061** | Task List Rendering | UI/UX | Open a domain page, go to "Tasks" tab. | Lists all tasks in a structured grid or board view. |
| **TC-UI-062** | Add Task Modal Trigger | UI/UX | Click "Add Task" button in domain workspace. | Form opens with title, description, priority, due date, and assignee. |
| **TC-UI-063** | Add Task - Empty Title | Functional / Validation | Leave Task Title empty, click "Save". | Validation error: "Task Title is required". |
| **TC-UI-064** | Add Task - Successful Creation | Functional | Enter valid details, set priority to "HIGH", click "Save". | Task is created, visible on the board/list, and saved to database. |
| **TC-UI-065** | Assign Task to Member | Functional | Choose a domain member in "Assignee" dropdown during task creation. | Task is created and assigned; notification sent to the assignee. |
| **TC-UI-066** | Task Priority Indicator Color | UI/UX | Add a task with "HIGH" priority and another with "LOW" priority. | High priority shows red badge/border; low priority shows green/blue. |
| **TC-UI-067** | Task Status Transition (Drag-and-Drop) | UI/UX / Functional | Drag task from "PENDING" column to "IN_PROGRESS" column. | Task status updates in database; visual placement persists on reload. |
| **TC-UI-068** | Task Status Transition (Dropdown Edit) | Functional | Open task details, select "COMPLETED" from dropdown, click "Save". | Task updates to COMPLETED status; task card moves to Completed section. |
| **TC-UI-069** | Task Due Date Warning | UI/UX | View task whose due date has passed. | Card highlights due date in red/orange warning style. |
| **TC-UI-070** | Edit Task Details | Functional | Click "Edit" on a task card, modify description, click "Save". | Changes are persisted and updated dynamically on the UI. |
| **TC-UI-071** | Delete Task | Functional | Click "Delete" on a task card, confirm action. | Task is removed from UI and deleted from the database. |
| **TC-UI-072** | Filter Tasks by Status | Functional | Select status filter (e.g. "IN_PROGRESS"). | Only tasks with IN_PROGRESS status are displayed. |
| **TC-UI-073** | Filter Tasks by Priority | Functional | Select priority filter (e.g. "HIGH"). | Only tasks with HIGH priority are displayed. |
| **TC-UI-074** | Search Tasks by Title | Functional | Type search query in search input box. | List dynamically filters tasks with matching letters in title or description. |
| **TC-UI-075** | Assignee Filter | Functional | Click "My Tasks Only" filter. | Displays only tasks where assigneeId matches logged-in userId. |
| **TC-UI-076** | Domain Progress Bar calculation | Functional | Change status of a task from PENDING to COMPLETED. | Overall domain progress bar percentage increases dynamically. |
| **TC-UI-077** | Tasks Calendar View Render | UI/UX | Switch task view mode from List to Calendar. | Calendar displays tasks plotted on their respective due dates. |
| **TC-UI-078** | Calendar Date Navigation | UI/UX | Click next/prev buttons on calendar header. | Calendar navigates smoothly between months/weeks. |
| **TC-UI-079** | Calendar Task Quick View | UI/UX | Click on a task block inside calendar grid. | Modal pops up showing quick summary of task details. |
| **TC-UI-080** | Task Comments Section Render | UI/UX | Click on a task card to open detailed detail view. | Comments feed and text box render correctly at bottom of modal. |
| **TC-UI-081** | Add Comment to Task | Functional | Type comment text and click "Post Comment". | Comment added; displayed with user's name and timestamp immediately. |
| **TC-UI-082** | Add Comment - Empty Text | Functional / Validation | Click "Post Comment" with empty input field. | No comment is posted; warning or disable button prevents submission. |
| **TC-UI-083** | Delete Comment (Owner) | Functional | Click "Delete" icon on comment posted by current user. | Comment is removed immediately from feed and database. |
| **TC-UI-084** | Delete Comment (Non-Owner) | Security | Verify there is no delete option for comments posted by other users. | Delete icon is hidden and direct API delete returns `403`. |
| **TC-UI-085** | Due Date Boundary Validation | Functional / Validation | Set task due date to a date in the past during creation. | Form accepts or warns user depending on settings (e.g. shows overdue marker). |

---

## 5. Notifications & Invitations UI (TC-UI-086 to TC-UI-100)

| Test ID | Title | Test Type | Action / Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UI-086** | Invitations Page Render | UI/UX | Click "Invitations" link in sidebar. | Lists all pending invitations from other domains. |
| **TC-UI-087** | Accept Invitation | Functional | Click "Accept" on a pending invitation card. | Status updates to ACCEPTED in DB; user added to domain; layout badge updates dynamically. |
| **TC-UI-088** | Reject Invitation | Functional | Click "Reject" on a pending invitation card. | Status updates to REJECTED or deleted; invitation disappears from list. |
| **TC-UI-089** | Dismiss Invitation | Functional | Click "Dismiss" on an invitation. | Invitation card is hidden/cleared from view. |
| **TC-UI-090** | Badge Updates Without Page Reload | UI/UX / Functional | Accept/Reject invitation or dismiss. | The sidebar and topbar badge counts update immediately without page reloading. |
| **TC-UI-091** | Notification List Page Loading | UI/UX | Navigate to `/dashboard/notifications`. | Shows historical log of all notifications for this user. |
| **TC-UI-092** | Notification Trigger - Task Assigned | Functional | User A assigns a task to User B. | User B receives a real-time notification: "You have been assigned a task...". |
| **TC-UI-093** | Notification Trigger - Role Change | Functional | Admin promotes User B to Admin. | User B receives notification: "Your role has been updated to ADMIN in...". |
| **TC-UI-094** | Notification Trigger - Domain Deleted | Functional | Admin deletes a domain. | All members receive notification that the domain was deleted. |
| **TC-UI-095** | Delete Notification | Functional | Click "Delete" button next to a notification in history list. | Notification is deleted from DB and removed from UI list. |
| **TC-UI-096** | Clear All Notifications History | Functional | Click "Clear All Notifications" on history page. | Entire notification log is wiped for current user; list shows empty state message. |
| **TC-UI-097** | Push Notifications Permission Prompt | UI/UX | Load app in PWA-supporting environment. | Prompts user to allow browser push notifications if enabled. |
| **TC-UI-098** | Email Notification Delivery | Integration | Perform action that triggers email notification (e.g. signup OTP). | Email is received with correct headers and HTML content formatting. |
| **TC-UI-099** | Notification List Pagination | UI/UX | Accumulate > 20 notifications in history. | Pagination controls display; clicking Page 2 loads older notifications. |
| **TC-UI-100** | Notification Link Redirection | Functional | Click on a "Task Assigned" notification. | User is redirected directly to the specific task/domain view. |

---

## 6. UI/UX, Performance & Cross-Platform (TC-UI-101 to TC-UI-115)

| Test ID | Title | Test Type | Action / Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UI-101** | Font Size Adjustment - Render | UI/UX | Go to Profile Settings, select a custom font size, click Save. | All dashboard elements scale text size dynamically and remain readable. |
| **TC-UI-102** | Language Translation (i18n) | UI/UX | Change language settings (e.g. English to Spanish). | Static text labels translate correctly; layout doesn't break due to string length. |
| **TC-UI-103** | Page Loading Skeleton States | UI/UX | Simulate slow network connection (3G) and navigate to dashboard. | Skeletons display in place of charts and tables while fetching data. |
| **TC-UI-104** | Error Page Render (404) | UI/UX | Navigate to a non-existent path (e.g., `/dashboard/nonexistent`). | Renders a custom 404 page with a "Back to Home" link. |
| **TC-UI-105** | Form Button Loading Spinner | UI/UX | Click "Log In" with valid inputs. | Login button displays a loading spinner and goes disabled to prevent double clicks. |
| **TC-UI-106** | Toast Notifications Feedback | UI/UX | Perform successful action (e.g., Save Task). | Success Toast banner appears in top-right corner with smooth fade-in/out. |
| **TC-UI-107** | WebView Session Persistence (Android) | Integration | Log in on mobile WebView app, force-close app, reopen app. | User remains logged in; WebView CookieManager persists auth tokens. |
| **TC-UI-108** | Native Android Back Button Behavior | Integration | Press hardware/native Back button inside mobile WebView app on dashboard page. | Prompts to exit app or handles back history correctly without blank screen. |
| **TC-UI-109** | WebView Form Input Focus Keyboard | UI/UX | Focus text input inside WebView on Android device. | Keyboard slides up; viewport resizes gracefully without hiding the input field. |
| **TC-UI-110** | PWA Installation Banner | UI/UX | Open app in compatible Chrome/Edge browser. | Installation icon appears in URL bar; prompts user to install desktop app. |
| **TC-UI-111** | Service Worker Clean Registration | Integration | Inspect service workers in Chrome Developer Tools (`Application` tab). | App registers/unregisters SW cleanly; no fetch/cache errors. |
| **TC-UI-112** | Database Query Performance | Performance | Load domain dashboard with 500+ tasks. | Page loads in under 1.5 seconds; pagination/virtualization handles task loading. |
| **TC-UI-113** | SQL Injection Prevention | Security / Validation | Input `' OR '1'='1` in login email and random password. | Login fails gracefully; no SQL error exposure or auth bypass occurs. |
| **TC-UI-114** | XSS (Cross Site Scripting) Mitigation | Security / Validation | Input `<script>alert('xss')</script>` as Task Description. | Script is sanitized/escaped; description displays as plain text. |
| **TC-UI-115** | HTML Semantic Structure (SEO) | UI/UX / SEO | Audit landing pages for semantic tags (`<header>`, `<nav>`, `<main>`, `<h1>`). | Pages contain clean semantic hierarchy, single h1, and descriptive labels. |
