CREATE TABLE supplier_orders (
    id_order INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    order_number VARCHAR(50) NOT NULL UNIQUE,

    id_supplier INT UNSIGNED NOT NULL,
    created_by INT UNSIGNED NOT NULL,

    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date DATE,
    received_date DATETIME,

    order_status ENUM(
        'draft',
        'ordered',
        'partially_received',
        'received',
        'cancelled'
    ) NOT NULL DEFAULT 'draft',

    total_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_supplier_orders_supplier
        FOREIGN KEY (id_supplier)
        REFERENCES suppliers(id_supplier)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_supplier_orders_user
        FOREIGN KEY (created_by)
        REFERENCES users(id_user)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_supplier_order_total
        CHECK (total_cost >= 0)
);