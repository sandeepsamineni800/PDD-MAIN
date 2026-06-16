# PDD Scheduler - Backend API Test Cases Suite (110 Unique Cases)

This document contains 110 unique backend API test cases designed to verify the performance, security, validation, and functionality of all API endpoints in the PDD Scheduler application.

---

## 1. Authentication APIs (TC-API-001 to TC-API-025)
### Target Endpoints: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`

| Test ID | Endpoint | Method | Scenario | Expected Result |
| :--- | :--- | :---: | :--- | :--- |
| **TC-API-001** | `/api/auth/login` | POST | Empty payload (no email or password) | Status `400 Bad Request` with "Missing credentials" message. |
| **TC-API-002** | `/api/auth/login` | POST | Missing password parameter | Status `400 Bad Request` with "Missing credentials" message. |
| **TC-API-003** | `/api/auth/login` | POST | Missing email parameter | Status `400 Bad Request` with "Missing credentials" message. |
| **TC-API-004** | `/api/auth/login` | POST | Invalid email format input | Status `400 Bad Request` with email validation error. |
| **TC-API-005** | `/api/auth/login` | POST | Non-existent user email | Status `401 Unauthorized` with "Invalid credentials" error. |
| **TC-API-006** | `/api/auth/login` | POST | Wrong password for valid user | Status `401 Unauthorized` with "Invalid credentials" error. |
| **TC-API-007** | `/api/auth/login` | POST | SQL Injection string in email | Status `401 Unauthorized` or `400`; sanitization prevents DB bypass. |
| **TC-API-008** | `/api/auth/login` | POST | HTML scripts tags inside fields | Payload is sanitized; returns validation error. |
| **TC-API-009** | `/api/auth/login` | POST | Successful Authentication | Status `200 OK` returning user details and setting auth token cookie. |
| **TC-API-010** | `/api/auth/logout` | POST | Logout when unauthenticated | Status `200 OK` or `204 No Content`; clears non-existent cookies. |
| **TC-API-011** | `/api/auth/logout` | POST | Successful session termination | Status `200 OK`; deletes/expires JWT authorization cookie. |
| **TC-API-012** | `/api/auth/me` | GET | Unauthenticated request | Status `401 Unauthorized` with error message. |
| **TC-API-013** | `/api/auth/me` | GET | Valid JWT Authorization | Status `200 OK` returning currently logged-in user profile details. |
| **TC-API-014** | `/api/auth/me` | GET | Expired JWT Authorization cookie | Status `401 Unauthorized`; token expiration checked correctly. |
| **TC-API-015** | `/api/auth/me` | GET | Malformed JWT payload check | Status `401 Unauthorized`; signature validation fails. |
| **TC-API-016** | `/api/auth/login` | POST | Max login attempts threshold | Repeated failures block IP or account temporarily (Status `429`). |
| **TC-API-017** | `/api/auth/login` | POST | Password trim validation | Email/password values are trimmed before verification checks. |
| **TC-API-018** | `/api/auth/login` | POST | Concurrent logins tracking | Multiple login sessions are tracked or supported dynamically. |
| **TC-API-019** | `/api/auth/me` | GET | Check payload structure | Returns `id`, `name`, and `email` properties (no password hash). |
| **TC-API-020** | `/api/auth/login` | POST | Case insensitivity for emails | User logs in successfully with upper/lowercase variations of email. |
| **TC-API-021** | `/api/auth/login` | POST | Excessively long password bounds | Rejects passwords longer than 128 characters (Status `400`). |
| **TC-API-022** | `/api/auth/me` | GET | Response headers validation | Security headers (`X-Frame-Options`, `Content-Security-Policy`) present. |
| **TC-API-023** | `/api/auth/me` | GET | CORS configurations validation | CORS policies block requests from unauthorized origins. |
| **TC-API-024** | `/api/auth/login` | POST | Invalid Content-Type check | Returns `415 Unsupported Media Type` when sending XML or plain text. |
| **TC-API-025** | `/api/auth/me` | GET | SQLite/MySQL query safety | Checks that the profile endpoint handles database timeouts gracefully. |

---

## 2. Sign-Up & OTP Verification APIs (TC-API-026 to TC-API-045)
### Target Endpoints: `/api/auth/send-signup-otp`, `/api/auth/verify-otp`, `/api/auth/register`

