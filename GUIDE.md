# Guide - Module C

## Time plan
- 0:00-0:20 Read requirements, design schema, pick framework
- 0:20-0:50 DB schema + CSV import script
- 0:50-1:20 Auth: login, sessions, middleware, roles
- 1:20-2:20 Member pages, then admin pages
- 2:20-2:45 Security pass (CSRF, XSS, IDOR, rate limit)
- 2:45-3:00 Styling polish + manual testing

## Schema (normalized)
- users(id, name, email UNIQUE, phone, joined_at, password_hash, role)
- classes(id, name, trainer, starts_at, capacity)
- bookings(id, user_id, class_id, UNIQUE(user_id, class_id))
Import: dedupe by lower(trim(email)); normalize phone to +7XXXXXXXXXX; parse dates to YYYY-MM-DD; split "classes" on `;` and trim; set a default password and hash it.

## Node/Express stack suggestion
`express express-session ejs mysql2 bcryptjs csrf-csrf express-rate-limit helmet`
Layout: `views/partials/{header,footer}.ejs`, `routes/`, `middleware/{requireAuth,requireAdmin}.js`

## Security notes
- EJS `<%= %>` escapes; avoid `<%- %>` for user data.
- Use `req.session.userId` in queries for member actions, never an id from the form.
- Use helmet() and set cookie `{ httpOnly: true, sameSite: 'lax' }`.
- Same error for wrong email and wrong password.

## Checklist
- [ ] Unauthenticated access redirects to /login
- [ ] Member cannot open /admin/*
- [ ] Capacity and double-booking enforced
- [ ] CSV imported with no duplicates
- [ ] CSRF tokens in every form
- [ ] Looks consistent on mobile and desktop
