# Module C - Dynamic Website with Server-Side Rendering (3h)

## Task
Build a members portal for "IronSteppe Gym". All pages are server-rendered by a server framework (Express + EJS/Handlebars, Laravel, Symfony, etc.). A client-side SPA calling an API for rendering is NOT allowed. Small JS enhancements are allowed.

## Data
`members_raw.csv` is messy and not normalized (duplicate members, combined "classes" column, inconsistent phone/date formats, extra whitespace).
Design your own database schema and write an import script.

## Features
1. Login/logout. Nothing is accessible without login except /login.
2. Roles: member and admin.
3. Member: view/edit own profile (name, phone, email, password change); see own bookings; book/cancel a class (capacity respected, no double-booking).
4. Admin: list/search/paginate members; CRUD for classes (name, trainer, date/time, capacity); see bookings per class.
5. Flash messages for success/errors; server-side validation on every form.
6. Consistent, clean layout with navigation, responsive.

## Security (OWASP)
- Passwords hashed (bcrypt/argon2)
- SQL injection safe (parameterized/ORM)
- XSS safe (escaped output)
- CSRF tokens on all POST forms
- Session cookie httpOnly + sameSite; regenerate session on login
- Authorization checks on every action (no IDOR: member A cannot edit member B)
- Login rate limiting and generic error message