| Test ID | Endpoint | Method | Scenario | Expected Result |
| :--- | :--- | :---: | :--- | :--- |
| **TC-API-026** | `/api/auth/send-signup-otp` | POST | Empty payload | Status `400` with "Email is required". |
| **TC-API-027** | `/api/auth/send-signup-otp` | POST | Malformed email input | Status `400` with invalid format validation. |
| **TC-API-028** | `/api/auth/send-signup-otp` | POST | Already registered email check | Status `409 Conflict` (Account already exists). |
| **TC-API-029** | `/api/auth/send-signup-otp` | POST | First request - Success | Status `200 OK`; OTP generated, saved to DB, and email dispatched. |
| **TC-API-030** | `/api/auth/send-signup-otp` | POST | Request spam (duplicate requests) | Deletes previous OTP and regenerates; enforces 30s rate limit. |
| **TC-API-031** | `/api/auth/verify-otp` | POST | Empty payload | Status `400` with missing keys error. |
| **TC-API-032** | `/api/auth/verify-otp` | POST | Missing OTP code parameter | Status `400` with validation error. |
| **TC-API-033** | `/api/auth/verify-otp` | POST | Missing Email parameter | Status `400` with validation error. |
| **TC-API-034** | `/api/auth/verify-otp` | POST | Mismatching OTP code | Status `400` with invalid code message. |
| **TC-API-035** | `/api/auth/verify-otp` | POST | Expired OTP code (15m elapsed) | Status `400` with code expired validation. |
| **TC-API-036** | `/api/auth/verify-otp` | POST | Successful verification | Status `200` with success flag; sets verified flag or status. |
| **TC-API-037** | `/api/auth/register` | POST | Empty payload | Status `400` with missing payload parameters. |
| **TC-API-038** | `/api/auth/register` | POST | Missing password payload parameter | Status `400` with validation error. |
| **TC-API-039** | `/api/auth/register` | POST | Missing name payload parameter | Status `400` with validation error. |
| **TC-API-040** | `/api/auth/register` | POST | Weak password validation (<6 chars) | Status `400` with password constraints description. |
| **TC-API-041** | `/api/auth/register` | POST | Attempting register without OTP verify | Status `400` or `403` indicating email is unverified. |
| **TC-API-042** | `/api/auth/register` | POST | Successful Registration | Status `200 OK` or `201 Created`; user saved to DB; returns profile. |
| **TC-API-043** | `/api/auth/send-signup-otp` | POST | Dev mode output flag check | DevOtp returned in response when SMTP is unconfigured. |
| **TC-API-044** | `/api/auth/verify-otp` | POST | Non-numeric OTP code input | Rejects with `400` status (must be 6-digit numeric). |
| **TC-API-045** | `/api/auth/register` | POST | SQL injection check in Name field | Properly sanitizes database insertion parameter. |

---

## 3. Account Maintenance APIs (TC-API-046 to TC-API-060)
### Target Endpoints: `/api/auth/change-password`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/delete-account`

| Test ID | Endpoint | Method | Scenario | Expected Result |
| :--- | :--- | :---: | :--- | :--- |
| **TC-API-046** | `/api/auth/change-password` | PUT | Unauthenticated request | Status `401 Unauthorized`. |
| **TC-API-047** | `/api/auth/change-password` | PUT | Incorrect current password | Status `400` or `401` indicating current password mismatch. |
| **TC-API-048** | `/api/auth/change-password` | PUT | New password validation mismatch | Status `400` indicating new passwords do not match. |
| **TC-API-049** | `/api/auth/change-password` | PUT | Successful password update | Status `200 OK`; hashes new password and updates DB. |
| **TC-API-050** | `/api/auth/forgot-password` | POST | Empty payload | Status `400` with "Email is required". |
| **TC-API-051** | `/api/auth/forgot-password` | POST | Unregistered email request | Status `404 Not Found` with "No account found". |
| **TC-API-052** | `/api/auth/forgot-password` | POST | Successful Link Dispatch | Status `200 OK`; generates reset token, saves in DB, sends email. |
| **TC-API-053** | `/api/auth/reset-password` | POST | Invalid token parameter | Status `400` with invalid reset token error. |
| **TC-API-054** | `/api/auth/reset-password` | POST | Expired token parameter | Status `400` with expired reset token error. |
| **TC-API-055** | `/api/auth/reset-password` | POST | Successful Password Reset | Status `200 OK`; overrides password; expires token. |
| **TC-API-056** | `/api/auth/delete-account` | DELETE | Unauthenticated request | Status `401 Unauthorized`. |
| **TC-API-057** | `/api/auth/delete-account` | DELETE | Missing verification OTP | Status `400` with verification code required. |
| **TC-API-058** | `/api/auth/delete-account` | DELETE | Incorrect verification OTP | Status `400` or `401` with invalid code message. |
| **TC-API-059** | `/api/auth/delete-account` | DELETE | Successful Deletion | Status `200 OK`; deletes user, cascade deletes all domains/tasks. |
| **TC-API-060** | `/api/auth/change-password` | PUT | Reusing identical password validation | Blocks if new password matches old password (Status `400`). |

