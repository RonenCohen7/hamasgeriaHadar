-- Hadar Pub - complete MySQL initialization script
-- Generated from the SQL files supplied by the user.
-- Contains no more than 10 seed rows per table.

DROP DATABASE IF EXISTS pub_management;
CREATE DATABASE pub_management
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE pub_management;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS event_product_sales;
DROP VIEW IF EXISTS event_sales_summary;
DROP TRIGGER IF EXISTS trg_after_sale_item_delete;
DROP TRIGGER IF EXISTS trg_after_sale_item_insert;
DROP TRIGGER IF EXISTS trg_before_sale_item_insert;

DROP TABLE IF EXISTS inventory_movements;
DROP TABLE IF EXISTS sales_order_items;
DROP TABLE IF EXISTS sales_orders;
DROP TABLE IF EXISTS supplier_order_items;
DROP TABLE IF EXISTS supplier_orders;
DROP TABLE IF EXISTS product_suppliers;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- The uploaded database folder did not contain users.sql, although several
-- supplied tables reference users(id_user). This table completes that dependency.
CREATE TABLE users (
    id_user INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'employee') NOT NULL DEFAULT 'employee',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE product_categories (
    id_category INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id_supplier INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(200) NOT NULL,
    supplier_email VARCHAR(200) NOT NULL UNIQUE,
    supplier_mobile VARCHAR(30) NOT NULL UNIQUE,
    supplier_address VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id_product INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    image_name VARCHAR(255) NULL,
    catalog_number VARCHAR(200) NOT NULL UNIQUE,
    id_category INT UNSIGNED NULL,
    product_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    product_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    product_stock DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    minimum_stock DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    unit_type ENUM(
        'unit', 'bottle', 'liter', 'milliliter', 'kilogram', 'gram'
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
    CONSTRAINT chk_product_cost CHECK (product_cost >= 0),
    CONSTRAINT chk_product_price CHECK (product_price >= 0),
    CONSTRAINT chk_product_stock CHECK (product_stock >= 0),
    CONSTRAINT chk_minimum_stock CHECK (minimum_stock >= 0)
);

CREATE TABLE events (
    id_event INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(200) NOT NULL,
    event_description TEXT,
    event_start DATETIME NOT NULL,
    event_end DATETIME,
    event_location VARCHAR(255),
    maximum_guests INT UNSIGNED,
    expected_guests INT UNSIGNED,
    actual_guests INT UNSIGNED,
    ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    event_status ENUM('planned', 'active', 'completed', 'cancelled')
        NOT NULL DEFAULT 'planned',
    created_by INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_user
        FOREIGN KEY (created_by)
        REFERENCES users(id_user)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_event_dates CHECK (event_end IS NULL OR event_end >= event_start),
    CONSTRAINT chk_ticket_price CHECK (ticket_price >= 0)
);

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
    CONSTRAINT uq_product_supplier UNIQUE (id_product, id_supplier),
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
    CONSTRAINT chk_supplier_cost CHECK (supplier_cost >= 0)
);

CREATE TABLE supplier_orders (
    id_order INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    id_supplier INT UNSIGNED NOT NULL,
    created_by INT UNSIGNED NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date DATE,
    received_date DATETIME,
    order_status ENUM(
        'draft', 'ordered', 'partially_received', 'received', 'cancelled'
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
    CONSTRAINT chk_supplier_order_total CHECK (total_cost >= 0)
);

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
    CONSTRAINT uq_supplier_order_product UNIQUE (id_order, id_product),
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
    CONSTRAINT chk_quantity_ordered CHECK (quantity_ordered > 0),
    CONSTRAINT chk_quantity_received CHECK (quantity_received >= 0),
    CONSTRAINT chk_order_item_cost CHECK (unit_cost >= 0)
);

