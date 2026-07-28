CREATE TABLE sales_order_items (
    id_sale_item INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_sale INT UNSIGNED NOT NULL,
    id_product INT UNSIGNED NOT NULL,

    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,

    line_total DECIMAL(12,2)
        GENERATED ALWAYS AS (quantity * unit_price) STORED,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sales_order_items_sale
        FOREIGN KEY (id_sale)
        REFERENCES sales_orders(id_sale)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_sales_order_items_product
        FOREIGN KEY (id_product)
        REFERENCES products(id_product)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_sale_item_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_sale_item_price
        CHECK (unit_price >= 0)
);