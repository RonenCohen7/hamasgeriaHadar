CREATE TABLE sales_orders (
    id_sale INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    sale_number VARCHAR(50) NOT NULL UNIQUE,

    id_event INT UNSIGNED NULL,
    created_by INT UNSIGNED NOT NULL,

    customer_name VARCHAR(150),

    sale_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    sale_status ENUM(
        'open',
        'paid',
        'cancelled',
        'refunded'
    ) NOT NULL DEFAULT 'open',

    payment_method ENUM(
        'cash',
        'credit_card',
        'bit',
        'paybox',
        'other'
    ),

    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_sales_orders_event
        FOREIGN KEY (id_event)
        REFERENCES events(id_event)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_sales_orders_user
        FOREIGN KEY (created_by)
        REFERENCES users(id_user)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_sale_subtotal
        CHECK (subtotal >= 0),

    CONSTRAINT chk_sale_discount
        CHECK (discount_amount >= 0),

    CONSTRAINT chk_sale_total
        CHECK (total_amount >= 0)
);