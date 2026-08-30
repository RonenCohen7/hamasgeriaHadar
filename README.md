# HAMASGERIA --- Hadar Pub Management

A full-stack pub management system for **Hadar Pub**, built to manage
events, ticket sales, QR-based entrance check-in, customers, VIP cards,
inventory, suppliers, and day-to-day pub operations from one
application.

## 🎟️ Ticketing & QR Check-In

The project includes an event ticketing flow with individual tickets
generated after successful payment.

-   Event ticket ordering through the website
-   One unique ticket and QR token per attendee
-   QR-based ticket lookup and entrance check-in
-   Prevention of duplicate check-ins
-   Ticket states: `valid`, `checked_in`, `cancelled`, `refunded`
-   Ticket source tracking: `website`, `phone`, `walk_in`, `other`
-   Customer and event information for entrance staff
-   Check-in audit with employee/user information
-   Expected vs. actual guest tracking

## ✨ Main Features

-   Event and customer management
-   Ticket sales and payment flow
-   QR ticket generation, validation, and check-in
-   VIP card support
-   Sales order management
-   Inventory, products, and categories
-   Supplier and supplier-order management
-   User authentication and roles
-   Hebrew / English internationalization
-   Chrome extension for event notifications
-   Dockerized development environment

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Vite, Axios, Redux, CSS\
**Backend:** Node.js, TypeScript, Express, REST API, QR code generation\
**Database:** MySQL 8, SQL migrations, relational foreign keys\
**Infrastructure:** Docker, Docker Compose, Adminer / MySQL Workbench,
Git & GitHub

## 🏗️ Project Structure

``` text
hamasgeriaHadar/
├── backend/        # Node.js / Express backend
├── database/       # MySQL schema and migrations
├── frontend/       # React + TypeScript application
├── extension/      # Hamasgeria Chrome extension
├── docs/           # Project documentation
└── .gitignore
```

## 🎫 Ticket Lifecycle

``` text
Customer selects event
        ↓
Sales order is created
        ↓
Payment succeeds
        ↓
Individual ticket(s) are generated
        ↓
Each ticket receives a unique QR token
        ↓
Entrance employee scans the ticket
        ↓
Ticket is validated
        ↓
Status changes: valid → checked_in
        ↓
Event actual_guests is incremented
```

A purchase containing multiple tickets creates multiple independent
ticket records, allowing guests from the same order to arrive and check
in separately.

## 🔐 Ticket Validation

QR codes use unique opaque tokens rather than exposing customer personal
information. The backend validates every ticket before entry. Tickets
that are already used, cancelled, or refunded cannot be checked in.

## 👥 User Roles

-   `admin`
-   `manager`
-   `employee`

Check-in activity can be associated with the user who performed the
entrance validation.

## 🗄️ Ticket Data Model

Important fields in the `tickets` table:

``` text
id_ticket
id_sale
id_event
id_customer
ticket_number
qr_token
ticket_status
ticket_source
checked_in_at
checked_in_by
created_at
updated_at
```

The existing `sales_orders` table remains the order entity; individual
attendee tickets are stored separately in `tickets`.

## 🚀 Running the Project

From the project root:

``` bash
docker compose up -d --build
```

Rebuild only the backend:

``` bash
docker compose up -d --build backend
```

Inspect backend logs:

``` bash
docker logs hadar-pub-backend --tail 30
```

Start the frontend development server:

``` bash
cd frontend
npm install
npm run dev
```

## 🧪 Ticket Scanner Tests

The current flow has been tested for:

-   Valid ticket lookup
-   Successful check-in
-   Duplicate check-in rejection
-   Invalid QR token rejection
-   Cancelled ticket rejection
-   Refunded ticket rejection
-   Employee/admin check-in audit
-   Incrementing `actual_guests` after successful entrance

## 🗺️ Roadmap

-   Camera-based QR scanning
-   Ticket confirmation emails with QR codes
-   Manager ticket and attendance reports
-   Customer purchase history
-   Loyalty and rewards
-   Free-ticket rewards after qualifying paid ticket purchases
-   Additional ticket administration tools

## 👨‍💻 Author

**Ronen Cohen**\
Full-Stack Developer
