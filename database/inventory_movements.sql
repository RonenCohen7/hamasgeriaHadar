CREATE TABLE inventory_movements (
    id_movement BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_product INT UNSIGNED NOT NULL,
    id_event INT UNSIGNED NULL,
    created_by INT UNSIGNED NOT NULL,

    movement_type ENUM(
        'purchase',
        'sale',
        'event_allocation',
        'event_return',
        'damage',
        'waste',
        'refund',
        'manual_addition',
        'manual_reduction'
    ) NOT NULL,

    quantity DECIMAL(10,3) NOT NULL,

    stock_before DECIMAL(10,3),
    stock_after DECIMAL(10,3),

    reference_type ENUM(
        'supplier_order',
        'sale',
        'event',
        'manual'
    ),

    reference_id BIGINT UNSIGNED,

    notes VARCHAR(500),

    movement_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_movements_product
        FOREIGN KEY (id_product)
        REFERENCES products(id_product)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_inventory_movements_event
        FOREIGN KEY (id_event)
        REFERENCES events(id_event)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_inventory_movements_user
        FOREIGN KEY (created_by)
        REFERENCES users(id_user)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_inventory_movement_quantity
        CHECK (quantity > 0)
);