---

## 4. Domain & Template APIs (TC-API-061 to TC-API-080)
### Target Endpoints: `/api/domains`, `/api/domains/[domainId]`

| Test ID | Endpoint | Method | Scenario | Expected Result |
| :--- | :--- | :---: | :--- | :--- |
| **TC-API-061** | `/api/domains` | GET | Unauthenticated list check | Status `401 Unauthorized`. |
| **TC-API-062** | `/api/domains` | GET | Authenticated domains fetch | Status `200 OK` returning list of domains user is a member of. |
| **TC-API-063** | `/api/domains` | POST | Unauthenticated creation check | Status `401 Unauthorized`. |
| **TC-API-064** | `/api/domains` | POST | Missing Domain Name | Status `400 Bad Request` with name required. |
| **TC-API-065** | `/api/domains` | POST | Create Custom Template Domain | Status `201 Created` with template set to "Custom". |
| **TC-API-066** | `/api/domains` | POST | Create Educational Template Domain | Status `201 Created` with preset academic config metadata. |
| **TC-API-067** | `/api/domains` | POST | Create Corporate Template Domain | Status `201 Created` with corporate structure preset metadata. |
| **TC-API-068** | `/api/domains/[domainId]`| GET | Fetch non-existent domain | Status `404 Not Found`. |
| **TC-API-069** | `/api/domains/[domainId]`| GET | Fetch domain user has no access to | Status `403 Forbidden` with access denied error. |
| **TC-API-070** | `/api/domains/[domainId]`| GET | Fetch valid domain details | Status `200 OK` returning name, role, and details. |
| **TC-API-071** | `/api/domains/[domainId]`| PUT | Unauthenticated edit | Status `401 Unauthorized`. |
| **TC-API-072** | `/api/domains/[domainId]`| PUT | Edit domain as non-admin | Status `403 Forbidden` (Only admins can modify settings). |
| **TC-API-073** | `/api/domains/[domainId]`| PUT | Edit domain details - Success | Status `200 OK` with updated name and description. |
| **TC-API-074** | `/api/domains/[domainId]`| DELETE | Unauthenticated deletion check | Status `401 Unauthorized`. |
| **TC-API-075** | `/api/domains/[domainId]`| DELETE | Delete domain as non-admin | Status `403 Forbidden` (Only admins can delete). |
| **TC-API-076** | `/api/domains/[domainId]`| DELETE | Delete domain - Success | Status `200 OK`; deletes domain, tasks, and memberships. |
| **TC-API-077** | `/api/domains` | POST | SQL injection check in description | Sanitized successfully; saved as plain text. |
| **TC-API-078** | `/api/domains` | POST | Excessively long domain name | Rejects if name exceeds 100 characters (Status `400`). |
| **TC-API-079** | `/api/domains/[domainId]`| GET | Member count parameter check | Returns members array count matching active users in DB. |
| **TC-API-080** | `/api/domains/[domainId]`| PUT | Try to set invalid template value | Rejects with `400` status for unknown template configurations. |

---

## 5. Domain Membership & Tasks APIs (TC-API-081 to TC-API-100)
### Target Endpoints: `/api/domains/[domainId]/members`, `/api/domains/[domainId]/tasks`

