# 🔌 API SPECIFICATION - Complete E-Commerce Platform

**Version**: 1.0  
**Last Updated**: 2026-05-05  
**Status**: Production Ready  
**Base URL**: `https://api.ecommerce.local/v1`

---

## 📋 TABLE OF CONTENTS

1. [Authentication](#authentication)
2. [Common Patterns](#common-patterns)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Module 1: Logistics](#module-1-logistics--shipping)
6. [Module 2: Returns](#module-2-returns--refunds)
7. [Module 3: Inventory](#module-3-inventory-management)
8. [Module 4: Shopping](#module-4-shopping-cart--wishlist)
9. [Module 5: Notifications](#module-5-notifications--messages)
10. [Module 6: Pricing](#module-6-pricing--history)
11. [Module 7: Analytics](#module-7-analytics--reporting)
12. [Module 8: Audit](#module-8-audit--logs)
13. [Module 9: Settings](#module-9-settings--configuration)
14. [Module 11: Supplier](#module-11-supplier-management)
15. [Module 12: Warehouse](#module-12-warehouse-management)
16. [Module 13: Reviews](#module-13-product-reviews--ratings)
17. [Module 14: Loyalty](#module-14-customer-segments--loyalty)
18. [Module 15: Marketing](#module-15-marketing-campaigns)
19. [Module 16: Payment](#module-16-payment--transactions)

---

## 🔐 AUTHENTICATION

### Bearer Token Authentication
```http
Authorization: Bearer {access_token}
```

### Example Header
```http
GET /v1/shipments HTTP/1.1
Host: api.ecommerce.local
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Scopes
- `read:all` - Read all resources
- `write:all` - Write all resources
- `admin:all` - Full admin access
- `shipments:read` - Read shipments only
- `inventory:write` - Write to inventory

---

## 📐 COMMON PATTERNS

### Request Format
```json
{
  "data": {
    "field1": "value1",
    "field2": "value2"
  },
  "meta": {
    "timestamp": "2026-05-05T10:30:00Z",
    "request_id": "req_12345"
  }
}
```

### Response Format (Success)
```json
{
  "success": true,
  "status": 200,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "name": "Example",
    "created_at": "2026-05-05T10:30:00Z"
  },
  "meta": {
    "timestamp": "2026-05-05T10:30:00Z",
    "request_id": "req_12345"
  }
}
```

### Response Format (Error)
```json
{
  "success": false,
  "status": 400,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-05-05T10:30:00Z",
    "request_id": "req_12345"
  }
}
```

### Pagination
```http
GET /v1/shipments?page=1&limit=20&sort=created_at:desc
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1500,
    "pages": 75,
    "has_next": true,
    "has_prev": false
  }
}
```

### Filtering
```http
GET /v1/shipments?status=in_transit&warehouse_id=1&date_from=2026-01-01
```

---

## ⚠️ ERROR HANDLING

### HTTP Status Codes
| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Resource retrieved/updated |
| 201 | Created | Resource created |
| 204 | No Content | Resource deleted |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable | Validation error |
| 429 | Too Many Requests | Rate limited |
| 500 | Server Error | Internal error |

### Error Codes
```
VALIDATION_ERROR - Input validation failed
AUTHENTICATION_ERROR - Auth token invalid
AUTHORIZATION_ERROR - Insufficient permissions
NOT_FOUND - Resource not found
CONFLICT - Resource already exists
RATE_LIMIT_EXCEEDED - Too many requests
INTERNAL_ERROR - Server error
```

---

## 🚦 RATE LIMITING

### Limits per IP
- Authenticated: 1000 requests/hour
- Unauthenticated: 100 requests/hour
- Burst: 10 requests/second

### Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1651749600
```

---

## MODULE 1: LOGISTICS & SHIPPING

### 1.1 Get All Shipping Providers
```http
GET /v1/logistics/providers
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "provider_name": "Giao Hàng Nhanh",
      "provider_code": "GHN",
      "is_active": true,
      "base_fee": 15000,
      "created_at": "2026-05-05T10:30:00Z"
    }
  ]
}
```

### 1.2 Create Shipping Provider
```http
POST /v1/logistics/providers
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "provider_name": "DHL Vietnam",
  "provider_code": "DHL",
  "api_endpoint": "https://api.dhl.com/v1",
  "api_key": "***",
  "base_fee": 25000
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": 5,
    "provider_name": "DHL Vietnam",
    "provider_code": "DHL",
    "is_active": true,
    "base_fee": 25000
  }
}
```

### 1.3 Get Shipment Details
```http
GET /v1/logistics/shipments/{shipment_id}
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_id": 100,
    "tracking_number": "GHN123456789",
    "status": "in_transit",
    "shipped_date": "2026-05-05T08:00:00Z",
    "expected_delivery_date": "2026-05-08T18:00:00Z",
    "weight": 2.5,
    "shipping_fee": 35000,
    "tracking_history": [
      {
        "status": "picked_up",
        "location": "Hanoi Warehouse",
        "timestamp": "2026-05-05T08:30:00Z"
      },
      {
        "status": "in_transit",
        "location": "Vinh, Nghe An",
        "timestamp": "2026-05-06T14:00:00Z"
      }
    ]
  }
}
```

### 1.4 Update Shipment Status
```http
PATCH /v1/logistics/shipments/{shipment_id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "status": "delivered",
  "actual_delivery_date": "2026-05-08T15:30:00Z",
  "notes": "Delivered successfully"
}
```

### 1.5 Get Tracking History
```http
GET /v1/logistics/shipments/{shipment_id}/tracking
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "shipment_id": 1,
    "tracking_number": "GHN123456789",
    "events": [
      {
        "id": 1,
        "status": "picked_up",
        "location": "Hanoi Warehouse",
        "description": "Package picked up",
        "timestamp": "2026-05-05T08:30:00Z"
      },
      {
        "id": 2,
        "status": "in_transit",
        "location": "Vinh, Nghe An",
        "description": "In transit",
        "timestamp": "2026-05-06T14:00:00Z"
      }
    ]
  }
}
```

---

## MODULE 2: RETURNS & REFUNDS

### 2.1 Create Return Request
```http
POST /v1/returns/requests
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "order_id": 100,
  "customer_id": 5,
  "return_reason_id": 2,
  "notes": "Product arrived damaged",
  "items": [
    {
      "order_item_id": 250,
      "quantity": 1,
      "condition": "damaged"
    }
  ]
}
```

**Response** (201)
```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": 1,
    "order_id": 100,
    "status": "pending",
    "requested_date": "2026-05-05T10:30:00Z",
    "estimated_return_date": "2026-05-12T18:00:00Z"
  }
}
```

### 2.2 Get Return Request Status
```http
GET /v1/returns/requests/{return_id}
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_id": 100,
    "status": "approved",
    "requested_date": "2026-05-05T10:30:00Z",
    "approved_date": "2026-05-06T09:00:00Z",
    "items": [
      {
        "product_id": 50,
        "product_name": "Product Name",
        "quantity": 1,
        "condition": "damaged",
        "refund_amount": 250000
      }
    ],
    "total_refund": 250000
  }
}
```

### 2.3 Process Refund
```http
POST /v1/returns/requests/{return_id}/refund
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "refund_method": "original_payment",
  "notes": "Approved refund"
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "return_id": 1,
    "refund_id": 5,
    "refund_amount": 250000,
    "refund_method": "original_payment",
    "status": "processing",
    "estimated_completion": "2026-05-15T18:00:00Z"
  }
}
```

### 2.4 Get Refund Status
```http
GET /v1/returns/refunds/{refund_id}
Authorization: Bearer {token}
```

---

## MODULE 3: INVENTORY MANAGEMENT

### 3.1 Get Stock Levels
```http
GET /v1/inventory/stocks?product_id=1&store_id=1
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "store_id": 1,
    "current_stock": 150,
    "reserved_stock": 30,
    "available_stock": 120,
    "min_stock_level": 50,
    "reorder_point": 75,
    "reorder_quantity": 100,
    "last_stock_check": "2026-05-05T08:00:00Z"
  }
}
```

### 3.2 Update Stock Level
```http
PATCH /v1/inventory/stocks/{stock_id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "adjustment_type": "manual_correction",
  "quantity_change": 10,
  "reason": "Stock count correction",
  "notes": "Physical inventory count"
}
```

### 3.3 Record Inventory Movement
```http
POST /v1/inventory/movements
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "product_id": 1,
  "store_id": 1,
  "movement_type": "sale",
  "quantity": 5,
  "reference_id": 100,
  "reference_type": "order",
  "notes": "Order #100 fulfillment"
}
```

**Response** (201)
```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": 1,
    "movement_type": "sale",
    "quantity": 5,
    "created_at": "2026-05-05T10:30:00Z"
  }
}
```

### 3.4 Get Stock Alerts
```http
GET /v1/inventory/alerts?status=unresolved
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 5,
      "store_id": 1,
      "alert_type": "low_stock",
      "current_stock": 45,
      "threshold": 50,
      "is_resolved": false,
      "created_at": "2026-05-05T06:00:00Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 20
  }
}
```

### 3.5 Resolve Stock Alert
```http
PATCH /v1/inventory/alerts/{alert_id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "is_resolved": true,
  "resolution_notes": "Reorder placed"
}
```

---

## MODULE 4: SHOPPING CART & WISHLIST

### 4.1 Create or Get Cart
```http
POST /v1/shopping/carts
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "customer_id": 5,
  "session_id": "session_abc123"
}
```

**Response** (200 or 201)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "customer_id": 5,
    "status": "active",
    "total_items": 2,
    "total_amount": 500000,
    "created_at": "2026-05-05T10:00:00Z",
    "updated_at": "2026-05-05T10:30:00Z"
  }
}
```

### 4.2 Add to Cart
```http
POST /v1/shopping/carts/{cart_id}/items
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "product_id": 1,
  "quantity": 2,
  "unit_price": 250000
}
```

**Response** (201)
```json
{
  "success": true,
  "status": 201,
  "data": {
    "cart_item_id": 1,
    "product_id": 1,
    "quantity": 2,
    "unit_price": 250000,
    "subtotal": 500000
  }
}
```

### 4.3 Get Cart Items
```http
GET /v1/shopping/carts/{cart_id}/items
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "cart_id": 1,
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Product 1",
        "quantity": 2,
        "unit_price": 250000,
        "subtotal": 500000
      },
      {
        "id": 2,
        "product_id": 2,
        "product_name": "Product 2",
        "quantity": 1,
        "unit_price": 300000,
        "subtotal": 300000
      }
    ],
    "total_items": 3,
    "total_amount": 800000
  }
}
```

### 4.4 Remove from Cart
```http
DELETE /v1/shopping/carts/{cart_id}/items/{item_id}
Authorization: Bearer {token}
```

**Response** (204 No Content)

### 4.5 Create Wishlist
```http
POST /v1/shopping/wishlists
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "customer_id": 5,
  "wishlist_name": "Birthday Wishlist",
  "is_public": false
}
```

**Response** (201)
```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": 1,
    "customer_id": 5,
    "wishlist_name": "Birthday Wishlist",
    "visibility_link": "wish_abc123xyz",
    "is_public": false
  }
}
```

### 4.6 Add to Wishlist
```http
POST /v1/shopping/wishlists/{wishlist_id}/items
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "product_id": 1,
  "priority": 1
}
```

---

## MODULE 5: NOTIFICATIONS & MESSAGES

### 5.1 Get User Notifications
```http
GET /v1/notifications?unread_only=true&limit=20
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "order",
      "title": "Order Confirmed",
      "message": "Your order #100 has been confirmed",
      "is_read": false,
      "created_at": "2026-05-05T10:30:00Z"
    },
    {
      "id": 2,
      "type": "shipment",
      "title": "Package Shipped",
      "message": "Your package is on the way",
      "is_read": false,
      "created_at": "2026-05-05T14:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "unread_count": 2
  }
}
```

### 5.2 Mark Notification as Read
```http
PATCH /v1/notifications/{notification_id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "is_read": true
}
```

### 5.3 Send Email
```http
POST /v1/notifications/emails
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "template_id": 1,
  "recipient_email": "customer@example.com",
  "variables": {
    "customer_name": "John",
    "order_id": 100
  }
}
```

**Response** (202 Accepted)
```json
{
  "success": true,
  "status": 202,
  "data": {
    "email_log_id": 1,
    "status": "pending",
    "recipient": "customer@example.com",
    "scheduled_send": "2026-05-05T10:30:00Z"
  }
}
```

### 5.4 Get Email Templates
```http
GET /v1/notifications/email-templates
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "template_name": "order_confirmation",
      "subject": "Order Confirmation #{{order_id}}",
      "is_active": true
    },
    {
      "id": 2,
      "template_name": "shipment_tracking",
      "subject": "Your package is on the way",
      "is_active": true
    }
  ]
}
```

---

## MODULE 6: PRICING & HISTORY

### 6.1 Get Product Pricing
```http
GET /v1/pricing/products/{product_id}
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "current_price": 250000,
    "discount_price": 200000,
    "discount_percentage": 20,
    "effective_date": "2026-05-01T00:00:00Z",
    "end_date": "2026-05-31T23:59:59Z",
    "bulk_pricing": [
      {
        "min_quantity": 5,
        "max_quantity": 10,
        "unit_price": 240000
      },
      {
        "min_quantity": 11,
        "max_quantity": null,
        "unit_price": 230000
      }
    ]
  }
}
```

### 6.2 Get Price History
```http
GET /v1/pricing/products/{product_id}/history?limit=20
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "old_price": 300000,
      "new_price": 250000,
      "reason": "Flash Sale",
      "effective_date": "2026-05-01T00:00:00Z",
      "end_date": "2026-05-05T23:59:59Z"
    },
    {
      "id": 2,
      "old_price": 280000,
      "new_price": 300000,
      "reason": "Price Adjustment",
      "effective_date": "2026-04-15T00:00:00Z"
    }
  ]
}
```

### 6.3 Update Product Price
```http
PATCH /v1/pricing/products/{product_id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "new_price": 225000,
  "discount_price": 180000,
  "reason": "Spring Sale",
  "effective_date": "2026-05-10T00:00:00Z",
  "end_date": "2026-05-20T23:59:59Z"
}
```

### 6.4 Create Bulk Pricing
```http
POST /v1/pricing/bulk-pricing
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "product_id": 1,
  "min_quantity": 10,
  "max_quantity": 50,
  "unit_price": 220000
}
```

---

## MODULE 7: ANALYTICS & REPORTING

### 7.1 Get Order Analytics
```http
GET /v1/analytics/orders?date_from=2026-01-01&date_to=2026-05-05
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-05-05",
      "total_orders": 45,
      "total_revenue": 15000000,
      "average_order_value": 333333,
      "unique_customers": 40,
      "new_customers": 5
    },
    {
      "date": "2026-05-04",
      "total_orders": 52,
      "total_revenue": 17500000,
      "average_order_value": 336538,
      "unique_customers": 48,
      "new_customers": 8
    }
  ]
}
```

### 7.2 Get Product Analytics
```http
GET /v1/analytics/products/{product_id}?date_from=2026-01-01&date_to=2026-05-05
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "analytics": [
      {
        "date": "2026-05-05",
        "views": 150,
        "add_to_cart_count": 25,
        "purchase_count": 8,
        "revenue": 2000000,
        "conversion_rate": 5.33
      }
    ],
    "summary": {
      "total_views": 5000,
      "total_purchases": 300,
      "total_revenue": 75000000,
      "conversion_rate": 6.0
    }
  }
}
```

### 7.3 Get Customer Analytics
```http
GET /v1/analytics/customers/{customer_id}
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "customer_id": 5,
    "purchase_count": 15,
    "total_spent": 5000000,
    "average_order_value": 333333,
    "first_purchase_date": "2025-01-15",
    "last_purchase_date": "2026-05-05",
    "lifetime_value": 5000000,
    "purchase_frequency": "monthly"
  }
}
```

### 7.4 Get Dashboard Metrics
```http
GET /v1/analytics/dashboard?period=monthly
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "period": "May 2026",
    "total_revenue": 450000000,
    "total_orders": 1200,
    "unique_customers": 800,
    "conversion_rate": 2.5,
    "average_order_value": 375000,
    "top_products": [
      {
        "product_id": 1,
        "name": "Product 1",
        "sales": 250,
        "revenue": 50000000
      }
    ],
    "top_customers": [
      {
        "customer_id": 5,
        "name": "Customer Name",
        "spent": 5000000,
        "orders": 15
      }
    ]
  }
}
```

---

## MODULE 8: AUDIT & LOGS

### 8.1 Get Audit Logs
```http
GET /v1/audit/logs?action=update&entity_type=products&limit=50
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "action": "update",
      "entity_type": "product",
      "entity_id": 5,
      "old_values": {
        "price": 300000
      },
      "new_values": {
        "price": 250000
      },
      "ip_address": "192.168.1.1",
      "created_at": "2026-05-05T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 1500,
    "page": 1
  }
}
```

### 8.2 Get Audit Log Detail
```http
GET /v1/audit/logs/{log_id}
Authorization: Bearer {token}
```

---

## MODULE 9: SETTINGS & CONFIGURATION

### 9.1 Get System Settings
```http
GET /v1/settings/system
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "company_name": "E-Commerce Inc",
    "tax_rate": 10,
    "currency": "VND",
    "enable_promotions": true,
    "enable_loyalty": true,
    "customer_service_email": "support@example.com",
    "phone": "+84 123456789"
  }
}
```

### 9.2 Update System Settings
```http
PATCH /v1/settings/system
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "tax_rate": 12,
  "enable_promotions": true
}
```

### 9.3 Get Tax Settings by Region
```http
GET /v1/settings/tax?region=Ho_Chi_Minh
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "region": "Ho_Chi_Minh",
    "tax_rate": 10,
    "tax_name": "VAT 10%",
    "is_active": true
  }
}
```

---

## MODULE 11: SUPPLIER MANAGEMENT

### 11.1 Get All Suppliers
```http
GET /v1/suppliers?is_active=true&limit=20
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "supplier_name": "Supplier A",
      "supplier_code": "SUPP001",
      "contact_person": "John Doe",
      "email": "john@supplier.com",
      "phone": "+84 123456789",
      "payment_terms": "Net 30",
      "lead_time_days": 7,
      "rating": 4.5,
      "is_active": true
    }
  ]
}
```

### 11.2 Create Supplier
```http
POST /v1/suppliers
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "supplier_name": "New Supplier",
  "supplier_code": "SUPP002",
  "contact_person": "Jane Smith",
  "email": "jane@supplier.com",
  "phone": "+84 987654321",
  "address": "123 Supplier Street",
  "city": "Hanoi",
  "country": "Vietnam",
  "payment_terms": "Net 30",
  "lead_time_days": 5
}
```

### 11.3 Get Supplier Performance
```http
GET /v1/suppliers/{supplier_id}/performance?date_from=2026-01-01
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-05-05",
      "total_orders": 10,
      "on_time_delivery_rate": 95.5,
      "quality_score": 4.5,
      "price_competitiveness": 4.0,
      "overall_score": 4.67
    }
  ]
}
```

### 11.4 Get Supplier Products
```http
GET /v1/suppliers/{supplier_id}/products?limit=20
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 5,
      "product_name": "Product Name",
      "supplier_product_code": "SUP-SKU-001",
      "supplier_price": 50000,
      "moq": 10,
      "lead_time": 5,
      "availability": "in_stock"
    }
  ]
}
```

### 11.5 Record Supplier Payment
```http
POST /v1/suppliers/{supplier_id}/payments
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "payment_amount": 5000000,
  "payment_method": "bank_transfer",
  "payment_date": "2026-05-05T10:30:00Z",
  "due_date": "2026-06-05T23:59:59Z",
  "reference_number": "TRF-12345",
  "notes": "Payment for PO #100"
}
```

---

## MODULE 12: WAREHOUSE MANAGEMENT

### 12.1 Get All Warehouses
```http
GET /v1/warehouses
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "warehouse_name": "Hanoi Warehouse",
      "warehouse_code": "WH-001",
      "location": "Hanoi",
      "capacity": 10000,
      "manager_id": 5,
      "phone": "+84 123456789",
      "email": "wh1@example.com",
      "is_active": true
    }
  ]
}
```

### 12.2 Get Warehouse Zones
```http
GET /v1/warehouses/{warehouse_id}/zones
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "zone_name": "Zone A",
      "zone_code": "ZN-A",
      "rack_count": 10,
      "shelf_count": 50,
      "capacity": 5000,
      "current_usage": 3500
    }
  ]
}
```

### 12.3 Get Rack Details
```http
GET /v1/warehouses/{warehouse_id}/zones/{zone_id}/racks/{rack_id}
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "rack_number": "A-01",
    "rack_code": "RK-A-01",
    "shelf_count": 5,
    "capacity": 500,
    "current_load": 350,
    "status": "active",
    "shelves": [
      {
        "shelf_number": 1,
        "products": [
          {
            "product_id": 1,
            "product_code": "PROD-001",
            "quantity": 50
          }
        ]
      }
    ]
  }
}
```

### 12.4 Create Warehouse Transfer
```http
POST /v1/warehouses/transfers
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "from_warehouse_id": 1,
  "to_warehouse_id": 2,
  "product_id": 1,
  "quantity": 100,
  "transfer_date": "2026-05-10T00:00:00Z"
}
```

**Response** (201)
```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": 1,
    "from_warehouse_id": 1,
    "to_warehouse_id": 2,
    "product_id": 1,
    "quantity": 100,
    "status": "pending",
    "transfer_date": "2026-05-10T00:00:00Z"
  }
}
```

### 12.5 Update Transfer Status
```http
PATCH /v1/warehouses/transfers/{transfer_id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "status": "received",
  "arrival_date": "2026-05-12T14:30:00Z"
}
```

---

## MODULE 13: PRODUCT REVIEWS & RATINGS

### 13.1 Get Product Reviews
```http
GET /v1/reviews/products/{product_id}?limit=20&sort=helpful:desc
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_id": 5,
      "customer_name": "John Doe",
      "rating": 5,
      "title": "Excellent Product",
      "comment": "Great quality, highly recommend",
      "helpful_count": 45,
      "unhelpful_count": 2,
      "verified_purchase": true,
      "images": [
        {
          "url": "https://cdn.example.com/review-1.jpg",
          "display_order": 1
        }
      ],
      "response": {
        "text": "Thank you for the review!",
        "responder": "Admin",
        "response_date": "2026-05-05T10:30:00Z"
      },
      "created_at": "2026-05-01T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 150
  }
}
```

### 13.2 Create Product Review
```http
POST /v1/reviews/products/{product_id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "customer_id": 5,
  "order_id": 100,
  "rating": 5,
  "title": "Great Product",
  "comment": "Excellent quality and fast delivery",
  "images": [
    {
      "url": "https://cdn.example.com/upload/img1.jpg",
      "display_order": 1
    }
  ]
}
```

**Response** (201)
```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": 1,
    "status": "pending",
    "message": "Review submitted for moderation"
  }
}
```

### 13.3 Get Rating Summary
```http
GET /v1/reviews/products/{product_id}/summary
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "average_rating": 4.7,
    "total_reviews": 150,
    "rating_distribution": {
      "5": 120,
      "4": 20,
      "3": 5,
      "2": 3,
      "1": 2
    },
    "review_trend": [
      {
        "month": "May 2026",
        "reviews": 15,
        "average_rating": 4.8
      }
    ]
  }
}
```

### 13.4 Respond to Review
```http
POST /v1/reviews/{review_id}/responses
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "response_text": "Thank you for your feedback! We appreciate your purchase."
}
```

---

## MODULE 14: CUSTOMER SEGMENTS & LOYALTY

### 14.1 Get Customer Segments
```http
GET /v1/segments
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "segment_name": "VIP Customers",
      "segment_code": "VIP",
      "priority": 1,
      "criteria": {
        "min_spend": 10000000,
        "purchase_frequency": "monthly"
      },
      "is_active": true
    },
    {
      "id": 2,
      "segment_name": "Regular Customers",
      "segment_code": "REGULAR",
      "priority": 2,
      "is_active": true
    }
  ]
}
```

### 14.2 Get Loyalty Programs
```http
GET /v1/loyalty/programs
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "program_name": "Rewards Program",
      "program_code": "REWARD",
      "tier_count": 3,
      "tiers": [
        {
          "id": 1,
          "tier_name": "Bronze",
          "tier_level": 1,
          "min_points": 0,
          "benefits": {
            "discount_percentage": 5,
            "points_multiplier": 1.0
          }
        },
        {
          "id": 2,
          "tier_name": "Silver",
          "tier_level": 2,
          "min_points": 5000,
          "benefits": {
            "discount_percentage": 10,
            "points_multiplier": 1.5
          }
        }
      ],
      "is_active": true
    }
  ]
}
```

### 14.3 Get Customer Loyalty Account
```http
GET /v1/loyalty/customers/{customer_id}
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "customer_id": 5,
    "program_id": 1,
    "current_tier": {
      "id": 2,
      "tier_name": "Silver",
      "tier_level": 2
    },
    "total_points": 7500,
    "used_points": 2000,
    "available_points": 5500,
    "last_transaction_date": "2026-05-05T10:30:00Z",
    "points_needed_for_next_tier": 2500
  }
}
```

### 14.4 Record Loyalty Transaction
```http
POST /v1/loyalty/transactions
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "customer_id": 5,
  "program_id": 1,
  "transaction_type": "earn",
  "points_change": 500,
  "reason": "Purchase order #100",
  "reference_id": 100
}
```

### 14.5 Redeem Loyalty Points
```http
POST /v1/loyalty/redeem
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "customer_id": 5,
  "program_id": 1,
  "points_to_redeem": 1000,
  "reward_type": "discount",
  "reward_value": 100000
}
```

---

## MODULE 15: MARKETING CAMPAIGNS

### 15.1 Create Campaign
```http
POST /v1/campaigns
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "campaign_name": "Spring Sale 2026",
  "campaign_code": "SPRING2026",
  "campaign_type": "email",
  "target_segment_id": 2,
  "start_date": "2026-05-10T00:00:00Z",
  "end_date": "2026-05-20T23:59:59Z",
  "budget": 10000000,
  "expected_roi": 200
}
```

**Response** (201)
```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": 1,
    "campaign_code": "SPRING2026",
    "status": "draft"
  }
}
```

### 15.2 Send Campaign Email
```http
POST /v1/campaigns/{campaign_id}/send-email
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "email_template_id": 1,
  "scheduled_send_time": "2026-05-10T08:00:00Z",
  "recipient_count": 5000
}
```

### 15.3 Create Coupon
```http
POST /v1/coupons
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "coupon_code": "SAVE20",
  "campaign_id": 1,
  "discount_type": "percentage",
  "discount_value": 20,
  "max_usage_count": 1000,
  "validity_start": "2026-05-10T00:00:00Z",
  "validity_end": "2026-05-20T23:59:59Z",
  "min_purchase_amount": 100000,
  "applicable_segments": [1, 2]
}
```

**Response** (201)
```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": 1,
    "coupon_code": "SAVE20",
    "status": "active"
  }
}
```

### 15.4 Validate Coupon
```http
POST /v1/coupons/validate
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "coupon_code": "SAVE20",
  "customer_id": 5,
  "cart_total": 500000
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "is_valid": true,
    "coupon_code": "SAVE20",
    "discount_type": "percentage",
    "discount_value": 20,
    "discount_amount": 100000,
    "final_total": 400000
  }
}
```

### 15.5 Get Campaign Performance
```http
GET /v1/campaigns/{campaign_id}/performance
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "campaign_id": 1,
    "total_impressions": 100000,
    "total_clicks": 5000,
    "total_conversions": 500,
    "total_revenue": 50000000,
    "total_cost": 10000000,
    "roi": 400,
    "daily_breakdown": [
      {
        "date": "2026-05-10",
        "impressions": 20000,
        "clicks": 1000,
        "conversions": 100,
        "revenue": 10000000,
        "roi": 400
      }
    ]
  }
}
```

---

## MODULE 16: PAYMENT & TRANSACTIONS

### 16.1 Get Payment Methods
```http
GET /v1/payments/methods
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "method_code": "CC",
      "method_name": "Credit Card",
      "provider": "Stripe",
      "is_active": true
    },
    {
      "id": 2,
      "method_code": "BANK",
      "method_name": "Bank Transfer",
      "provider": "Local Bank",
      "is_active": true
    }
  ]
}
```

### 16.2 Process Payment
```http
POST /v1/payments/transactions
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "order_id": 100,
  "customer_id": 5,
  "payment_method_id": 1,
  "transaction_amount": 500000,
  "currency": "VND"
}
```

**Response** (201)
```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": 1,
    "transaction_amount": 500000,
    "status": "processing",
    "provider_transaction_id": "txn_abc123",
    "created_at": "2026-05-05T10:30:00Z"
  }
}
```

### 16.3 Get Transaction Details
```http
GET /v1/payments/transactions/{transaction_id}
Authorization: Bearer {token}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_id": 100,
    "customer_id": 5,
    "transaction_amount": 500000,
    "currency": "VND",
    "transaction_type": "payment",
    "status": "success",
    "provider_transaction_id": "txn_abc123",
    "authorization_code": "AUTH123",
    "transaction_date": "2026-05-05T10:30:00Z"
  }
}
```

### 16.4 Initiate Refund
```http
POST /v1/payments/transactions/{transaction_id}/refund
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "refund_amount": 500000,
  "reason": "Return processing"
}
```

### 16.5 Reconcile Payments
```http
POST /v1/payments/reconciliation
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "payment_batch_date": "2026-05-05",
  "payment_method_id": 1,
  "expected_amount": 5000000,
  "received_amount": 4950000
}
```

**Response** (201)
```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": 1,
    "reconciliation_status": "under_review",
    "discrepancy": -50000,
    "message": "Reconciliation created for review"
  }
}
```

### 16.6 Report Payment Dispute
```http
POST /v1/payments/disputes
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "transaction_id": 1,
  "dispute_reason": "Unauthorized",
  "dispute_amount": 500000
}
```

---

## 📞 WEBHOOKS

### Webhook Events

#### Order Events
- `order.created` - New order created
- `order.confirmed` - Order confirmed
- `order.cancelled` - Order cancelled
- `order.completed` - Order completed

#### Shipment Events
- `shipment.created` - Shipment created
- `shipment.shipped` - Shipment dispatched
- `shipment.delivered` - Shipment delivered
- `shipment.failed` - Delivery failed

#### Inventory Events
- `inventory.low_stock` - Stock level low
- `inventory.out_of_stock` - Out of stock
- `inventory.updated` - Stock updated

#### Payment Events
- `payment.success` - Payment successful
- `payment.failed` - Payment failed
- `refund.processed` - Refund processed

### Webhook Format
```json
{
  "event": "order.confirmed",
  "timestamp": "2026-05-05T10:30:00Z",
  "data": {
    "order_id": 100,
    "customer_id": 5,
    "total_amount": 500000
  },
  "signature": "sha256_signature_here"
}
```

---

## 📚 SDK EXAMPLES

### JavaScript Example
```javascript
const API_BASE = 'https://api.ecommerce.local/v1';