CREATE TABLE sales_orders (
    id_sale INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sale_number VARCHAR(50) NOT NULL UNIQUE,
    id_event INT UNSIGNED NULL,
    created_by INT UNSIGNED NOT NULL,
    customer_name VARCHAR(150),
    sale_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sale_status ENUM('open', 'paid', 'cancelled', 'refunded')
        NOT NULL DEFAULT 'open',
    payment_method ENUM('cash', 'credit_card', 'bit', 'paybox', 'other'),
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
    CONSTRAINT chk_sale_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_sale_discount CHECK (discount_amount >= 0),
    CONSTRAINT chk_sale_total CHECK (total_amount >= 0)
);

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
    CONSTRAINT chk_sale_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_sale_item_price CHECK (unit_price >= 0)
);

CREATE TABLE inventory_movements (
    id_movement BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_product INT UNSIGNED NOT NULL,
    id_event INT UNSIGNED NULL,
    created_by INT UNSIGNED NOT NULL,
    movement_type ENUM(
        'purchase', 'sale', 'event_allocation', 'event_return', 'damage',
        'waste', 'refund', 'manual_addition', 'manual_reduction'
    ) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    stock_before DECIMAL(10,3),
    stock_after DECIMAL(10,3),
    reference_type ENUM('supplier_order', 'sale', 'event', 'manual'),
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
    CONSTRAINT chk_inventory_movement_quantity CHECK (quantity > 0)
);

-- Seed data: exactly 10 rows per populated table, never more than 10.
-- Password values are placeholders for development data, not production credentials.
INSERT INTO users
    (id_user, first_name, last_name, email, password, role, is_active)
