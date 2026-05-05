# 📊 DATABASE DOCUMENTATION - E-Commerce Platform

**Version**: 1.0  
**Last Updated**: 2026-05-05  
**Database**: shop_database  
**Engine**: MySQL 5.7+  
**Status**: Production Ready  

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Database Architecture](#database-architecture)
3. [Module 1: Logistics](#module-1-logistics--shipping)
4. [Module 2: Returns](#module-2-returns--refunds)
5. [Module 3: Inventory](#module-3-inventory-management)
6. [Module 4: Shopping](#module-4-shopping-cart--wishlist)
7. [Module 5: Notifications](#module-5-notifications--messages)
8. [Module 6: Pricing](#module-6-pricing--history)
9. [Module 7: Analytics](#module-7-analytics--reporting)
10. [Module 8: Audit](#module-8-audit--logs)
11. [Module 9: Settings](#module-9-settings--configuration)
12. [Module 11: Supplier](#module-11-supplier-management)
13. [Module 12: Warehouse](#module-12-warehouse-management)
14. [Module 13: Reviews](#module-13-product-reviews--ratings)
15. [Module 14: Loyalty](#module-14-customer-segments--loyalty)
16. [Module 15: Marketing](#module-15-marketing-campaigns)
17. [Module 16: Payment](#module-16-payment--transactions)
18. [Data Dictionary](#data-dictionary)
19. [Relationships & ERD](#relationships--erd)
20. [Indexes & Performance](#indexes--performance)
21. [Backup & Recovery](#backup--recovery)
22. [Best Practices](#best-practices)
23. [Troubleshooting](#troubleshooting)

---

## 🎯 OVERVIEW

### Purpose
Complete e-commerce database supporting:
- Multi-channel commerce
- Advanced inventory management
- Comprehensive logistics tracking
- Customer loyalty programs
- Marketing automation
- Payment processing
- Comprehensive analytics

### Scope
- **16 Modules** - Feature-complete system
- **52 New Tables** - Plus existing tables
- **400+ Fields** - Rich data model
- **50+ Foreign Keys** - Referential integrity
- **80+ Indexes** - Performance optimized

### Design Principles
1. **Normalization** - 3NF compliance
2. **Scalability** - Supports millions of records
3. **Flexibility** - JSON fields for extensibility
4. **Performance** - Strategic indexing
5. **Security** - Audit trails & encryption ready
6. **Integrity** - Constraints & validations

---

## 🏗️ DATABASE ARCHITECTURE

### Overall Structure
```
shop_database
├── CORE TABLES (10 original)
│   ├── shop_products
│   ├── shop_orders
│   ├── shop_customers
│   ├── shop_users
│   └── ... (6 more)
├── MODULE 1: Logistics (4 tables)
├── MODULE 2: Returns (4 tables)
├── MODULE 3: Inventory (3 tables)
├── MODULE 4: Shopping (4 tables)
├── MODULE 5: Notifications (3 tables)
├── MODULE 6: Pricing (2 tables)
├── MODULE 7: Analytics (3 tables)
├── MODULE 8: Audit (1 table)
├── MODULE 9: Settings (2 tables)
├── MODULE 11: Supplier (4 tables)
├── MODULE 12: Warehouse (5 tables)
├── MODULE 13: Reviews (4 tables)
├── MODULE 14: Loyalty (5 tables)
├── MODULE 15: Marketing (5 tables)
└── MODULE 16: Payment (4 tables)
```

### Key Statistics
```
Total Tables: 62 (10 + 52)
Total Fields: 400+
Total Indexes: 80+
Foreign Keys: 50+
Primary Keys: 62
Unique Constraints: 30+
Generated Columns: 15+
```

---

## MODULE 1: LOGISTICS & SHIPPING

### Purpose
Manage shipments, tracking, and delivery logistics with multiple carrier support.

### Tables

#### shop_shipping_providers
Shipping service providers (GHN, DHL, etc)

**Fields:**
```
id (INT, PK) - Unique identifier
provider_name (VARCHAR 100, UQ) - Provider name
provider_code (VARCHAR 50, UQ) - Unique code
api_endpoint (VARCHAR 255) - API URL for integration
api_key (VARCHAR 255) - Authentication key
is_active (TINYINT) - Active status flag
base_fee (DECIMAL 10,2) - Base shipping fee
created_at (TIMESTAMP) - Creation time
updated_at (TIMESTAMP) - Last update time
```

**Indexes:**
- PRIMARY KEY: id
- UNIQUE: provider_code
- INDEX: is_active

**Example Data:**
```sql
INSERT INTO shop_shipping_providers VALUES
(1, 'Giao Hàng Nhanh', 'GHN', 'https://api.ghn.vn/v1', 'abc123', 1, 15000, NOW(), NOW()),
(2, 'Được Giao', 'DG', 'https://api.dongiao.vn/v1', 'def456', 1, 20000, NOW(), NOW());
```

#### shop_shipping_methods
Shipping method options per provider

**Fields:**
```
id (INT, PK)
provider_id (INT, FK) → shop_shipping_providers
method_name (VARCHAR 100) - e.g., "Giao hàng tiêu chuẩn"
estimated_days (INT) - Estimated delivery days
fee_formula (VARCHAR 255) - Fee calculation formula
is_active (TINYINT)
created_at, updated_at
```

**Relationships:**
```
shop_shipping_methods.provider_id → shop_shipping_providers.id
```

#### shop_shipments
Individual shipment records

**Fields:**
```
id (INT, PK)
order_id (INT, FK) → shop_orders
shipping_method_id (INT, FK) → shop_shipping_methods
provider_id (INT, FK) → shop_shipping_providers
tracking_number (VARCHAR 100, UQ) - Carrier tracking #
sender_address (TEXT)
recipient_address (TEXT)
shipping_fee (DECIMAL 10,2)
weight (DECIMAL 10,2)
dimensions (JSON) - {length, width, height}
shipped_date (DATETIME)
expected_delivery_date (DATETIME)
actual_delivery_date (DATETIME)
status (ENUM) - pending|picked_up|in_transit|delivered|failed
created_at, updated_at
```

**Indexes:**
- PRIMARY KEY: id
- FOREIGN KEY: order_id, shipping_method_id, provider_id
- UNIQUE: tracking_number
- INDEX: status, shipped_date

**Status Workflow:**
```
pending → picked_up → in_transit → delivered
                                 ↘ failed
```

#### shop_shipment_tracking
Historical tracking events for each shipment

**Fields:**
```
id (BIGINT, PK)
shipment_id (INT, FK) → shop_shipments
status (VARCHAR 50) - Current status
location (VARCHAR 255) - Current location
description (TEXT) - Status description
timestamp (DATETIME) - When status changed
created_at (TIMESTAMP)
```

**Indexes:**
- FOREIGN KEY: shipment_id
- INDEX: timestamp (for sorting by date)

### Common Queries

**Get shipment with full tracking:**
```sql
SELECT 
  s.*, 
  st.tracking_history
FROM shop_shipments s
LEFT JOIN (
  SELECT shipment_id, JSON_ARRAYAGG(
    JSON_OBJECT('status', status, 'location', location, 'timestamp', timestamp)
  ) as tracking_history
  FROM shop_shipment_tracking
  GROUP BY shipment_id
) st ON s.id = st.shipment_id
WHERE s.id = ?;
```

**Get shipments by status:**
```sql
SELECT * FROM shop_shipments 
WHERE status = 'in_transit' 
AND shipped_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY shipped_date DESC;
```

---

## MODULE 2: RETURNS & REFUNDS

### Purpose
Manage product returns, refund processing, and RMA lifecycle.

### Tables

#### shop_return_reasons
Standardized return reason codes

**Fields:**
```
id (INT, PK)
reason_name (VARCHAR 100, UQ)
description (TEXT)
is_active (TINYINT)
created_at (TIMESTAMP)
```

**Common Reasons:**
- Sản phẩm bị lỗi (Defective)
- Không đúng mô tả (Not as described)
- Không đúng đơn hàng (Wrong item)
- Thay đổi quyết định (Changed mind)
- Hết hạn sử dụng (Expired)

#### shop_return_requests
Return request master records

**Fields:**
```
id (INT, PK)
order_id (INT, FK) → shop_orders
customer_id (INT, FK) → shop_customers
return_reason_id (INT, FK) → shop_return_reasons
notes (TEXT)
status (ENUM) - pending|approved|rejected|received|refunded
requested_date (DATETIME)
approved_date (DATETIME)
estimated_return_date (DATETIME)
received_date (DATETIME)
refunded_date (DATETIME)
created_at, updated_at
```

**Status Timeline:**
```
pending (customer creates)
  ↓
approved (admin reviews)
  ↓
received (items received back)
  ↓
refunded (payment processed)

OR

rejected (admin declines)
```

#### shop_return_items
Individual items in return request

**Fields:**
```
id (INT, PK)
return_request_id (INT, FK) → shop_return_requests
order_item_id (INT, FK) → shop_order_details
product_id (INT, FK) → shop_products
quantity (INT)
condition (ENUM) - new|used|damaged
refund_amount (DECIMAL 10,2)
created_at (TIMESTAMP)
```

#### shop_refunds
Payment refund records

**Fields:**
```
id (INT, PK)
return_request_id (INT, FK) → shop_return_requests
order_id (INT, FK) → shop_orders
refund_amount (DECIMAL 10,2)
refund_method (ENUM) - original_payment|store_credit|bank_transfer
transaction_id (VARCHAR 100)
status (ENUM) - pending|processing|completed|failed
refund_date (DATETIME)
notes (TEXT)
created_at, updated_at
```

---

## MODULE 3: INVENTORY MANAGEMENT

### Purpose
Real-time inventory tracking, stock movements, and low-stock alerts.

### Tables

#### shop_inventory_stocks
Stock levels by product and location

**Fields:**
```
id (INT, PK)
product_id (INT, FK) → shop_products
store_id (INT, FK) → shop_stores
current_stock (INT) - Total quantity
reserved_stock (INT) - Reserved for orders
available_stock (INT, GENERATED) - current - reserved
min_stock_level (INT) - Minimum threshold
reorder_point (INT) - Trigger for reorder
reorder_quantity (INT) - Quantity to order
last_stock_check (DATETIME)
updated_at (TIMESTAMP)
```

**Key Insights:**
- `available_stock` is calculated, not stored
- Composite unique key: (product_id, store_id)
- Updated on every order/return/adjustment

**Indexes:**
- UNIQUE: (product_id, store_id)
- INDEX: current_stock (find low stock)
- INDEX: available_stock (for reservations)

#### shop_inventory_movements
Audit trail of all stock changes

**Fields:**
```
id (BIGINT, PK)
product_id (INT, FK) → shop_products
store_id (INT, FK) → shop_stores
movement_type (ENUM) - import|export|sale|return|adjustment|damage
quantity (INT) - Positive or negative
reference_id (INT) - Order ID, Import ID, etc
reference_type (VARCHAR 50) - order, import, return
notes (TEXT)
created_by (INT, FK) → shop_users
created_at (TIMESTAMP)
```

**Movement Types:**
| Type | Quantity | When | Example |
|------|----------|------|---------|
| import | +100 | Stock received | Receiving PO |
| export | -50 | Stock shipped | Warehouse transfer |
| sale | -10 | Order fulfilled | Order shipment |
| return | +5 | Item returned | Customer return |
| adjustment | ±20 | Manual correction | Inventory count |
| damage | -3 | Damaged goods | Quality issue |

**Indexes:**
- FOREIGN KEYS: product_id, store_id
- INDEX: movement_type, created_at
- COMPOSITE: (product_id, store_id, created_at)

#### shop_stock_alerts
Low stock and other alerts

**Fields:**
```
id (INT, PK)
product_id (INT, FK) → shop_products
store_id (INT, FK) → shop_stores
alert_type (ENUM) - low_stock|overstock|expiring_soon
current_stock (INT)
threshold (INT)
is_resolved (TINYINT)
resolved_at (DATETIME)
created_at, updated_at
```

**Indexes:**
- INDEX: alert_type
- INDEX: is_resolved

### Inventory Queries

**Get product availability across all stores:**
```sql
SELECT 
  p.id, p.name,
  SUM(i.current_stock) as total_stock,
  SUM(i.available_stock) as total_available,
  GROUP_CONCAT(CONCAT(s.name, ':', i.available_stock)) as by_store
FROM shop_inventory_stocks i
JOIN shop_products p ON i.product_id = p.id
JOIN shop_stores s ON i.store_id = s.id
WHERE p.id = ?
GROUP BY p.id;
```

**Check low stock items:**
```sql
SELECT i.*, p.name
FROM shop_inventory_stocks i
JOIN shop_products p ON i.product_id = p.id
WHERE i.available_stock < i.min_stock_level
ORDER BY i.available_stock ASC;
```

---

## MODULE 4: SHOPPING CART & WISHLIST

### Purpose
Persistent shopping cart, wishlist management, and saved items.

### Tables

#### shop_carts
Shopping cart records

**Fields:**
```
id (INT, PK)
customer_id (INT, FK, nullable) → shop_customers
session_id (VARCHAR 100, nullable) - For anonymous users
status (ENUM) - active|abandoned|converted
total_items (INT)
total_amount (DECIMAL 12,2)
abandoned_at (DATETIME)
created_at, updated_at
```

**Logic:**
- Authenticated users: customer_id is set
- Anonymous users: session_id is set
- Cart status changes to 'converted' when ordered
- Abandoned carts for recovery campaigns

#### shop_cart_items
Individual items in cart

**Fields:**
```
id (INT, PK)
cart_id (INT, FK) → shop_carts
product_id (INT, FK) → shop_products
quantity (INT)
unit_price (DECIMAL 10,2)
subtotal (DECIMAL 12,2, GENERATED) - quantity * unit_price
added_at (DATETIME)
```

**Indexes:**
- UNIQUE: (cart_id, product_id)
- INDEX: product_id

**Example:**
```sql
SELECT 
  c.id as cart_id,
  ci.product_id,
  p.name,
  ci.quantity,
  ci.unit_price,
  ci.subtotal,
  SUM(ci.subtotal) OVER (PARTITION BY c.id) as cart_total
FROM shop_carts c
JOIN shop_cart_items ci ON c.id = ci.cart_id
JOIN shop_products p ON ci.product_id = p.id
WHERE c.id = ?;
```

#### shop_wishlists
Wishlist collections

**Fields:**
```
id (INT, PK)
customer_id (INT, FK) → shop_customers
wishlist_name (VARCHAR 100)
is_public (TINYINT)
visibility_link (VARCHAR 100)
created_at, updated_at
```

**Use Cases:**
- Birthday wishlist
- Gift registry
- Seasonal wishes

#### shop_wishlist_items
Items in wishlists

**Fields:**
```
id (INT, PK)
wishlist_id (INT, FK) → shop_wishlists
product_id (INT, FK) → shop_products
priority (INT) - 1 = highest priority
added_at (DATETIME)
```

---

## MODULE 5: NOTIFICATIONS & MESSAGES

### Purpose
Notification delivery system and email template management.

### Tables

#### shop_notifications
In-app notifications

**Fields:**
```
id (BIGINT, PK)
user_id (INT, FK) → shop_users
type (ENUM) - order|shipment|review|promotion|system
title (VARCHAR 255)
message (TEXT)
related_id (INT) - Link to resource
is_read (TINYINT)
read_at (DATETIME)
created_at (TIMESTAMP)
```

**Notification Types:**
| Type | Trigger | Example |
|------|---------|---------|
| order | Order status change | "Your order #100 is confirmed" |
| shipment | Shipment update | "Your package is on the way" |
| review | Review request | "Please rate your purchase" |
| promotion | Campaign | "Spring sale is live!" |
| system | System event | "Maintenance scheduled" |

#### shop_email_templates
Email template definitions

**Fields:**
```
id (INT, PK)
template_name (VARCHAR 100, UQ)
subject (VARCHAR 255)
body (LONGTEXT) - HTML template
variables (JSON) - {{variable}} mappings
is_active (TINYINT)
created_at, updated_at
```

**Template Examples:**
- order_confirmation
- shipment_tracking
- delivery_confirmation
- return_request_approved
- refund_processed
- review_request
- abandoned_cart
- promotion

**Body Example:**
```html
<h2>Order Confirmation</h2>
<p>Hello {{customer_name}},</p>
<p>Your order #{{order_id}} has been confirmed.</p>
<p>Total: {{total_amount}} {{currency}}</p>
```

#### shop_email_logs
Email delivery tracking

**Fields:**
```
id (BIGINT, PK)
customer_id (INT, FK, nullable) → shop_customers
template_id (INT, FK) → shop_email_templates
recipient_email (VARCHAR 255)
subject (VARCHAR 255)
status (ENUM) - pending|sent|bounced|failed
sent_at (DATETIME)
error_message (TEXT)
created_at (TIMESTAMP)
```

**Indexes:**
- INDEX: customer_id
- INDEX: status
- INDEX: created_at (for reporting)

---

## MODULE 6: PRICING & HISTORY

### Purpose
Manage product pricing, discounts, and maintain price history.

### Tables

#### shop_product_price_history
Price change audit trail

**Fields:**
```
id (INT, PK)
product_id (INT, FK) → shop_products
old_price (DECIMAL 10,2)
new_price (DECIMAL 10,2)
discount_price (DECIMAL 10,2)
reason (VARCHAR 255) - Flash Sale, Cost Change, etc
effective_date (DATETIME)
end_date (DATETIME)
changed_by (INT, FK) → shop_users
created_at (TIMESTAMP)
```

**Reasons:**
- Promotional Campaign
- Cost Adjustment
- Competitive Pricing
- Inventory Clearance
- Seasonal
- Admin Manual Change

**Indexes:**
- INDEX: product_id
- INDEX: effective_date

#### shop_bulk_pricing
Volume pricing tiers

**Fields:**
```
id (INT, PK)
product_id (INT, FK) → shop_products
min_quantity (INT)
max_quantity (INT, nullable) - NULL = unlimited
unit_price (DECIMAL 10,2)
is_active (TINYINT)
created_at, updated_at
```

**Example:**
```
Product 1:
- 1-4 units: 250,000 VND
- 5-10 units: 240,000 VND (200k)
- 11+ units: 230,000 VND (200k)
```

---

## MODULE 7: ANALYTICS & REPORTING

### Purpose
Aggregate business metrics and reporting tables.

### Tables

#### shop_order_analytics
Daily order metrics

**Fields:**
```
id (INT, PK)
date (DATE, UQ)
total_orders (INT)
total_revenue (DECIMAL 12,2)
average_order_value (DECIMAL 10,2)
unique_customers (INT)
new_customers (INT)
created_at (TIMESTAMP)
```

**Index:**
- UNIQUE: date

**Use Case:**
```sql
SELECT 
  DATE_FORMAT(date, '%Y-%m') as month,
  SUM(total_revenue) as monthly_revenue,
  AVG(average_order_value) as avg_order_value
FROM shop_order_analytics
WHERE date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(date, '%Y-%m')
ORDER BY month DESC;
```

#### shop_product_analytics
Daily product metrics

**Fields:**
```
id (BIGINT, PK)
product_id (INT, FK) → shop_products
date (DATE)
views (INT)
add_to_cart_count (INT)
purchase_count (INT)
revenue (DECIMAL 12,2)
conversion_rate (DECIMAL 5,2)
created_at (TIMESTAMP)
```

**UNIQUE KEY:** (product_id, date)

**Conversion Rate:** `(purchase_count / views) * 100`

#### shop_customer_analytics
Daily customer metrics

**Fields:**
```
id (BIGINT, PK)
customer_id (INT, FK) → shop_customers
date (DATE)
purchase_count (INT)
total_spent (DECIMAL 12,2)
average_order_value (DECIMAL 10,2)
last_purchase_date (DATE)
days_since_last_purchase (INT)
created_at (TIMESTAMP)
```

---

## MODULE 8: AUDIT & LOGS

### Purpose
Complete audit trail of all data changes for compliance and security.

### Tables

#### shop_audit_logs
Complete audit trail

**Fields:**
```
id (BIGINT, PK)
user_id (INT, FK, nullable) → shop_users
action (VARCHAR 100) - create, update, delete, export
entity_type (VARCHAR 100) - product, order, customer
entity_id (INT)
old_values (JSON) - Previous values
new_values (JSON) - New values
ip_address (VARCHAR 45)
user_agent (TEXT)
created_at (TIMESTAMP)
```

**Indexes:**
- INDEX: user_id
- INDEX: action
- COMPOSITE: (entity_type, entity_id, created_at)

**Example Query:**
```sql
SELECT * FROM shop_audit_logs
WHERE entity_type = 'product'
AND entity_id = 1
AND action IN ('update', 'delete')
ORDER BY created_at DESC
LIMIT 100;
```

---

## MODULE 9: SETTINGS & CONFIGURATION

### Purpose
System-wide configuration and tax settings.

### Tables

#### shop_system_settings
Key-value configuration

**Fields:**
```
id (INT, PK)
setting_key (VARCHAR 100, UQ)
setting_value (LONGTEXT)
data_type (ENUM) - string|number|boolean|json
description (TEXT)
updated_by (INT, FK) → shop_users
updated_at (TIMESTAMP)
```

**Common Settings:**
| Key | Type | Example |
|-----|------|---------|
| company_name | string | "E-Commerce Inc" |
| tax_rate | number | 10 |
| currency | string | "VND" |
| enable_promotions | boolean | true |
| max_upload_size | number | 5242880 |
| payment_methods | json | ["CC", "BANK"] |

#### shop_tax_settings
Tax rates by region

**Fields:**
```
id (INT, PK)
region (VARCHAR 100, UQ)
tax_rate (DECIMAL 5,2)
tax_name (VARCHAR 100)
is_active (TINYINT)
created_at, updated_at
```

---

## MODULE 11: SUPPLIER MANAGEMENT

### Purpose
Supplier database, product sourcing, and performance tracking.

### Tables

#### shop_suppliers (Expanded)
Additional supplier fields

**Fields:**
```
(Original fields plus)
contact_person (VARCHAR 100)
email (VARCHAR 100)
phone (VARCHAR 20)
address (TEXT)
city (VARCHAR 100)
country (VARCHAR 100)
tax_id (VARCHAR 50)
payment_terms (VARCHAR 50) - Net 30, Net 60, etc
lead_time_days (INT)
min_order_quantity (INT)
rating (DECIMAL 3,2) - 0-5 stars
```

#### shop_supplier_products
Supplier product catalog

**Fields:**
```
id (INT, PK)
supplier_id (INT, FK) → shop_suppliers
product_id (INT, FK) → shop_products
supplier_product_code (VARCHAR 100)
supplier_price (DECIMAL 10,2)
moq (INT) - Minimum Order Quantity
lead_time (INT) - Days to deliver
availability (VARCHAR 50)
created_at, updated_at
```

#### shop_supplier_performance
Supplier scorecard

**Fields:**
```
id (INT, PK)
supplier_id (INT, FK) → shop_suppliers
date (DATE)
total_orders (INT)
on_time_delivery_rate (DECIMAL 5,2)
quality_score (DECIMAL 5,2)
price_competitiveness (DECIMAL 5,2)
overall_score (DECIMAL 5,2, GENERATED)
created_at (TIMESTAMP)
```

#### shop_supplier_payments
Payment records

**Fields:**
```
id (INT, PK)
supplier_id (INT, FK) → shop_suppliers
payment_amount (DECIMAL 12,2)
payment_method (ENUM) - bank_transfer|check|credit
payment_date (DATETIME)
due_date (DATETIME)
status (ENUM) - pending|paid|overdue
reference_number (VARCHAR 100)
created_at, updated_at
```

---

## MODULE 12: WAREHOUSE MANAGEMENT

### Purpose
Multi-warehouse, multi-zone inventory management.

### Tables

#### shop_warehouses (Expanded)
Warehouse locations with capacity

**Fields:**
```
(Original fields plus)
warehouse_code (VARCHAR 50)
capacity (INT)
manager_id (INT, FK) → shop_users
```

#### shop_warehouse_zones
Warehouse zones (A, B, C sections)

**Fields:**
```
id (INT, PK)
warehouse_id (INT, FK) → shop_warehouses
zone_name (VARCHAR 50)
zone_code (VARCHAR 50, UQ)
rack_count (INT)
shelf_count (INT)
capacity (INT)
current_usage (INT)
created_at, updated_at
```

#### shop_warehouse_racks
Storage racks within zones

**Fields:**
```
id (INT, PK)
zone_id (INT, FK) → shop_warehouse_zones
rack_number (VARCHAR 50)
rack_code (VARCHAR 50, UQ)
shelf_count (INT)
capacity (INT)
current_load (INT)
status (ENUM) - active|maintenance|full
created_at, updated_at
```

#### shop_warehouse_locations
Product locations in racks

**Fields:**
```
id (INT, PK)
rack_id (INT, FK) → shop_warehouse_racks
shelf_number (INT)
product_id (INT, FK) → shop_products
quantity (INT)
last_updated (DATETIME)
```

#### shop_warehouse_transfers
Inter-warehouse transfers

**Fields:**
```
id (INT, PK)
from_warehouse_id (INT, FK) → shop_warehouses
to_warehouse_id (INT, FK) → shop_warehouses
product_id (INT, FK) → shop_products
quantity (INT)
transfer_date (DATETIME)
arrival_date (DATETIME)
status (ENUM) - pending|in_transit|received
created_at, updated_at
```

---

## MODULE 13: PRODUCT REVIEWS & RATINGS

### Purpose
Customer reviews, ratings, and seller responses.

### Tables

#### shop_product_reviews (Expanded)
Customer reviews with verified purchase

**Fields:**
```
(Original plus)
order_id (INT, FK) → shop_orders
title (VARCHAR 255)
helpful_count (INT)
unhelpful_count (INT)
verified_purchase (TINYINT)
```

#### shop_review_images
Review images

**Fields:**
```
id (INT, PK)
review_id (INT, FK) → shop_product_reviews
image_url (VARCHAR 255)
display_order (INT)
created_at (TIMESTAMP)
```

#### shop_review_responses
Seller responses to reviews

**Fields:**
```
id (INT, PK)
review_id (INT, FK) → shop_product_reviews
responder_id (INT, FK) → shop_users
response_text (TEXT)
response_date (DATETIME)
created_at, updated_at
```

#### shop_product_rating_summary
Aggregated rating data

**Fields:**
```
id (INT, PK)
product_id (INT, FK, UQ) → shop_products
average_rating (DECIMAL 3,2)
total_reviews (INT)
rating_5_count (INT)
rating_4_count (INT)
rating_3_count (INT)
rating_2_count (INT)
rating_1_count (INT)
updated_at (TIMESTAMP)
```

---

## MODULE 14: CUSTOMER SEGMENTS & LOYALTY

### Purpose
Customer segmentation and loyalty program management.

### Tables

#### shop_customer_segments
Segment definitions

**Fields:**
```
id (INT, PK)
segment_name (VARCHAR 100)
segment_code (VARCHAR 50, UQ)
criteria_json (JSON)
priority (INT)
is_active (TINYINT)
created_at, updated_at
```

**Example Segments:**
- VIP (spend > 10M)
- Premium (spend > 5M)
- Regular (active customers)
- At-Risk (inactive 90+ days)
- New (< 30 days)

#### shop_loyalty_programs
Program definitions

**Fields:**
```
id (INT, PK)
program_name (VARCHAR 100)
program_code (VARCHAR 50, UQ)
tier_count (INT)
is_active (TINYINT)
created_at, updated_at
```

#### shop_loyalty_tiers
Program tiers

**Fields:**
```
id (INT, PK)
program_id (INT, FK) → shop_loyalty_programs
tier_name (VARCHAR 100)
tier_level (INT)
min_points (INT)
max_points (INT)
benefits_json (JSON)
created_at, updated_at
```

**Tier Example:**
```json
{
  "tier_name": "Silver",
  "discount_percentage": 10,
  "points_multiplier": 1.5,
  "free_shipping_threshold": 500000
}
```

#### shop_customer_loyalty_accounts
Customer loyalty accounts

**Fields:**
```
id (INT, PK)
customer_id (INT, FK, UQ) → shop_customers
program_id (INT, FK) → shop_loyalty_programs
current_tier_id (INT, FK) → shop_loyalty_tiers
total_points (INT)
used_points (INT)
available_points (INT, GENERATED)
last_transaction_date (DATETIME)
created_at, updated_at
```

#### shop_loyalty_transactions
Point transactions

**Fields:**
```
id (BIGINT, PK)
customer_id (INT, FK) → shop_customers
program_id (INT, FK) → shop_loyalty_programs
transaction_type (ENUM) - earn|redeem|expire|adjustment
points_change (INT)
reason (VARCHAR 255)
reference_id (INT)
created_at (TIMESTAMP)
```

---

## MODULE 15: MARKETING CAMPAIGNS

### Purpose
Campaign management, coupons, and performance tracking.

### Tables

#### shop_campaigns
Campaign definitions

**Fields:**
```
id (INT, PK)
campaign_name (VARCHAR 255)
campaign_code (VARCHAR 100, UQ)
campaign_type (ENUM) - email|sms|push|seasonal
status (ENUM) - draft|scheduled|active|paused|ended
target_segment_id (INT, FK) → shop_customer_segments
start_date (DATETIME)
end_date (DATETIME)
budget (DECIMAL 12,2)
expected_roi (DECIMAL 5,2)
created_at, updated_at
```

#### shop_campaign_emails
Email campaign details

**Fields:**
```
id (INT, PK)
campaign_id (INT, FK) → shop_campaigns
email_template_id (INT, FK) → shop_email_templates
scheduled_send_time (DATETIME)
sent_count (INT)
open_count (INT)
click_count (INT)
status (ENUM) - draft|scheduled|sent
created_at, updated_at
```

#### shop_coupons
Coupon definitions

**Fields:**
```
id (INT, PK)
coupon_code (VARCHAR 100, UQ)
campaign_id (INT, FK) → shop_campaigns
discount_type (ENUM) - percentage|fixed_amount
discount_value (DECIMAL 10,2)
max_discount_amount (DECIMAL 10,2)
min_purchase_amount (DECIMAL 10,2)
max_usage_count (INT)
current_usage_count (INT)
validity_start (DATETIME)
validity_end (DATETIME)
applicable_products_json (JSON)
is_active (TINYINT)
created_at, updated_at
```

#### shop_coupon_redemptions
Coupon usage records

**Fields:**
```
id (BIGINT, PK)
coupon_id (INT, FK) → shop_coupons
order_id (INT, FK) → shop_orders
customer_id (INT, FK) → shop_customers
discount_amount (DECIMAL 10,2)
redemption_date (DATETIME)
```

#### shop_campaign_performance
Daily campaign metrics

**Fields:**
```
id (INT, PK)
campaign_id (INT, FK) → shop_campaigns
date (DATE)
impressions (INT)
clicks (INT)
conversions (INT)
revenue (DECIMAL 12,2)
cost (DECIMAL 10,2)
roi (DECIMAL 5,2, GENERATED)
created_at (TIMESTAMP)
```

---

## MODULE 16: PAYMENT & TRANSACTIONS

### Purpose
Payment processing, reconciliation, and dispute management.

### Tables

#### shop_payment_methods
Payment method configuration

**Fields:**
```
id (INT, PK)
method_code (VARCHAR 50, UQ)
method_name (VARCHAR 100)
provider (VARCHAR 100) - Stripe, PayPal, Local Bank
provider_account_id (VARCHAR 100)
api_key_encrypted (VARCHAR 255)
is_active (TINYINT)
created_at, updated_at
```

#### shop_transactions
Payment transactions

**Fields:**
```
id (BIGINT, PK)
order_id (INT, FK) → shop_orders
customer_id (INT, FK) → shop_customers
payment_method_id (INT, FK) → shop_payment_methods
transaction_amount (DECIMAL 12,2)
currency (VARCHAR 3)
transaction_type (ENUM) - payment|refund|reversal
status (ENUM) - pending|processing|success|failed|cancelled
provider_transaction_id (VARCHAR 100)
reference_number (VARCHAR 100)
authorization_code (VARCHAR 100)
response_code (VARCHAR 50)
error_message (TEXT)
transaction_date (DATETIME)
created_at, updated_at
```

**Indexes:**
- INDEX: order_id
- INDEX: status
- INDEX: transaction_date

#### shop_payment_reconciliation
Daily reconciliation records

**Fields:**
```
id (INT, PK)
payment_batch_date (DATE)
payment_method_id (INT, FK) → shop_payment_methods
expected_amount (DECIMAL 12,2)
received_amount (DECIMAL 12,2)
discrepancy (DECIMAL 12,2, GENERATED)
reconciliation_status (ENUM) - pending|matched|under_review
reconciled_by (INT, FK) → shop_users
reconciliation_date (DATETIME)
created_at, updated_at
```

**UNIQUE KEY:** (payment_batch_date, payment_method_id)

#### shop_transaction_disputes
Payment disputes

**Fields:**
```
id (INT, PK)
transaction_id (BIGINT, FK) → shop_transactions
dispute_reason (VARCHAR 255)
dispute_amount (DECIMAL 12,2)
status (ENUM) - open|under_investigation|resolved|closed
filed_date (DATETIME)
resolved_date (DATETIME)
resolution_notes (TEXT)
created_at, updated_at
```

---

## 📊 DATA DICTIONARY

### Common Data Types

| Type | Size | Use Case | Example |
|------|------|----------|---------|
| INT | 4 bytes | IDs, counts | 12345 |
| BIGINT | 8 bytes | Large IDs, counters | 9223372036854775807 |
| VARCHAR(n) | Variable | Text fields | "John Doe" |
| TEXT | 65KB | Long text | Product description |
| LONGTEXT | 4GB | Very long content | Email body HTML |
| DECIMAL(10,2) | Exact | Monetary values | 1234567.89 |
| DATETIME | 8 bytes | Date + time | 2026-05-05 10:30:00 |
| DATE | 3 bytes | Date only | 2026-05-05 |
| TIMESTAMP | 4 bytes | Auto-update | Current timestamp |
| TINYINT | 1 byte | Boolean | 0 or 1 |
| JSON | Variable | Structured data | {"key": "value"} |
| ENUM | 1-2 bytes | Predefined options | 'active', 'inactive' |

### Naming Conventions

- **Tables**: `shop_` prefix, snake_case
- **Columns**: snake_case
- **Primary Keys**: `id`
- **Foreign Keys**: `{entity}_id`
- **Boolean**: `is_*` or `has_*`
- **Timestamps**: `*_at` or `*_date`
- **Unique Keys**: `uk_*`
- **Indexes**: `idx_*`

---

## 🔗 RELATIONSHIPS & ERD

### Entity Relationship Types

#### One-to-Many
- shop_customers → shop_orders (1 customer : many orders)
- shop_products → shop_reviews (1 product : many reviews)
- shop_carts → shop_cart_items (1 cart : many items)

#### Many-to-Many
- shop_products ↔ shop_categories (via junction table)
- shop_customers ↔ shop_loyalty_programs (via accounts table)

#### Self-Referencing
- shop_users → shop_audit_logs (users perform actions)

### Core Relationships

```
shop_customers
├── shop_orders → shop_shipments
├── shop_carts → shop_cart_items
├── shop_wishlists → shop_wishlist_items
├── shop_customer_loyalty_accounts → shop_loyalty_programs
├── shop_loyalty_transactions
├── shop_reviews
└── shop_coupon_redemptions

shop_products
├── shop_inventory_stocks
├── shop_product_analytics
├── shop_product_price_history
├── shop_bulk_pricing
├── shop_supplier_products
├── shop_reviews
├── shop_product_rating_summary
└── shop_warehouse_locations

shop_orders
├── shop_shipments
├── shop_order_details → shop_products
├── shop_return_requests
└── shop_transactions
```

---

## ⚡ INDEXES & PERFORMANCE

### Critical Indexes

**Foreign Key Indexes** (Automatically created)
```sql
-- All FK relationships indexed for fast joins
shop_orders.customer_id
shop_shipments.order_id
shop_carts.customer_id
```

**Search Indexes** (For common queries)
```sql
-- Status searches
CREATE INDEX idx_shipment_status ON shop_shipments(status);
CREATE INDEX idx_order_status ON shop_orders(status);

-- Date range queries
CREATE INDEX idx_shipment_date ON shop_shipments(shipped_date);
CREATE INDEX idx_created_at ON shop_audit_logs(created_at);

-- Composite indexes for common filters
CREATE INDEX idx_inventory ON shop_inventory_stocks(product_id, store_id);
CREATE INDEX idx_movement ON shop_inventory_movements(product_id, store_id, created_at);
```

### Performance Optimization Tips

1. **Use Pagination** - Never retrieve unlimited rows
```sql
SELECT * FROM shop_orders LIMIT 20 OFFSET 0;
```

2. **Index Before Filtering**
```sql
SELECT * FROM shop_shipments WHERE status = 'in_transit' AND shipped_date > ?
-- Uses: idx_shipment_status, idx_shipment_date
```

3. **Avoid SELECT ***
```sql
SELECT id, order_id, tracking_number FROM shop_shipments WHERE id = ?
```

4. **Use Aggregation Properly**
```sql
SELECT COUNT(*) FROM shop_orders WHERE created_at >= DATE(NOW())
```

---

## 💾 BACKUP & RECOVERY

### Backup Strategy

#### Full Backup (Daily)
```bash
mysqldump --single-transaction --quick --lock-tables=false \
  shop_database > backup_$(date +%Y%m%d).sql
```

#### Incremental Backup (Hourly)
```bash
mysqlbinlog --start-position={position} /var/log/mysql/mysql-bin.000001 > increment.sql
```

#### Recovery from Full Backup
```bash
mysql shop_database < backup_20260505.sql
```

### Backup Schedule
| Type | Frequency | Retention |
|------|-----------|-----------|
| Full | Daily (midnight) | 30 days |
| Incremental | Hourly | 7 days |
| Archive | Weekly | 1 year |

---

## ✅ BEST PRACTICES

### Data Integrity
1. **Always use transactions** for multi-step operations
```sql
START TRANSACTION;
-- Multiple operations
COMMIT;
```

2. **Foreign key constraints** enabled
```sql
SET FOREIGN_KEY_CHECKS=1;
```

3. **Validate before insert**
```sql
-- Check stock availability before reducing inventory
SELECT available_stock FROM shop_inventory_stocks WHERE product_id = ? FOR UPDATE;
```

### Query Performance
1. **Analyze before deploying**
```sql
EXPLAIN SELECT * FROM shop_orders WHERE customer_id = 5;
```

2. **Use LIMIT** to reduce dataset
```sql
SELECT * FROM shop_orders WHERE status = 'pending' LIMIT 100;
```

3. **Index hot paths**
```sql
CREATE INDEX idx_customer_orders ON shop_orders(customer_id, created_at);
```

### Security
1. **Use parameterized queries** (prevent SQL injection)
2. **Encrypt sensitive data** (API keys, passwords)
3. **Audit all changes** via shop_audit_logs
4. **Limit user permissions** (principle of least privilege)

---

## 🔧 TROUBLESHOOTING

### Common Issues

#### High Memory Usage
```sql
-- Check table sizes
SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'shop_database'
ORDER BY (data_length + index_length) DESC;

-- Archive old data
DELETE FROM shop_audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

#### Slow Queries
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow-query.log';
SET GLOBAL long_query_time = 2;

-- Analyze slow query
EXPLAIN SELECT * FROM shop_shipments WHERE status = 'in_transit' AND shipped_date > ?;
```

#### Lock Contention
```sql
-- View current locks
SHOW PROCESSLIST;

-- View lock waits
SELECT * FROM performance_schema.table_io_waits_summary_by_table;
```

#### Foreign Key Constraint Errors
```sql
-- Check constraint definitions
SELECT * FROM information_schema.REFERENTIAL_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'shop_database';

-- Find orphaned records
SELECT * FROM shop_orders o
LEFT JOIN shop_customers c ON o.customer_id = c.id
WHERE c.id IS NULL;
```

---

## 📞 SUPPORT & RESOURCES

### Documentation Files
- API_SPEC.md - API endpoint documentation
- IMPLEMENTATION_GUIDE.md - Deployment guide
- FINAL_SUMMARY.md - Project overview

### Useful Queries

**Database Health Check**
```sql
SELECT 'Total Tables' as metric, COUNT(*) as value
FROM information_schema.tables WHERE table_schema = 'shop_database'
UNION ALL
SELECT 'Total Indexes', COUNT(*) FROM information_schema.STATISTICS
WHERE table_schema = 'shop_database'
UNION ALL
SELECT 'Database Size (MB)', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2)
FROM information_schema.tables WHERE table_schema = 'shop_database';
```

**Performance Baseline**
```sql
SELECT 
  DATABASE() as db,
  COUNT(*) as total_tables,
  SUM(table_rows) as total_rows,
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size_mb
FROM information_schema.tables
WHERE table_schema = 'shop_database';
```

---

**Last Updated**: 2026-05-05  
**Version**: 1.0  
**Status**: Production Ready ✅  
**Maintenance**: Ongoing