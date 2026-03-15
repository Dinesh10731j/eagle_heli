# Eagle Heli API Documentation

Base URL:
`/api/v1/eagle-heli`

Health
- `GET /health`

Auth
- `POST /auth/signup`
- `POST /auth/signin`
- `POST /logout`
- `GET /auth/me`
- `GET /auth/users` (admin/sudo)

Bookings
- `POST /flight-booking/create`
- `GET /flight-booking/get-all`
- `GET /flight-booking/:id`
- `PUT /flight-booking/update/:id`
- `DELETE /flight-booking/delete/:id`

Flight Schedule
- `POST /flight-schedule/create`
- `GET /flight-schedule/get-all`
- `GET /flight-schedule/:id`
- `PUT /flight-schedule/update/:id`
- `DELETE /flight-schedule/delete/:id`

Gallery
- `POST /gallery/create` (multipart, `image` file)
- `GET /gallery/get-all`
- `GET /gallery/:id`
- `PUT /gallery/update/:id` (multipart optional image)
- `DELETE /gallery/delete/:id`

Team
- `POST /team/create` (multipart, `profileImage` file)
- `GET /team/get-all`
- `GET /team/:id`
- `PUT /team/update/:id` (multipart optional image)
- `DELETE /team/delete/:id`

Contact / 
- `POST /contact/create`
- `GET /contact/get-all`
- `GET /contact/:id`
- `PUT /contact/update/:id`
- `DELETE /contact/delete/:id`

Inquiry /

- `POST /inquiry/create`
- `GET /inquiry/get-all`
- `GET /inquiry/:id`
- `PUT /inquiry/update/:id`
- `DELETE /inquiry/delete/:id`


 Reply /

- `POST /reply/create`
- `GET /reply/get-all`
- `GET /reply/:id`
- `PUT /reply/update/:id`
- `DELETE /reply/delete/:id`

 Newsletter /

- `POST /news-letter/create`
- `GET /news-letter/get-all`
- `GET /news-letter/:id`
- `DELETE /news-letter/delete/:id`

SEO
- `POST /seo/create`
- `GET /seo/get-all`
- `GET /seo/:id`
- `PUT /seo/update/:id`
- `DELETE /seo/delete/:id`

SEO Meta
- `POST /seo-meta/create`
- `GET /seo-meta/get-all`
- `GET /seo-meta/:id`
- `PUT /seo-meta/update/:id`
- `DELETE /seo-meta/delete/:id`

Analytics
- `POST /analytics/create`
- `GET /analytics/get-all`
- `GET /analytics/:id`
- `PUT /analytics/update/:id`
- `DELETE /analytics/delete/:id`
