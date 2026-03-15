# Eagle Heli Backend Architecture

This backend powers the Eagle Heli platform. It includes authentication, bookings, schedules, content modules, uploads, SEO, analytics, and background jobs.

Pattern:
`route -> controller -> service -> entity/database`

Tech stack:
- Node.js, TypeScript, Express 5
- PostgreSQL + TypeORM
- class-validator + class-transformer
- JWT auth + bcrypt
- BullMQ + ioredis
- Nodemailer
- Multer + Cloudinary
- Jest + Supertest

Runtime flow:
1. `src/index.ts` loads env and initializes DB
2. `src/configs/app.ts` creates Express app + middleware
3. Routes mounted under `/api/v1/eagle-heli`
4. Background workers start (email, metadata)

Service standard:
Services return `{ status, data }` and controllers format the response and message.
