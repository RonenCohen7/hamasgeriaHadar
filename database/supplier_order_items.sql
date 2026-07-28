CREATE TABLE supplier_order_items (
    id_order_item INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_order INT UNSIGNED NOT NULL,
    id_product INT UNSIGNED NOT NULL,

    quantity_ordered DECIMAL(10,3) NOT NULL,
    quantity_received DECIMAL(10,3) NOT NULL DEFAULT 0.000,

    unit_cost DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2)
        GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_supplier_order_product
        UNIQUE (id_order, id_product),

    CONSTRAINT fk_supplier_order_items_order
        FOREIGN KEY (id_order)
        REFERENCES supplier_orders(id_order)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_supplier_order_items_product
        FOREIGN KEY (id_product)
        REFERENCES products(id_product)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_quantity_ordered
        CHECK (quantity_ordered > 0),

    CONSTRAINT chk_quantity_received
        CHECK (quantity_received >= 0),

    CONSTRAINT chk_order_item_cost
        CHECK (unit_cost >= 0)
);