// Get shipment
const shipment = await fetch(
  `${API_BASE}/logistics/shipments/1`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }
);

const data = await shipment.json();
console.log(data.data);

// Create order
const order = await fetch(
  `${API_BASE}/orders`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customer_id: 5,
      items: [
        { product_id: 1, quantity: 2 }
      ],
      total: 500000
    })
  }
);
```

### Python Example
```python
import requests

API_BASE = 'https://api.ecommerce.local/v1'
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

# Get shipment
response = requests.get(
    f'{API_BASE}/logistics/shipments/1',
    headers=headers
)
shipment = response.json()

# Create cart
response = requests.post(
    f'{API_BASE}/shopping/carts',
    headers=headers,
    json={
        'customer_id': 5,
        'session_id': 'session_abc123'
    }
)
cart = response.json()
```

---

## 📝 API VERSIONING

### Version Strategy
- Current: `v1`
- Next: `v2` (planned)
- Deprecated: None

### Backward Compatibility
- Guaranteed for 12 months
- Deprecation notice 3 months in advance
- Migration guide provided

---

## 🔒 SECURITY

### HTTPS Only
- All endpoints require HTTPS
- HTTP requests will be redirected

### Rate Limiting
- 1000 requests/hour (authenticated)
- 100 requests/hour (unauthenticated)
- 429 Too Many Requests response

### Input Validation
- All inputs validated server-side
- SQL injection protection via parameterized queries
- XSS protection via output encoding

### Data Protection
- Sensitive data encrypted at rest
- PCI-DSS compliant for payments
- GDPR compliant for personal data

---

## 📞 SUPPORT

### Endpoints
- **API Status**: `https://status.ecommerce.local`
- **Documentation**: `https://docs.ecommerce.local`
- **Support**: `support@ecommerce.local`

### Response Times
- 95th percentile: < 100ms
- 99th percentile: < 500ms

---

**Last Updated**: 2026-05-05  
**API Version**: 1.0  
**Status**: Production Ready ✅