# SQL Data & Queries Guide

This guide explains where data is stored and provides the exact queries to retrieve it.

## 1. Important Note on Data Locations
- **Business Data (MySQL)**: Users, Nurseries, Orders, and Feedback are stored in the `plantshop` MySQL database.
- **Plant Data (DatoCMS)**: The actual plant catalog (titles, prices, images, descriptions) is stored in **DatoCMS**, not in SQL. The backend identifies plants using their `plantSlug` or `id` from the CMS.

---

## 2. MySQL Queries for Displaying Data

If you are running queries manually in MySQL Workbench, use these exact commands:

### **A. Nursery Information (Nursery Panel)**
To see all registered nurseries and their stats:
```sql
-- Full query for all nursery data:
SELECT * FROM Nurseries;

-- Specific query for the dashboard stats (Copy the WHOLE line):
SELECT id, storeName, email, location, status, totalSales, rating FROM Nurseries;
```

### **B. Customer Feedback & Ratings**
To see reviews for a specific nursery (e.g., Nursery ID 1):
```sql
SELECT name, email, rating, message, nurseryId, orderId, createdAt
FROM Feedbacks
WHERE nurseryId = 1
ORDER BY createdAt DESC;
```

### **C. Orders & Sales**
To see incoming orders for a nursery:
```sql
SELECT id, customerName, totalAmount, status, items, createdAt
FROM Orders
WHERE nurseryId = 1
ORDER BY createdAt DESC;
```
*Note: The `items` column is stored as JSON and contains the plant details from DatoCMS.*

### **D. User & Customer Accounts**
To list all registered customers:
```sql
SELECT id, fullName, email, phoneNumber, createdAt FROM Users;
```

---

## 3. Troubleshooting "Unknown column 'id'"
If you get an `Error Code: 1054` for the `id` column, please check:
1.  **Missing FROM clause**: Ensure you include `FROM Nurseries` in your query.
2.  **Table Name**: The table name is usually pluralized (e.g., `Nurseries`, `Users`, `Orders`).
3.  **Use `SELECT *`**: If you are unsure of the column names, run `SELECT * FROM Nurseries;` first to see all available headers.
