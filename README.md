# Ishingiro Shop Management System
**Project Architect:** UWASE Maida
**Confidentiality:** Internal Use Only - Ishingiro Shop

---

## 📌 Project Architecture
This system is designed to automate the end-to-end operations of Ishingiro Bakery. The frontend is built using Next.js 14 (App Router). The backend must be integrated into the `app/api/` directory to maintain architectural unity.

## 🛠 Mandatory Role-Based Access Control (RBAC)

The backend must enforce strict data permissions based on the following organizational roles:
hyurffb

### 1. Admin / Marketing Manager
- **Core Responsibilities:** System configuration, user management, and overall data integrity.
- **Access:** Full control over all accounts and the ability to create/reset passwords for all staff.

### 2. Chief of Finance
- **Revenue Management:** Record and track daily revenue/sales.
- **Reporting:** Generate financial reports (Daily, Weekly, Monthly, Annual).
- **Product Control:** Add new products and edit product pricing.
- **Analytics:** Access to financial diagrams and performance alerts (Profit/Loss, unusual expenses).
- **Production Oversight:** View baked products and measured ingredients.

### 3. Sales Coordinator
- **Operations:** Order creation, customer logging, and payment verification.

### 4. Store Keeper
- **Logistics:** Final product handover and order status updates (Ready/Collected).

### 5. Baker Assistant
- **Production:** Access to the daily baking queue and ingredient requirements.

## ⚙️ Technical Specifications

### 1. Integration Standard
- **Infrastructure:** Use **Next.js API Routes** for all server-side logic.
- **Database:** Relational schema (PostgreSQL) is required to handle the complex financial reporting needed by the Chief of Finance.
- **Logic:** Financial alerts and profit/loss calculations must be performed on the server.

### 2. Contributor Workflow
- **Pull Requests (PR):** All backend code must be submitted via PR for my review. I am the only one authorized to merge to `main`.
- **UI Integrity:** Do not modify components or styling in `/app` or `/components` without approval.
- **Security:** Ensure all database credentials and secret keys are stored in `.env.local`.

---
© 2026 Ishingiro Shop - Kigali, Rwanda.