VALUES
    (1, 'Ronen', 'Cohen', 'ronen@hadarpub.local', 'ChangeMe123!', 'admin', TRUE),
    (2, 'Hadar', 'Levi', 'hadar@hadarpub.local', 'ChangeMe123!', 'manager', TRUE),
    (3, 'Noa', 'Mizrahi', 'noa@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (4, 'Daniel', 'Katz', 'daniel@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (5, 'Maya', 'Peretz', 'maya@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (6, 'Yoni', 'Bar', 'yoni@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (7, 'Shira', 'Dagan', 'shira@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (8, 'Amit', 'Tal', 'amit@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (9, 'Lior', 'Shalev', 'lior@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (10, 'Dana', 'Mor', 'dana@hadarpub.local', 'ChangeMe123!', 'employee', FALSE);

INSERT INTO product_categories
    (id_category, category_name, description)
VALUES
    (1, 'Beer', 'Bottled and draft beer'),
    (2, 'Wine', 'Red, white and sparkling wine'),
    (3, 'Spirits', 'Whisky, vodka, gin and other spirits'),
    (4, 'Cocktails', 'Prepared cocktail products'),
    (5, 'Soft Drinks', 'Carbonated and non-carbonated drinks'),
    (6, 'Water', 'Still and sparkling water'),
    (7, 'Snacks', 'Bar snacks and light food'),
    (8, 'Coffee', 'Coffee and hot beverages'),
    (9, 'Kitchen', 'Kitchen ingredients'),
    (10, 'Supplies', 'Disposable and operational supplies');

INSERT INTO suppliers
    (id_supplier, supplier_name, supplier_email, supplier_mobile, supplier_address, is_active)
VALUES
    (1, 'Galil Beverages', 'orders@galil-beverages.local', '050-7000001', 'Haifa, Israel', TRUE),
    (2, 'Jerusalem Winery', 'sales@jerusalem-winery.local', '050-7000002', 'Jerusalem, Israel', TRUE),
    (3, 'Negev Spirits', 'orders@negev-spirits.local', '050-7000003', 'Beer Sheva, Israel', TRUE),
    (4, 'Central Drinks', 'service@central-drinks.local', '050-7000004', 'Tel Aviv, Israel', TRUE),
    (5, 'Fresh Bar Supply', 'office@freshbar.local', '050-7000005', 'Rishon LeZion, Israel', TRUE),
    (6, 'Coffee House Supply', 'orders@coffeehouse.local', '050-7000006', 'Petah Tikva, Israel', TRUE),
    (7, 'Mediterranean Snacks', 'sales@medsnacks.local', '050-7000007', 'Ashdod, Israel', TRUE),
    (8, 'Pure Water Distribution', 'orders@purewater.local', '050-7000008', 'Netanya, Israel', TRUE),
    (9, 'Kitchen Pro', 'sales@kitchenpro.local', '050-7000009', 'Holon, Israel', TRUE),
    (10, 'Pub Essentials', 'orders@pubessentials.local', '050-7000010', 'Herzliya, Israel', FALSE);

INSERT INTO products
    (id_product, product_name, image_name, catalog_number, id_category,
     product_cost, product_price, product_stock, minimum_stock, unit_type, is_active)
VALUES
    (1, 'Gold Lager 330ml', NULL, 'BEER-001', 1, 5.00, 18.00, 120.000, 24.000, 'bottle', TRUE),
    (2, 'IPA 330ml', NULL, 'BEER-002', 1, 6.50, 22.00, 90.000, 18.000, 'bottle', TRUE),
    (3, 'Cabernet Sauvignon', NULL, 'WINE-001', 2, 42.00, 120.00, 36.000, 8.000, 'bottle', TRUE),
    (4, 'Chardonnay', NULL, 'WINE-002', 2, 38.00, 110.00, 30.000, 8.000, 'bottle', TRUE),
    (5, 'Premium Vodka 700ml', NULL, 'SPIRIT-001', 3, 55.00, 160.00, 20.000, 5.000, 'bottle', TRUE),
    (6, 'London Dry Gin 700ml', NULL, 'SPIRIT-002', 3, 62.00, 175.00, 18.000, 5.000, 'bottle', TRUE),
    (7, 'Cola 330ml', NULL, 'SOFT-001', 5, 2.50, 12.00, 150.000, 30.000, 'bottle', TRUE),
    (8, 'Sparkling Water 500ml', NULL, 'WATER-001', 6, 1.80, 10.00, 100.000, 20.000, 'bottle', TRUE),
    (9, 'Salted Peanuts 100g', NULL, 'SNACK-001', 7, 4.00, 16.00, 60.000, 12.000, 'unit', TRUE),
    (10, 'Espresso Coffee Beans', NULL, 'COFFEE-001', 8, 68.00, 0.00, 12.000, 3.000, 'kilogram', TRUE);

INSERT INTO events
    (id_event, event_name, event_description, event_start, event_end,
     event_location, maximum_guests, expected_guests, actual_guests,
     ticket_price, event_status, created_by)
VALUES
    (1, 'Opening Night', 'Season opening celebration', '2026-01-10 20:00:00', '2026-01-11 02:00:00', 'Hadar Pub', 180, 150, 142, 40.00, 'completed', 1),
    (2, 'Rock Thursday', 'Live rock performance', '2026-02-05 21:00:00', '2026-02-06 01:30:00', 'Hadar Pub', 160, 130, 125, 50.00, 'completed', 2),
    (3, 'Wine Tasting', 'Israeli winery tasting night', '2026-03-12 19:30:00', '2026-03-12 23:30:00', 'Hadar Pub', 90, 75, 72, 80.00, 'completed', 2),
    (4, 'Purim Party', 'Costume party and DJ', '2026-03-24 21:00:00', '2026-03-25 03:00:00', 'Hadar Pub', 200, 190, 188, 60.00, 'completed', 1),
    (5, 'Acoustic Evening', 'Local acoustic artists', '2026-04-16 20:30:00', '2026-04-17 00:30:00', 'Hadar Pub', 120, 100, 96, 35.00, 'completed', 3),
    (6, 'Independence Party', 'Israeli music celebration', '2026-04-22 21:00:00', '2026-04-23 03:00:00', 'Hadar Pub', 220, 200, 205, 70.00, 'completed', 1),
    (7, 'Summer Launch', 'Summer menu launch', '2026-06-04 20:00:00', '2026-06-05 01:00:00', 'Hadar Pub', 170, 150, 148, 45.00, 'completed', 2),
    (8, 'Stand-up Night', 'Local comedy performers', '2026-08-13 21:00:00', '2026-08-14 00:30:00', 'Hadar Pub', 130, 110, NULL, 55.00, 'planned', 4),
    (9, 'Blues Festival', 'Guest blues bands', '2026-09-17 20:00:00', '2026-09-18 02:00:00', 'Hadar Pub', 190, 160, NULL, 65.00, 'planned', 2),
    (10, 'New Year Celebration', 'End-of-year celebration', '2026-12-31 21:00:00', '2027-01-01 04:00:00', 'Hadar Pub', 240, 220, NULL, 100.00, 'planned', 1);

INSERT INTO product_suppliers
    (id_product_supplier, id_product, id_supplier, supplier_catalog_number,
     supplier_cost, is_preferred_supplier)
VALUES
    (1, 1, 1, 'GB-LAGER-330', 5.00, TRUE),
    (2, 2, 1, 'GB-IPA-330', 6.50, TRUE),
    (3, 3, 2, 'JW-CAB-750', 42.00, TRUE),
    (4, 4, 2, 'JW-CHA-750', 38.00, TRUE),
    (5, 5, 3, 'NS-VOD-700', 55.00, TRUE),
    (6, 6, 3, 'NS-GIN-700', 62.00, TRUE),
    (7, 7, 4, 'CD-COLA-330', 2.50, TRUE),
    (8, 8, 8, 'PWD-SPARK-500', 1.80, TRUE),
    (9, 9, 7, 'MS-PEANUT-100', 4.00, TRUE),
    (10, 10, 6, 'CHS-BEANS-1K', 68.00, TRUE);

INSERT INTO supplier_orders
    (id_order, order_number, id_supplier, created_by, order_date,
     expected_delivery_date, received_date, order_status, total_cost, notes)
VALUES
    (1, 'PO-2026-001', 1, 1, '2026-01-02 10:00:00', '2026-01-05', '2026-01-05 14:00:00', 'received', 500.00, 'Opening stock order'),
    (2, 'PO-2026-002', 2, 2, '2026-01-20 11:00:00', '2026-01-24', '2026-01-24 12:30:00', 'received', 420.00, 'Wine restock'),
    (3, 'PO-2026-003', 3, 1, '2026-02-10 09:30:00', '2026-02-14', '2026-02-14 15:00:00', 'received', 550.00, 'Spirits restock'),
    (4, 'PO-2026-004', 4, 3, '2026-02-25 12:00:00', '2026-02-28', '2026-02-28 13:00:00', 'received', 250.00, 'Soft drinks'),
    (5, 'PO-2026-005', 8, 3, '2026-03-03 10:15:00', '2026-03-06', '2026-03-06 10:00:00', 'received', 180.00, 'Water supply'),
    (6, 'PO-2026-006', 7, 4, '2026-03-15 14:00:00', '2026-03-19', '2026-03-19 16:00:00', 'received', 160.00, 'Snack supply'),
    (7, 'PO-2026-007', 6, 5, '2026-04-01 09:00:00', '2026-04-04', '2026-04-04 11:30:00', 'received', 204.00, 'Coffee beans'),
    (8, 'PO-2026-008', 1, 2, '2026-06-10 10:00:00', '2026-06-13', NULL, 'ordered', 325.00, 'Beer reorder'),
    (9, 'PO-2026-009', 2, 2, '2026-07-01 10:00:00', '2026-07-05', NULL, 'partially_received', 400.00, 'Wine reorder'),
    (10, 'PO-2026-010', 4, 1, '2026-07-20 09:00:00', '2026-07-23', NULL, 'draft', 125.00, 'Draft order');

INSERT INTO supplier_order_items
    (id_order_item, id_order, id_product, quantity_ordered,
     quantity_received, unit_cost)
VALUES
    (1, 1, 1, 50.000, 50.000, 5.00),
    (2, 1, 2, 40.000, 40.000, 6.25),
    (3, 2, 3, 10.000, 10.000, 42.00),
    (4, 3, 5, 10.000, 10.000, 55.00),
    (5, 4, 7, 100.000, 100.000, 2.50),
    (6, 5, 8, 100.000, 100.000, 1.80),
    (7, 6, 9, 40.000, 40.000, 4.00),
    (8, 7, 10, 3.000, 3.000, 68.00),
    (9, 8, 2, 50.000, 0.000, 6.50),
    (10, 9, 4, 10.000, 5.000, 40.00);

INSERT INTO sales_orders
    (id_sale, sale_number, id_event, created_by, customer_name, sale_date,
     sale_status, payment_method, subtotal, discount_amount, total_amount, notes)
VALUES
    (1, 'SALE-2026-001', 1, 3, 'Walk-in customer', '2026-01-10 20:15:00', 'paid', 'credit_card', 0.00, 0.00, 0.00, NULL),
    (2, 'SALE-2026-002', 1, 4, 'Walk-in customer', '2026-01-10 21:05:00', 'paid', 'cash', 0.00, 0.00, 0.00, NULL),
    (3, 'SALE-2026-003', 2, 3, 'Walk-in customer', '2026-02-05 21:20:00', 'paid', 'bit', 0.00, 0.00, 0.00, NULL),
    (4, 'SALE-2026-004', 3, 5, 'Table 4', '2026-03-12 20:00:00', 'paid', 'credit_card', 0.00, 10.00, 0.00, 'Tasting discount'),
    (5, 'SALE-2026-005', 4, 6, 'Walk-in customer', '2026-03-24 22:10:00', 'paid', 'paybox', 0.00, 0.00, 0.00, NULL),
    (6, 'SALE-2026-006', 5, 7, 'Table 2', '2026-04-16 21:00:00', 'paid', 'cash', 0.00, 0.00, 0.00, NULL),
    (7, 'SALE-2026-007', 6, 3, 'Walk-in customer', '2026-04-22 22:00:00', 'paid', 'credit_card', 0.00, 0.00, 0.00, NULL),
    (8, 'SALE-2026-008', 7, 4, 'Table 8', '2026-06-04 21:15:00', 'paid', 'bit', 0.00, 5.00, 0.00, 'Member discount'),
    (9, 'SALE-2026-009', NULL, 5, 'Regular customer', '2026-07-12 20:30:00', 'paid', 'cash', 0.00, 0.00, 0.00, NULL),
    (10, 'SALE-2026-010', NULL, 5, 'Cancelled order', '2026-07-13 19:45:00', 'cancelled', NULL, 0.00, 0.00, 0.00, 'Customer cancelled');

DELIMITER $$

CREATE TRIGGER trg_before_sale_item_insert
BEFORE INSERT ON sales_order_items
FOR EACH ROW
BEGIN
    DECLARE current_stock DECIMAL(10,3);

    SELECT product_stock
    INTO current_stock
    FROM products
    WHERE id_product = NEW.id_product
    FOR UPDATE;

    IF current_stock IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Product does not exist';
    END IF;

    IF current_stock < NEW.quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Not enough product stock';
    END IF;
END$$

CREATE TRIGGER trg_after_sale_item_insert
AFTER INSERT ON sales_order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET product_stock = product_stock - NEW.quantity
    WHERE id_product = NEW.id_product;

    UPDATE sales_orders
    SET
        subtotal = (
            SELECT COALESCE(SUM(line_total), 0)
            FROM sales_order_items
            WHERE id_sale = NEW.id_sale
        ),
        total_amount = GREATEST(
            (
                SELECT COALESCE(SUM(line_total), 0)
                FROM sales_order_items
                WHERE id_sale = NEW.id_sale
            ) - discount_amount,
            0
        )
    WHERE id_sale = NEW.id_sale;
END$$

CREATE TRIGGER trg_after_sale_item_delete
AFTER DELETE ON sales_order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET product_stock = product_stock + OLD.quantity
    WHERE id_product = OLD.id_product;

    UPDATE sales_orders
    SET
        subtotal = (
            SELECT COALESCE(SUM(line_total), 0)
            FROM sales_order_items
            WHERE id_sale = OLD.id_sale
        ),
        total_amount = GREATEST(
            (
                SELECT COALESCE(SUM(line_total), 0)
                FROM sales_order_items
                WHERE id_sale = OLD.id_sale
            ) - discount_amount,
            0
        )
    WHERE id_sale = OLD.id_sale;
END$$

DELIMITER ;

-- Inserting these rows after trigger creation automatically updates product stock
-- and recalculates each sales order subtotal and total.
INSERT INTO sales_order_items
    (id_sale_item, id_sale, id_product, quantity, unit_price)
VALUES
    (1, 1, 1, 3.000, 18.00),
    (2, 2, 7, 4.000, 12.00),
    (3, 3, 2, 2.000, 22.00),
    (4, 4, 3, 1.000, 120.00),
    (5, 5, 5, 1.000, 160.00),
    (6, 6, 8, 3.000, 10.00),
    (7, 7, 6, 1.000, 175.00),
    (8, 8, 9, 2.000, 16.00),
    (9, 9, 4, 1.000, 110.00),
    (10, 10, 7, 1.000, 12.00);

INSERT INTO inventory_movements
    (id_movement, id_product, id_event, created_by, movement_type,
     quantity, stock_before, stock_after, reference_type, reference_id,
     notes, movement_date)
VALUES
    (1, 1, NULL, 1, 'purchase', 50.000, 70.000, 120.000, 'supplier_order', 1, 'Opening beer purchase', '2026-01-05 14:00:00'),
    (2, 1, 1, 3, 'sale', 3.000, 120.000, 117.000, 'sale', 1, 'Opening Night sale', '2026-01-10 20:15:00'),
    (3, 7, 1, 4, 'sale', 4.000, 150.000, 146.000, 'sale', 2, 'Opening Night sale', '2026-01-10 21:05:00'),
    (4, 2, 2, 3, 'sale', 2.000, 90.000, 88.000, 'sale', 3, 'Rock Thursday sale', '2026-02-05 21:20:00'),
    (5, 3, 3, 5, 'sale', 1.000, 36.000, 35.000, 'sale', 4, 'Wine tasting sale', '2026-03-12 20:00:00'),
    (6, 5, 4, 6, 'sale', 1.000, 20.000, 19.000, 'sale', 5, 'Purim Party sale', '2026-03-24 22:10:00'),
    (7, 8, 5, 7, 'sale', 3.000, 100.000, 97.000, 'sale', 6, 'Acoustic Evening sale', '2026-04-16 21:00:00'),
    (8, 6, 6, 3, 'sale', 1.000, 18.000, 17.000, 'sale', 7, 'Independence Party sale', '2026-04-22 22:00:00'),
    (9, 9, 7, 4, 'sale', 2.000, 60.000, 58.000, 'sale', 8, 'Summer Launch sale', '2026-06-04 21:15:00'),
    (10, 4, NULL, 5, 'sale', 1.000, 30.000, 29.000, 'sale', 9, 'Regular bar sale', '2026-07-12 20:30:00');

CREATE VIEW event_sales_summary AS
SELECT
    e.id_event,
    e.event_name,
    e.event_start,
    e.event_status,
    COUNT(DISTINCT so.id_sale) AS total_sales_orders,
    COALESCE(SUM(
        CASE WHEN so.sale_status = 'paid' THEN so.total_amount ELSE 0 END
    ), 0) AS total_revenue,
    COALESCE(SUM(
        CASE WHEN so.sale_status = 'paid' THEN soi.quantity ELSE 0 END
    ), 0) AS total_items_sold
FROM events e
LEFT JOIN sales_orders so ON so.id_event = e.id_event
LEFT JOIN sales_order_items soi ON soi.id_sale = so.id_sale
GROUP BY e.id_event, e.event_name, e.event_start, e.event_status;

CREATE VIEW event_product_sales AS
SELECT
    e.id_event,
    e.event_name,
    p.id_product,
    p.product_name,
    p.catalog_number,
    COALESCE(SUM(soi.quantity), 0) AS quantity_sold,
    COALESCE(SUM(soi.line_total), 0) AS total_sales,
    COALESCE(SUM(soi.quantity * p.product_cost), 0) AS estimated_cost,
    COALESCE(SUM(soi.line_total), 0)
        - COALESCE(SUM(soi.quantity * p.product_cost), 0) AS estimated_profit
FROM events e
JOIN sales_orders so
    ON so.id_event = e.id_event
    AND so.sale_status = 'paid'
JOIN sales_order_items soi ON soi.id_sale = so.id_sale
JOIN products p ON p.id_product = soi.id_product
GROUP BY
    e.id_event, e.event_name, p.id_product, p.product_name, p.catalog_number;
