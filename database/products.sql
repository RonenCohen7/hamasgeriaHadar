CREATE TABLE products (
    id_product INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    product_name VARCHAR(200) NOT NULL,
    catalog_number VARCHAR(200) NOT NULL UNIQUE,

    id_category INT UNSIGNED NULL,

    product_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    product_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    product_stock DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    minimum_stock DECIMAL(10,3) NOT NULL DEFAULT 0.000,

    unit_type ENUM(
        'unit',
        'bottle',
        'liter',
        'milliliter',
        'kilogram',
        'gram'
    ) NOT NULL DEFAULT 'unit',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category
        FOREIGN KEY (id_category)
        REFERENCES product_categories(id_category)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_product_cost
        CHECK (product_cost >= 0),

    CONSTRAINT chk_product_price
        CHECK (product_price >= 0),

    CONSTRAINT chk_product_stock
        CHECK (product_stock >= 0),

    CONSTRAINT chk_minimum_stock
        CHECK (minimum_stock >= 0)
);