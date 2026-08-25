CREATE TABLE supplier_receipts (
    id_receipt INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_order INT UNSIGNED NOT NULL,
    received_by INT UNSIGNED NOT NULL,

    receipt_status ENUM('draft', 'confirmed', 'cancelled')
        NOT NULL DEFAULT 'draft',

    received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME NULL,

    notes VARCHAR(500) NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_supplier_receipts_order
        FOREIGN KEY (id_order)
        REFERENCES supplier_orders(id_order),

    CONSTRAINT fk_supplier_receipts_user
        FOREIGN KEY (received_by)
        REFERENCES users(id_user)
);


CREATE TABLE supplier_receipt_items (
    id_receipt_item INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

   id_receipt INT UNSIGNED NOT NULL,
   id_order_item INT UNSIGNED NOT NULL,
   id_product INT UNSIGNED NOT NULL,

    quantity_received DECIMAL(10,3) NOT NULL DEFAULT 0,
    quantity_damaged DECIMAL(10,3) NOT NULL DEFAULT 0,

    notes VARCHAR(500) NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_receipt_items_receipt
        FOREIGN KEY (id_receipt)
        REFERENCES supplier_receipts(id_receipt),

    CONSTRAINT fk_receipt_items_order_item
        FOREIGN KEY (id_order_item)
        REFERENCES supplier_order_items(id_order_item),

    CONSTRAINT fk_receipt_items_product
        FOREIGN KEY (id_product)
        REFERENCES products(id_product)
);