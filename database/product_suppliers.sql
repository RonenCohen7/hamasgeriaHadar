CREATE TABLE product_suppliers (
    id_product_supplier INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_product INT UNSIGNED NOT NULL,
    id_supplier INT UNSIGNED NOT NULL,

    supplier_catalog_number VARCHAR(200),
    supplier_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    is_preferred_supplier BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_product_supplier
        UNIQUE (id_product, id_supplier),

    CONSTRAINT fk_product_suppliers_product
        FOREIGN KEY (id_product)
        REFERENCES products(id_product)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_product_suppliers_supplier
        FOREIGN KEY (id_supplier)
        REFERENCES suppliers(id_supplier)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_supplier_cost
        CHECK (supplier_cost >= 0)
);