ALTER TABLE sales_orders
MODIFY COLUMN sale_status
ENUM(
    'open',
    'payment_reported',
    'paid',
    'cancelled',
    'refunded'
)
NOT NULL DEFAULT 'open';