| Test ID | Endpoint | Method | Scenario | Expected Result |
| :--- | :--- | :---: | :--- | :--- |
| **TC-API-081** | `/api/domains/[id]/members`| POST | Invite member - Unauthenticated | Status `401`. |
| **TC-API-082** | `/api/domains/[id]/members`| POST | Invite member - Non-admin user | Status `403 Forbidden`. |
| **TC-API-083** | `/api/domains/[id]/members`| POST | Invite member - Invalid email format | Status `400`. |
| **TC-API-084** | `/api/domains/[id]/members`| POST | Invite member - Already a member | Status `400` (User already joined). |
| **TC-API-085** | `/api/domains/[id]/members`| POST | Invite member - Self invite check | Status `400` (Cannot invite yourself). |
| **TC-API-086** | `/api/domains/[id]/members`| POST | Invite member - Success | Status `200` or `201`; adds member in PENDING status. |
| **TC-API-087** | `/api/domains/[id]/members`| PUT | Change member role - Non-admin | Status `403 Forbidden`. |
| **TC-API-088** | `/api/domains/[id]/members`| PUT | Change member role - Admin success | Status `200 OK` role updated in DB. |
| **TC-API-089** | `/api/domains/[id]/members`| DELETE | Remove member - Non-admin | Status `403 Forbidden`. |
| **TC-API-090** | `/api/domains/[id]/members`| DELETE | Remove member - Admin success | Status `200 OK` member removed from workspace. |
| **TC-API-091** | `/api/domains/[id]/tasks` | GET | Fetch tasks - Unauthenticated | Status `401 Unauthorized`. |
| **TC-API-092** | `/api/domains/[id]/tasks` | GET | Fetch tasks - Valid membership | Status `200 OK` returning task list. |
| **TC-API-093** | `/api/domains/[id]/tasks` | POST | Create task - Unauthenticated | Status `401`. |
| **TC-API-094** | `/api/domains/[id]/tasks` | POST | Create task - Missing Title | Status `400` (Title is required). |
| **TC-API-095** | `/api/domains/[id]/tasks` | POST | Create task - Invalid priority parameter | Status `400` validation failure. |
| **TC-API-096** | `/api/domains/[id]/tasks` | POST | Create task - Assignee not in domain | Status `400` (Assignee must be a member). |
| **TC-API-097** | `/api/domains/[id]/tasks` | POST | Create task - Success | Status `201 Created`; saves task; triggers notification. |
| **TC-API-098** | `/api/domains/[id]/tasks` | PUT | Edit task - Update status transition | Status `200 OK` status updated (e.g. IN_PROGRESS). |
| **TC-API-099** | `/api/domains/[id]/tasks` | DELETE | Delete task - Success | Status `200 OK` task deleted from workspace database. |
| **TC-API-100** | `/api/domains/[id]/tasks` | POST | SQL injection in Task Title | Properly escapes input; creates task safely. |

---

## 6. Invitations, Notifications & Progress (TC-API-101 to TC-API-110)
### Target Endpoints: `/api/invitations`, `/api/notifications`, `/api/progress`

| Test ID | Endpoint | Method | Scenario | Expected Result |
| :--- | :--- | :---: | :--- | :--- |
| **TC-API-101** | `/api/invitations` | GET | List invitations - Unauthenticated | Status `401 Unauthorized`. |
| **TC-API-102** | `/api/invitations` | GET | List invitations - Success | Status `200 OK` returns invitations and notification feeds. |
| **TC-API-103** | `/api/invitations` | POST | Accept invitation - Success | Status `200 OK` updates member status to ACCEPTED. |
| **TC-API-104** | `/api/invitations` | POST | Reject invitation - Success | Status `200 OK` status to REJECTED or deleted. |
| **TC-API-105** | `/api/invitations` | POST | Dismiss invitation - Success | Status `200 OK` clears card. |
| **TC-API-106** | `/api/notifications`| GET | List notification logs - Unauthorized | Status `401`. |
| **TC-API-107** | `/api/notifications`| DELETE | Clear all notifications - Success | Status `200 OK` wipes notification log for user. |
| **TC-API-108** | `/api/notifications/[id]`| DELETE | Delete single notification - Success | Status `200` clears specific notification. |
| **TC-API-109** | `/api/progress` | GET | Fetch progress data - Unauthorized | Status `401 Unauthorized`. |
| **TC-API-110** | `/api/progress` | GET | Fetch progress data - Success | Status `200 OK` returns dynamic percentage metrics for domain tasks. |
