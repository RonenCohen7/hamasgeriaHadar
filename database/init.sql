-- Hadar Pub - Complete MySQL Initialization Script
-- Customers + VIP cards + VIP transactions + indexes + views + seed data.
-- No triggers: stock changes are handled only by the backend service.
-- Intended for a fresh Docker MySQL volume.

DROP DATABASE IF EXISTS pub_management;
CREATE DATABASE pub_management
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE pub_management;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS vip_card_activity_summary;
DROP VIEW IF EXISTS event_product_sales;
DROP VIEW IF EXISTS event_sales_summary;

DROP TABLE IF EXISTS inventory_movements;
DROP TABLE IF EXISTS vip_card_transactions;
DROP TABLE IF EXISTS sales_order_items;
DROP TABLE IF EXISTS sales_orders;
DROP TABLE IF EXISTS vip_cards;
DROP TABLE IF EXISTS supplier_order_items;
DROP TABLE IF EXISTS supplier_orders;
DROP TABLE IF EXISTS product_suppliers;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- TABLES
-- =========================================================

CREATE TABLE users (
    id_user INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'employee') NOT NULL DEFAULT 'employee',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id_customer INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NULL,
    email VARCHAR(200) NULL,
    date_of_birth DATE NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_customers_phone UNIQUE (phone),
    CONSTRAINT uq_customers_email UNIQUE (email)
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
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    unit_type ENUM('unit','bottle','liter','milliliter','kilogram','gram')
        NOT NULL DEFAULT 'unit',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (id_category)
        REFERENCES product_categories(id_category)
        ON DELETE SET NULL ON UPDATE CASCADE,
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
    event_status ENUM('planned','active','completed','cancelled')
        NOT NULL DEFAULT 'planned',
    created_by INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_user FOREIGN KEY (created_by)
        REFERENCES users(id_user) ON DELETE RESTRICT ON UPDATE CASCADE,
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
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_product_supplier UNIQUE (id_product, id_supplier),
    CONSTRAINT fk_product_suppliers_product FOREIGN KEY (id_product)
        REFERENCES products(id_product) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_product_suppliers_supplier FOREIGN KEY (id_supplier)
        REFERENCES suppliers(id_supplier) ON DELETE CASCADE ON UPDATE CASCADE,
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
    order_status ENUM('draft','ordered','partially_received','received','cancelled')
        NOT NULL DEFAULT 'draft',
    total_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_supplier_orders_supplier FOREIGN KEY (id_supplier)
        REFERENCES suppliers(id_supplier) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_supplier_orders_user FOREIGN KEY (created_by)
        REFERENCES users(id_user) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_supplier_order_total CHECK (total_cost >= 0)
);

CREATE TABLE supplier_order_items (
    id_order_item INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_order INT UNSIGNED NOT NULL,
    id_product INT UNSIGNED NOT NULL,
    quantity_ordered DECIMAL(10,3) NOT NULL,
    quantity_received DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    unit_cost DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_supplier_order_product UNIQUE (id_order, id_product),
    CONSTRAINT fk_supplier_order_items_order FOREIGN KEY (id_order)
        REFERENCES supplier_orders(id_order) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_supplier_order_items_product FOREIGN KEY (id_product)
        REFERENCES products(id_product) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_quantity_ordered CHECK (quantity_ordered > 0),
    CONSTRAINT chk_quantity_received CHECK (quantity_received >= 0),
    CONSTRAINT chk_order_item_cost CHECK (unit_cost >= 0)
);

CREATE TABLE vip_cards (
    id_vip_card INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    card_number VARCHAR(50) NOT NULL UNIQUE,

    id_customer INT UNSIGNED NOT NULL UNIQUE,

    tier ENUM('bronze','silver','gold')
        NOT NULL DEFAULT 'bronze',

    external_card BOOLEAN
        NOT NULL DEFAULT FALSE,

    balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    expires_at DATETIME NULL,

    card_status ENUM('active','blocked','expired','cancelled')
        NOT NULL DEFAULT 'active',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_vip_cards_customer
        FOREIGN KEY (id_customer)
        REFERENCES customers(id_customer)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_vip_card_balance
        CHECK (balance >= 0),

    CONSTRAINT chk_vip_card_expiration
        CHECK (expires_at IS NULL OR expires_at >= issued_at)
);

-- VIP payment validation is enforced in the backend service.
-- MySQL 8 does not allow the id_vip_card FK column to participate in this CHECK
-- while the FK uses ON DELETE SET NULL.

CREATE TABLE sales_orders (
    id_sale INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sale_number VARCHAR(50) NOT NULL UNIQUE,
    id_event INT UNSIGNED NULL,
    id_customer INT UNSIGNED NULL,
    id_vip_card INT UNSIGNED NULL,
    created_by INT UNSIGNED NOT NULL,
    customer_name VARCHAR(150),
    sale_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sale_status ENUM('open','paid','cancelled','refunded') NOT NULL DEFAULT 'open',
    payment_method ENUM('cash','credit_card','bit','pay_box','vip_card','other'),
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sales_orders_event FOREIGN KEY (id_event)
        REFERENCES events(id_event) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_sales_orders_customer FOREIGN KEY (id_customer)
        REFERENCES customers(id_customer) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_sales_orders_vip_card FOREIGN KEY (id_vip_card)
        REFERENCES vip_cards(id_vip_card) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_sales_orders_user FOREIGN KEY (created_by)
        REFERENCES users(id_user) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_sale_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_sale_discount CHECK (discount_amount >= 0),
    CONSTRAINT chk_sale_total CHECK (total_amount >= 0));

CREATE TABLE sales_order_items (
    id_sale_item INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_sale INT UNSIGNED NOT NULL,
    id_product INT UNSIGNED NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sales_order_items_sale FOREIGN KEY (id_sale)
        REFERENCES sales_orders(id_sale) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_sales_order_items_product FOREIGN KEY (id_product)
        REFERENCES products(id_product) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_sale_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_sale_item_price CHECK (unit_price >= 0)
);

CREATE TABLE vip_card_transactions (
    id_vip_transaction BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_vip_card INT UNSIGNED NOT NULL,
    id_sale INT UNSIGNED NULL,
    created_by INT UNSIGNED NOT NULL,
    transaction_type ENUM('load','payment','refund','adjustment') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    balance_before DECIMAL(12,2) NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL,
    notes VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vip_transactions_card FOREIGN KEY (id_vip_card)
        REFERENCES vip_cards(id_vip_card) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_vip_transactions_sale FOREIGN KEY (id_sale)
        REFERENCES sales_orders(id_sale) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_vip_transactions_user FOREIGN KEY (created_by)
        REFERENCES users(id_user) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_vip_transaction_amount CHECK (amount > 0),
    CONSTRAINT chk_vip_balance_before CHECK (balance_before >= 0),
    CONSTRAINT chk_vip_balance_after CHECK (balance_after >= 0)
);

CREATE TABLE inventory_movements (
    id_movement BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_product INT UNSIGNED NOT NULL,
    id_event INT UNSIGNED NULL,
    created_by INT UNSIGNED NOT NULL,
    movement_type ENUM(
        'purchase','sale','event_allocation','event_return','damage',
        'waste','refund','manual_addition','manual_reduction'
    ) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    stock_before DECIMAL(10,3),
    stock_after DECIMAL(10,3),
    reference_type ENUM('supplier_order','sale','event','manual'),
    reference_id BIGINT UNSIGNED,
    notes VARCHAR(500),
    movement_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_movements_product FOREIGN KEY (id_product)
        REFERENCES products(id_product) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_inventory_movements_event FOREIGN KEY (id_event)
        REFERENCES events(id_event) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_inventory_movements_user FOREIGN KEY (created_by)
        REFERENCES users(id_user) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_inventory_movement_quantity CHECK (quantity > 0)
);

-- =========================================================
-- INDEXES
-- =========================================================
CREATE INDEX idx_users_role_active ON users(role, is_active);
CREATE INDEX idx_customers_name ON customers(last_name, first_name);
CREATE INDEX idx_customers_active ON customers(is_active);
CREATE INDEX idx_products_category_active ON products(id_category, is_active);
CREATE INDEX idx_products_stock ON products(product_stock, minimum_stock);
CREATE INDEX idx_events_status_start ON events(event_status, event_start);
CREATE INDEX idx_product_suppliers_supplier ON product_suppliers(id_supplier);
CREATE INDEX idx_supplier_orders_status_date ON supplier_orders(order_status, order_date);
CREATE INDEX idx_supplier_order_items_product ON supplier_order_items(id_product);
CREATE INDEX idx_vip_cards_customer ON vip_cards(id_customer);
CREATE INDEX idx_vip_cards_status_expiry ON vip_cards(card_status, expires_at);
CREATE INDEX idx_vip_cards_tier_status ON vip_cards(tier, card_status);
CREATE INDEX idx_sales_date_status ON sales_orders(sale_date, sale_status);
CREATE INDEX idx_sales_customer ON sales_orders(id_customer);
CREATE INDEX idx_sales_vip_card ON sales_orders(id_vip_card);
CREATE INDEX idx_sales_event ON sales_orders(id_event);
CREATE INDEX idx_sale_items_product ON sales_order_items(id_product);
CREATE INDEX idx_vip_transactions_card_date ON vip_card_transactions(id_vip_card, created_at);
CREATE INDEX idx_vip_transactions_sale ON vip_card_transactions(id_sale);
CREATE INDEX idx_inventory_product_date ON inventory_movements(id_product, movement_date);
CREATE INDEX idx_inventory_reference ON inventory_movements(reference_type, reference_id);

INSERT INTO users (id_user, first_name, last_name, email, password, role, is_active) VALUES
    (1, 'Ronen', 'Cohen', 'ronen@hadarpub.local', 'ChangeMe123!', 'admin', TRUE),
    (2, 'Hadar', 'Levi', 'hadar@hadarpub.local', 'ChangeMe123!', 'manager', TRUE),
    (3, 'Noa', 'Mizrahi', 'noa@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (4, 'Daniel', 'Katz', 'daniel@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (5, 'Maya', 'Peretz', 'maya@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (6, 'Yoni', 'Bar', 'yoni@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (7, 'Shira', 'Dagan', 'shira@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (8, 'Amit', 'Tal', 'amit@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (9, 'Lior', 'Shalev', 'lior@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (10, 'Dana', 'Mor', 'dana@hadarpub.local', 'ChangeMe123!', 'employee', FALSE),
    (11, 'Eli', 'Navon', 'eli@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (12, 'Yael', 'Ravid', 'yael@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (13, 'Omer', 'Golan', 'omer@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (14, 'Tal', 'Shamir', 'tal@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (15, 'Niv', 'Raz', 'niv@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (16, 'Rina', 'Adler', 'rina@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (17, 'Guy', 'Peled', 'guy@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (18, 'Michal', 'Saar', 'michal@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (19, 'Avi', 'Koren', 'avi@hadarpub.local', 'ChangeMe123!', 'employee', TRUE),
    (20, 'Neta', 'Lavi', 'neta@hadarpub.local', 'ChangeMe123!', 'employee', TRUE);

INSERT INTO customers (id_customer, first_name, last_name, phone, email, date_of_birth, is_active) VALUES
    (1, 'David', 'Levi', '050-8000001', 'david.levi@example.local', '1979-02-02', TRUE),
    (2, 'Noa', 'Cohen', '050-8000002', 'noa.cohen@example.local', '1980-03-03', TRUE),
    (3, 'Amit', 'Bar', '050-8000003', 'amit.bar@example.local', NULL, TRUE),
    (4, 'Sharon', 'Tal', '050-8000004', 'sharon.tal@example.local', '1982-05-05', TRUE),
    (5, 'Eyal', 'Shalev', '050-8000005', 'eyal.shalev@example.local', '1983-06-06', TRUE),
    (6, 'Liat', 'Mor', '050-8000006', 'liat.mor@example.local', '1984-07-07', TRUE),
    (7, 'Nir', 'Peled', '050-8000007', 'nir.peled@example.local', '1985-08-08', TRUE),
    (8, 'Dana', 'Raz', '050-8000008', 'dana.raz@example.local', '1986-09-09', TRUE),
    (9, 'Oren', 'Golan', '050-8000009', 'oren.golan@example.local', NULL, TRUE),
    (10, 'Maya', 'Koren', '050-8000010', 'maya.koren@example.local', '1988-11-11', TRUE),
    (11, 'Gil', 'Navon', '050-8000011', 'gil.navon@example.local', '1989-12-12', TRUE),
    (12, 'Yael', 'Saar', '050-8000012', 'yael.saar@example.local', '1990-01-13', TRUE),
    (13, 'Roi', 'Ravid', '050-8000013', 'roi.ravid@example.local', '1991-02-14', TRUE),
    (14, 'Michal', 'Adler', '050-8000014', 'michal.adler@example.local', '1992-03-15', TRUE),
    (15, 'Tal', 'Dagan', '050-8000015', 'tal.dagan@example.local', NULL, TRUE),
    (16, 'Neta', 'Shamir', '050-8000016', 'neta.shamir@example.local', '1994-05-17', TRUE),
    (17, 'Avi', 'Katz', '050-8000017', 'avi.katz@example.local', '1995-06-18', TRUE),
    (18, 'Rina', 'Lavi', '050-8000018', 'rina.lavi@example.local', '1996-07-19', TRUE),
    (19, 'Omer', 'Peretz', '050-8000019', 'omer.peretz@example.local', '1997-08-20', TRUE),
    (20, 'Shira', 'Mizrahi', '050-8000020', 'shira.mizrahi@example.local', '1998-09-21', FALSE);

INSERT INTO product_categories (id_category, category_name, description) VALUES
    (1,'Beer','Bottled and draft beer'),
    (2,'Wine','Red, white and sparkling wine'),
    (3,'Spirits','Whisky, vodka, gin and other spirits'),
    (4,'Cocktails','Prepared cocktail products'),
    (5,'Soft Drinks','Carbonated and non-carbonated drinks'),
    (6,'Water','Still and sparkling water'),
    (7,'Snacks','Bar snacks and light food'),
    (8,'Coffee','Coffee and hot beverages'),
    (9,'Kitchen','Kitchen ingredients'),
    (10,'Supplies','Disposable and operational supplies');

INSERT INTO suppliers (id_supplier, supplier_name, supplier_email, supplier_mobile, supplier_address, is_active) VALUES
    (1, 'Galil Beverages', 'sales@galilbeverages.local', '050-7000001', 'Haifa, Israel', TRUE),
    (2, 'Jerusalem Winery', 'sales@jerusalemwinery.local', '050-7000002', 'Jerusalem, Israel', TRUE),
    (3, 'Negev Spirits', 'sales@negevspirits.local', '050-7000003', 'Beer Sheva, Israel', TRUE),
    (4, 'Central Drinks', 'sales@centraldrinks.local', '050-7000004', 'Tel Aviv, Israel', TRUE),
    (5, 'Fresh Bar Supply', 'sales@freshbarsupply.local', '050-7000005', 'Rishon LeZion, Israel', TRUE),
    (6, 'Coffee House Supply', 'sales@coffeehousesupply.local', '050-7000006', 'Petah Tikva, Israel', TRUE),
    (7, 'Mediterranean Snacks', 'sales@mediterraneansnacks.local', '050-7000007', 'Ashdod, Israel', TRUE),
    (8, 'Pure Water Distribution', 'sales@purewaterdistribution.local', '050-7000008', 'Netanya, Israel', TRUE),
    (9, 'Kitchen Pro', 'sales@kitchenpro.local', '050-7000009', 'Holon, Israel', TRUE),
    (10, 'Pub Essentials', 'sales@pubessentials.local', '050-7000010', 'Herzliya, Israel', TRUE),
    (11, 'North Coast Beer', 'sales@northcoastbeer.local', '050-7000011', 'Akko, Israel', TRUE),
    (12, 'Carmel Wine Trade', 'sales@carmelwinetrade.local', '050-7000012', 'Zichron Yaakov, Israel', TRUE),
    (13, 'Urban Mixers', 'sales@urbanmixers.local', '050-7000013', 'Tel Aviv, Israel', TRUE),
    (14, 'Premium Ice', 'sales@premiumice.local', '050-7000014', 'Ramat Gan, Israel', TRUE),
    (15, 'Green Kitchen', 'sales@greenkitchen.local', '050-7000015', 'Kfar Saba, Israel', TRUE),
    (16, 'Disposable World', 'sales@disposableworld.local', '050-7000016', 'Bat Yam, Israel', TRUE),
    (17, 'Desert Coffee', 'sales@desertcoffee.local', '050-7000017', 'Arad, Israel', TRUE),
    (18, 'Valley Snacks', 'sales@valleysnacks.local', '050-7000018', 'Afula, Israel', TRUE),
    (19, 'Sea Water Supply', 'sales@seawatersupply.local', '050-7000019', 'Hadera, Israel', TRUE),
    (20, 'Old City Spirits', 'sales@oldcityspirits.local', '050-7000020', 'Jerusalem, Israel', FALSE);

INSERT INTO products (id_product, product_name, image_name, catalog_number, id_category, product_cost, product_price, product_stock, minimum_stock, unit_type, is_active) VALUES
    (1, 'Gold Lager 330ml', NULL, 'BEER-001', 1, 5.00, 18.00, 120.000, 24.000, 'bottle', TRUE),
    (2, 'IPA 330ml', NULL, 'BEER-002', 1, 6.50, 22.00, 90.000, 18.000, 'bottle', TRUE),
    (3, 'Cabernet Sauvignon', NULL, 'WINE-001', 2, 42.00, 120.00, 36.000, 8.000, 'bottle', TRUE),
    (4, 'Chardonnay', NULL, 'WINE-002', 2, 38.00, 110.00, 30.000, 8.000, 'bottle', TRUE),
    (5, 'Premium Vodka 700ml', NULL, 'SPIRIT-001', 3, 55.00, 160.00, 20.000, 5.000, 'bottle', TRUE),
    (6, 'London Dry Gin 700ml', NULL, 'SPIRIT-002', 3, 62.00, 175.00, 18.000, 5.000, 'bottle', TRUE),
    (7, 'Cola 330ml', NULL, 'SOFT-001', 5, 2.50, 12.00, 150.000, 30.000, 'bottle', TRUE),
    (8, 'Sparkling Water 500ml', NULL, 'WATER-001', 6, 1.80, 10.00, 100.000, 20.000, 'bottle', TRUE),
    (9, 'Salted Peanuts 100g', NULL, 'SNACK-001', 7, 4.00, 16.00, 60.000, 12.000, 'unit', TRUE),
    (10, 'Espresso Coffee Beans', NULL, 'COFFEE-001', 8, 68.00, 95.00, 12.000, 3.000, 'kilogram', TRUE),
    (11, 'Black Beer 330ml', NULL, 'BEER-003', 1, 5.50, 20.00, 80.000, 16.000, 'bottle', TRUE),
    (12, 'Merlot Reserve', NULL, 'WINE-003', 2, 45.00, 130.00, 25.000, 6.000, 'bottle', TRUE),
    (13, 'Whisky 700ml', NULL, 'SPIRIT-003', 3, 78.00, 210.00, 15.000, 4.000, 'bottle', TRUE),
    (14, 'Classic Mojito Mix', NULL, 'COCKTAIL-001', 4, 12.00, 38.00, 40.000, 10.000, 'bottle', TRUE),
    (15, 'Orange Soda 330ml', NULL, 'SOFT-002', 5, 2.30, 12.00, 110.000, 25.000, 'bottle', TRUE),
    (16, 'Still Water 500ml', NULL, 'WATER-002', 6, 1.50, 9.00, 130.000, 25.000, 'bottle', TRUE),
    (17, 'Nachos 150g', NULL, 'SNACK-002', 7, 5.00, 20.00, 55.000, 12.000, 'unit', TRUE),
    (18, 'Ground Coffee 1kg', NULL, 'COFFEE-002', 8, 55.00, 88.00, 10.000, 3.000, 'kilogram', TRUE),
    (19, 'Burger Bun Pack', NULL, 'KITCHEN-001', 9, 18.00, 0.00, 25.000, 8.000, 'unit', TRUE),
    (20, 'Paper Cups Pack', NULL, 'SUPPLY-001', 10, 14.00, 0.00, 35.000, 10.000, 'unit', TRUE);

INSERT INTO events (id_event,event_name,event_description,event_start,event_end,event_location,maximum_guests,expected_guests,actual_guests,ticket_price,event_status,created_by) VALUES
    (1, 'Opening Night', 'Opening Night at Hadar Pub', '2026-01-10 20:00:00', '2026-01-11 01:00:00', 'Hadar Pub', 105, 84, 73, 23.00, 'completed', 2),
    (2, 'Rock Thursday', 'Rock Thursday at Hadar Pub', '2026-01-24 20:00:00', '2026-01-25 01:00:00', 'Hadar Pub', 110, 88, 76, 26.00, 'completed', 3),
    (3, 'Wine Tasting', 'Wine Tasting at Hadar Pub', '2026-02-07 20:00:00', '2026-02-08 01:00:00', 'Hadar Pub', 115, 92, 79, 29.00, 'completed', 4),
    (4, 'Purim Party', 'Purim Party at Hadar Pub', '2026-02-21 20:00:00', '2026-02-22 01:00:00', 'Hadar Pub', 120, 96, 82, 32.00, 'completed', 5),
    (5, 'Acoustic Evening', 'Acoustic Evening at Hadar Pub', '2026-03-07 20:00:00', '2026-03-08 01:00:00', 'Hadar Pub', 125, 100, 85, 35.00, 'completed', 6),
    (6, 'Independence Party', 'Independence Party at Hadar Pub', '2026-03-21 20:00:00', '2026-03-22 01:00:00', 'Hadar Pub', 130, 104, 88, 38.00, 'completed', 7),
    (7, 'Summer Launch', 'Summer Launch at Hadar Pub', '2026-04-04 20:00:00', '2026-04-05 01:00:00', 'Hadar Pub', 135, 108, 91, 41.00, 'completed', 8),
    (8, 'Stand-up Night', 'Stand-up Night at Hadar Pub', '2026-04-18 20:00:00', '2026-04-19 01:00:00', 'Hadar Pub', 140, 112, 94, 44.00, 'completed', 1),
    (9, 'Blues Festival', 'Blues Festival at Hadar Pub', '2026-05-02 20:00:00', '2026-05-03 01:00:00', 'Hadar Pub', 145, 116, 97, 47.00, 'completed', 2),
    (10, 'New Year Celebration', 'New Year Celebration at Hadar Pub', '2026-05-16 20:00:00', '2026-05-17 01:00:00', 'Hadar Pub', 150, 120, 100, 50.00, 'completed', 3),
    (11, 'Jazz Monday', 'Jazz Monday at Hadar Pub', '2026-05-30 20:00:00', '2026-05-31 01:00:00', 'Hadar Pub', 155, 124, 103, 53.00, 'completed', 4),
    (12, 'Latin Night', 'Latin Night at Hadar Pub', '2026-06-13 20:00:00', '2026-06-14 01:00:00', 'Hadar Pub', 160, 128, 106, 56.00, 'completed', 5),
    (13, 'Comedy Wednesday', 'Comedy Wednesday at Hadar Pub', '2026-06-27 20:00:00', '2026-06-28 01:00:00', 'Hadar Pub', 165, 132, 109, 59.00, 'completed', 6),
    (14, 'Craft Beer Night', 'Craft Beer Night at Hadar Pub', '2026-07-11 20:00:00', '2026-07-12 01:00:00', 'Hadar Pub', 170, 136, 112, 62.00, 'completed', 7),
    (15, 'DJ Friday', 'DJ Friday at Hadar Pub', '2026-07-25 20:00:00', '2026-07-26 01:00:00', 'Hadar Pub', 175, 140, 115, 65.00, 'completed', 8),
    (16, 'Trivia Night', 'Trivia Night at Hadar Pub', '2026-08-08 20:00:00', '2026-08-09 01:00:00', 'Hadar Pub', 180, 144, 118, 68.00, 'completed', 1),
    (17, 'Karaoke Night', 'Karaoke Night at Hadar Pub', '2026-08-22 20:00:00', '2026-08-23 01:00:00', 'Hadar Pub', 185, 148, NULL, 71.00, 'planned', 2),
    (18, 'Autumn Party', 'Autumn Party at Hadar Pub', '2026-09-05 20:00:00', '2026-09-06 01:00:00', 'Hadar Pub', 190, 152, NULL, 74.00, 'planned', 3),
    (19, 'Halloween Party', 'Halloween Party at Hadar Pub', '2026-09-19 20:00:00', '2026-09-20 01:00:00', 'Hadar Pub', 195, 156, NULL, 77.00, 'planned', 4),
    (20, 'Winter Opening', 'Winter Opening at Hadar Pub', '2026-10-03 20:00:00', '2026-10-04 01:00:00', 'Hadar Pub', 200, 160, NULL, 80.00, 'planned', 5);

INSERT INTO product_suppliers (id_product_supplier,id_product,id_supplier,supplier_catalog_number,supplier_cost,is_preferred_supplier) VALUES
    (1, 1, 1, 'SUP-001', 5.00, TRUE),
    (2, 2, 2, 'SUP-002', 6.50, TRUE),
    (3, 3, 3, 'SUP-003', 42.00, TRUE),
    (4, 4, 4, 'SUP-004', 38.00, TRUE),
    (5, 5, 5, 'SUP-005', 55.00, TRUE),
    (6, 6, 6, 'SUP-006', 62.00, TRUE),
    (7, 7, 7, 'SUP-007', 2.50, TRUE),
    (8, 8, 8, 'SUP-008', 1.80, TRUE),
    (9, 9, 9, 'SUP-009', 4.00, TRUE),
    (10, 10, 10, 'SUP-010', 68.00, TRUE),
    (11, 11, 11, 'SUP-011', 5.50, TRUE),
    (12, 12, 12, 'SUP-012', 45.00, TRUE),
    (13, 13, 13, 'SUP-013', 78.00, TRUE),
    (14, 14, 14, 'SUP-014', 12.00, TRUE),
    (15, 15, 15, 'SUP-015', 2.30, TRUE),
    (16, 16, 16, 'SUP-016', 1.50, TRUE),
    (17, 17, 17, 'SUP-017', 5.00, TRUE),
    (18, 18, 18, 'SUP-018', 55.00, TRUE),
    (19, 19, 19, 'SUP-019', 18.00, TRUE),
    (20, 20, 20, 'SUP-020', 14.00, TRUE);

INSERT INTO supplier_orders (id_order,order_number,id_supplier,created_by,order_date,expected_delivery_date,received_date,order_status,total_cost,notes) VALUES
    (1, 'PO-2026-001', 1, 2, '2026-01-01 10:00:00', '2026-01-05', '2026-01-05 12:00:00', 'received', 55.00, 'Seed supplier order 1'),
    (2, 'PO-2026-002', 2, 3, '2026-02-01 10:00:00', '2026-02-06', '2026-02-06 12:00:00', 'received', 78.00, 'Seed supplier order 2'),
    (3, 'PO-2026-003', 3, 4, '2026-03-01 10:00:00', '2026-03-07', '2026-03-07 12:00:00', 'received', 546.00, 'Seed supplier order 3'),
    (4, 'PO-2026-004', 4, 5, '2026-04-01 10:00:00', '2026-04-08', '2026-04-08 12:00:00', 'received', 532.00, 'Seed supplier order 4'),
    (5, 'PO-2026-005', 5, 1, '2026-05-01 10:00:00', '2026-05-09', '2026-05-09 12:00:00', 'received', 825.00, 'Seed supplier order 5'),
    (6, 'PO-2026-006', 6, 2, '2026-06-01 10:00:00', '2026-06-10', '2026-06-10 12:00:00', 'received', 992.00, 'Seed supplier order 6'),
    (7, 'PO-2026-007', 7, 3, '2026-01-01 10:00:00', '2026-01-11', '2026-01-11 12:00:00', 'received', 42.50, 'Seed supplier order 7'),
    (8, 'PO-2026-008', 8, 4, '2026-02-01 10:00:00', '2026-02-12', '2026-02-12 12:00:00', 'received', 32.40, 'Seed supplier order 8'),
    (9, 'PO-2026-009', 9, 5, '2026-03-01 10:00:00', '2026-03-13', '2026-03-13 12:00:00', 'received', 76.00, 'Seed supplier order 9'),
    (10, 'PO-2026-010', 10, 1, '2026-04-01 10:00:00', '2026-04-14', '2026-04-14 12:00:00', 'received', 1360.00, 'Seed supplier order 10'),
    (11, 'PO-2026-011', 11, 2, '2026-05-01 10:00:00', '2026-05-15', '2026-05-15 12:00:00', 'received', 115.50, 'Seed supplier order 11'),
    (12, 'PO-2026-012', 12, 3, '2026-06-01 10:00:00', '2026-06-16', '2026-06-16 12:00:00', 'received', 990.00, 'Seed supplier order 12'),
    (13, 'PO-2026-013', 13, 4, '2026-01-01 10:00:00', '2026-01-17', '2026-01-17 12:00:00', 'received', 1794.00, 'Seed supplier order 13'),
    (14, 'PO-2026-014', 14, 5, '2026-02-01 10:00:00', '2026-02-18', '2026-02-18 12:00:00', 'received', 288.00, 'Seed supplier order 14'),
    (15, 'PO-2026-015', 15, 1, '2026-03-01 10:00:00', '2026-03-19', '2026-03-19 12:00:00', 'received', 57.50, 'Seed supplier order 15'),
    (16, 'PO-2026-016', 16, 2, '2026-04-01 10:00:00', '2026-04-20', '2026-04-20 12:00:00', 'received', 39.00, 'Seed supplier order 16'),
    (17, 'PO-2026-017', 17, 3, '2026-05-01 10:00:00', '2026-05-21', '2026-05-21 12:00:00', 'received', 135.00, 'Seed supplier order 17'),
    (18, 'PO-2026-018', 18, 4, '2026-06-01 10:00:00', '2026-06-22', NULL, 'ordered', 1540.00, 'Seed supplier order 18'),
    (19, 'PO-2026-019', 19, 5, '2026-01-01 10:00:00', '2026-01-23', NULL, 'partially_received', 522.00, 'Seed supplier order 19'),
    (20, 'PO-2026-020', 20, 1, '2026-02-01 10:00:00', '2026-02-24', NULL, 'draft', 420.00, 'Seed supplier order 20');

INSERT INTO supplier_order_items (id_order_item,id_order,id_product,quantity_ordered,quantity_received,unit_cost) VALUES
    (1, 1, 1, 11.000, 11.000, 5.00),
    (2, 2, 2, 12.000, 12.000, 6.50),
    (3, 3, 3, 13.000, 13.000, 42.00),
    (4, 4, 4, 14.000, 14.000, 38.00),
    (5, 5, 5, 15.000, 15.000, 55.00),
    (6, 6, 6, 16.000, 16.000, 62.00),
    (7, 7, 7, 17.000, 17.000, 2.50),
    (8, 8, 8, 18.000, 18.000, 1.80),
    (9, 9, 9, 19.000, 19.000, 4.00),
    (10, 10, 10, 20.000, 20.000, 68.00),
    (11, 11, 11, 21.000, 21.000, 5.50),
    (12, 12, 12, 22.000, 22.000, 45.00),
    (13, 13, 13, 23.000, 23.000, 78.00),
    (14, 14, 14, 24.000, 24.000, 12.00),
    (15, 15, 15, 25.000, 25.000, 2.30),
    (16, 16, 16, 26.000, 26.000, 1.50),
    (17, 17, 17, 27.000, 27.000, 5.00),
    (18, 18, 18, 28.000, 0.000, 55.00),
    (19, 19, 19, 29.000, 14.000, 18.00),
    (20, 20, 20, 30.000, 0.000, 14.00);

INSERT INTO vip_cards (
    id_vip_card,
    card_number,
    id_customer,
    tier,
    external_card,
    balance,
    issued_at,
    expires_at,
    card_status
) VALUES
    (1, 'VIP-2026-000001', 1, 'bronze', FALSE, 500.00, '2026-01-01 10:00:00', '2027-01-01 23:59:59', 'active'),
    (2, 'VIP-2026-000002', 2, 'bronze', FALSE, 250.00, '2026-01-02 10:00:00', '2027-01-02 23:59:59', 'active'),
    (3, 'VIP-2026-000003', 3, 'bronze', FALSE, 320.00, '2026-01-03 10:00:00', '2027-01-03 23:59:59', 'active'),
    (4, 'VIP-2026-000004', 4, 'bronze', FALSE, 150.00, '2026-01-04 10:00:00', '2027-01-04 23:59:59', 'active'),
    (5, 'VIP-2026-000005', 5, 'bronze', FALSE, 700.00, '2026-01-05 10:00:00', '2027-01-05 23:59:59', 'active'),
    (6, 'VIP-2026-000006', 6, 'bronze', FALSE, 85.00, '2026-01-06 10:00:00', '2027-01-06 23:59:59', 'active'),
    (7, 'VIP-2026-000007', 7, 'bronze', FALSE, 430.00, '2026-01-07 10:00:00', '2027-01-07 23:59:59', 'active'),
    (8, 'VIP-2026-000008', 8, 'bronze', FALSE, 275.00, '2026-01-08 10:00:00', '2027-01-08 23:59:59', 'active'),
    (9, 'VIP-2026-000009', 9, 'bronze', FALSE, 90.00, '2026-01-09 10:00:00', '2027-01-09 23:59:59', 'active'),
    (10, 'VIP-2026-000010', 10, 'bronze', FALSE, 610.00, '2026-01-10 10:00:00', '2027-01-10 23:59:59', 'active'),
    (11, 'VIP-2026-000011', 11, 'bronze', FALSE, 350.00, '2026-01-11 10:00:00', '2027-01-11 23:59:59', 'active'),
    (12, 'VIP-2026-000012', 12, 'bronze', FALSE, 225.00, '2026-01-12 10:00:00', '2027-01-12 23:59:59', 'active'),
    (13, 'VIP-2026-000013', 13, 'bronze', FALSE, 480.00, '2026-01-13 10:00:00', '2027-01-13 23:59:59', 'active'),
    (14, 'VIP-2026-000014', 14, 'bronze', FALSE, 130.00, '2026-01-14 10:00:00', '2027-01-14 23:59:59', 'active'),
    (15, 'VIP-2026-000015', 15, 'bronze', FALSE, 540.00, '2026-01-15 10:00:00', '2027-01-15 23:59:59', 'active'),
    (16, 'VIP-2026-000016', 16, 'bronze', FALSE, 65.00, '2026-01-16 10:00:00', '2027-01-16 23:59:59', 'active'),
    (17, 'VIP-2026-000017', 17, 'bronze', FALSE, 390.00, '2026-01-17 10:00:00', '2027-01-17 23:59:59', 'active'),
    (18, 'VIP-2026-000018', 18, 'bronze', FALSE, 180.00, '2026-01-18 10:00:00', '2027-01-18 23:59:59', 'blocked'),
    (19, 'VIP-2026-000019', 19, 'bronze', FALSE, 260.00, '2026-01-19 10:00:00', '2027-01-19 23:59:59', 'expired'),
    (20, 'VIP-2026-000020', 20, 'bronze', FALSE, 0.00, '2026-01-20 10:00:00', NULL, 'cancelled');

INSERT INTO sales_orders (id_sale,sale_number,id_event,id_customer,id_vip_card,created_by,customer_name,sale_date,sale_status,payment_method,subtotal,discount_amount,total_amount,notes) VALUES
    (1, 'SALE-2026-001', 1, NULL, NULL, 2, 'Customer 1', '2026-01-01 20:00:00', 'paid', 'credit_card', 54.00, 0.00, 54.00, 'Seed sale 1'),
    (2, 'SALE-2026-002', 2, NULL, NULL, 3, 'Customer 2', '2026-02-02 20:00:00', 'paid', 'cash', 22.00, 0.00, 22.00, 'Seed sale 2'),
    (3, 'SALE-2026-003', 3, NULL, NULL, 4, 'Customer 3', '2026-03-03 20:00:00', 'paid', 'bit', 120.00, 0.00, 120.00, 'Seed sale 3'),
    (4, 'SALE-2026-004', 4, 4, NULL, 5, 'Customer 4', '2026-04-04 20:00:00', 'paid', 'credit_card', 110.00, 10.00, 100.00, 'Seed sale 4'),
    (5, 'SALE-2026-005', 5, 5, NULL, 6, 'Customer 5', '2026-05-05 20:00:00', 'paid', 'pay_box', 160.00, 0.00, 160.00, 'Seed sale 5'),
    (6, 'SALE-2026-006', 6, NULL, NULL, 7, 'Customer 6', '2026-06-06 20:00:00', 'paid', 'cash', 175.00, 0.00, 175.00, 'Seed sale 6'),
    (7, 'SALE-2026-007', 7, NULL, NULL, 8, 'Customer 7', '2026-07-07 20:00:00', 'paid', 'credit_card', 12.00, 0.00, 12.00, 'Seed sale 7'),
    (8, 'SALE-2026-008', 8, 8, NULL, 9, 'Customer 8', '2026-01-08 20:00:00', 'paid', 'bit', 10.00, 0.00, 10.00, 'Seed sale 8'),
    (9, 'SALE-2026-009', 9, 9, 9, 10, 'Customer 9', '2026-02-09 20:00:00', 'paid', 'vip_card', 16.00, 0.00, 16.00, 'Seed sale 9'),
    (10, 'SALE-2026-010', 10, NULL, NULL, 1, 'Customer 10', '2026-03-10 20:00:00', 'cancelled', NULL, 95.00, 0.00, 95.00, 'Seed sale 10'),
    (11, 'SALE-2026-011', 11, 11, 11, 2, 'Customer 11', '2026-04-11 20:00:00', 'paid', 'vip_card', 20.00, 0.00, 20.00, 'Seed sale 11'),
    (12, 'SALE-2026-012', 12, NULL, NULL, 3, 'Customer 12', '2026-05-12 20:00:00', 'paid', 'cash', 130.00, 0.00, 130.00, 'Seed sale 12'),
    (13, 'SALE-2026-013', 13, 13, NULL, 4, 'Customer 13', '2026-06-13 20:00:00', 'paid', 'credit_card', 210.00, 0.00, 210.00, 'Seed sale 13'),
    (14, 'SALE-2026-014', 14, 14, 14, 5, 'Customer 14', '2026-07-14 20:00:00', 'paid', 'vip_card', 38.00, 0.00, 38.00, 'Seed sale 14'),
    (15, 'SALE-2026-015', 15, NULL, NULL, 6, 'Customer 15', '2026-01-15 20:00:00', 'paid', 'pay_box', 12.00, 0.00, 12.00, 'Seed sale 15'),
    (16, 'SALE-2026-016', 16, 16, NULL, 7, 'Customer 16', '2026-02-16 20:00:00', 'paid', 'bit', 9.00, 0.00, 9.00, 'Seed sale 16'),
    (17, 'SALE-2026-017', NULL, 17, 17, 8, 'Customer 17', '2026-03-17 20:00:00', 'paid', 'vip_card', 20.00, 0.00, 20.00, 'Seed sale 17'),
    (18, 'SALE-2026-018', NULL, NULL, NULL, 9, 'Customer 18', '2026-04-18 20:00:00', 'paid', 'cash', 88.00, 0.00, 88.00, 'Seed sale 18'),
    (19, 'SALE-2026-019', NULL, 19, NULL, 10, 'Customer 19', '2026-05-19 20:00:00', 'paid', 'credit_card', 0.00, 10.00, 0.00, 'Seed sale 19'),
    (20, 'SALE-2026-020', NULL, 20, 20, 1, 'Customer 20', '2026-06-20 20:00:00', 'paid', 'vip_card', 0.00, 0.00, 0.00, 'Seed sale 20');

INSERT INTO sales_order_items (id_sale_item,id_sale,id_product,quantity,unit_price) VALUES
    (1, 1, 1, 3.000, 18.00),
    (2, 2, 2, 1.000, 22.00),
    (3, 3, 3, 1.000, 120.00),
    (4, 4, 4, 1.000, 110.00),
    (5, 5, 5, 1.000, 160.00),
    (6, 6, 6, 1.000, 175.00),
    (7, 7, 7, 1.000, 12.00),
    (8, 8, 8, 1.000, 10.00),
    (9, 9, 9, 1.000, 16.00),
    (10, 10, 10, 1.000, 95.00),
    (11, 11, 11, 1.000, 20.00),
    (12, 12, 12, 1.000, 130.00),
    (13, 13, 13, 1.000, 210.00),
    (14, 14, 14, 1.000, 38.00),
    (15, 15, 15, 1.000, 12.00),
    (16, 16, 16, 1.000, 9.00),
    (17, 17, 17, 1.000, 20.00),
    (18, 18, 18, 1.000, 88.00),
    (19, 19, 19, 1.000, 0.00),
    (20, 20, 20, 1.000, 0.00);

INSERT INTO vip_card_transactions (id_vip_transaction,id_vip_card,id_sale,created_by,transaction_type,amount,balance_before,balance_after,notes,created_at) VALUES
    (1, 1, NULL, 1, 'load', 500.00, 0.00, 500.00, 'Initial VIP card load', '2026-01-01 10:00:00'),
    (2, 2, NULL, 1, 'load', 250.00, 0.00, 250.00, 'Initial VIP card load', '2026-01-02 10:00:00'),
    (3, 3, NULL, 1, 'load', 320.00, 0.00, 320.00, 'Initial VIP card load', '2026-01-03 10:00:00'),
    (4, 4, NULL, 1, 'load', 150.00, 0.00, 150.00, 'Initial VIP card load', '2026-01-04 10:00:00'),
    (5, 5, NULL, 1, 'load', 700.00, 0.00, 700.00, 'Initial VIP card load', '2026-01-05 10:00:00'),
    (6, 6, NULL, 1, 'load', 85.00, 0.00, 85.00, 'Initial VIP card load', '2026-01-06 10:00:00'),
    (7, 7, NULL, 1, 'load', 430.00, 0.00, 430.00, 'Initial VIP card load', '2026-01-07 10:00:00'),
    (8, 8, NULL, 1, 'load', 275.00, 0.00, 275.00, 'Initial VIP card load', '2026-01-08 10:00:00'),
    (9, 9, NULL, 1, 'load', 90.00, 0.00, 90.00, 'Initial VIP card load', '2026-01-09 10:00:00'),
    (10, 10, NULL, 1, 'load', 610.00, 0.00, 610.00, 'Initial VIP card load', '2026-01-10 10:00:00'),
    (11, 11, NULL, 1, 'load', 350.00, 0.00, 350.00, 'Initial VIP card load', '2026-01-11 10:00:00'),
    (12, 12, NULL, 1, 'load', 225.00, 0.00, 225.00, 'Initial VIP card load', '2026-01-12 10:00:00'),
    (13, 13, NULL, 1, 'load', 480.00, 0.00, 480.00, 'Initial VIP card load', '2026-01-13 10:00:00'),
    (14, 14, NULL, 1, 'load', 130.00, 0.00, 130.00, 'Initial VIP card load', '2026-01-14 10:00:00'),
    (15, 15, NULL, 1, 'load', 540.00, 0.00, 540.00, 'Initial VIP card load', '2026-01-15 10:00:00'),
    (16, 16, NULL, 1, 'load', 65.00, 0.00, 65.00, 'Initial VIP card load', '2026-01-16 10:00:00'),
    (17, 17, NULL, 1, 'load', 390.00, 0.00, 390.00, 'Initial VIP card load', '2026-01-17 10:00:00'),
    (18, 18, NULL, 1, 'load', 180.00, 0.00, 180.00, 'Initial VIP card load', '2026-01-18 10:00:00'),
    (19, 19, NULL, 1, 'load', 260.00, 0.00, 260.00, 'Initial VIP card load', '2026-01-19 10:00:00'),
    (20, 20, NULL, 1, 'load', 1.00, 0.00, 0.00, 'Initial VIP card load', '2026-01-20 10:00:00');

INSERT INTO inventory_movements (id_movement,id_product,id_event,created_by,movement_type,quantity,stock_before,stock_after,reference_type,reference_id,notes,movement_date) VALUES
    (1, 1, NULL, 1, 'purchase', 11.000, 109.000, 120.000, 'supplier_order', 1, 'Seed inventory purchase', '2026-01-01 12:00:00'),
    (2, 2, NULL, 1, 'purchase', 12.000, 78.000, 90.000, 'supplier_order', 2, 'Seed inventory purchase', '2026-01-02 12:00:00'),
    (3, 3, NULL, 1, 'purchase', 13.000, 23.000, 36.000, 'supplier_order', 3, 'Seed inventory purchase', '2026-01-03 12:00:00'),
    (4, 4, NULL, 1, 'purchase', 14.000, 16.000, 30.000, 'supplier_order', 4, 'Seed inventory purchase', '2026-01-04 12:00:00'),
    (5, 5, NULL, 1, 'purchase', 15.000, 5.000, 20.000, 'supplier_order', 5, 'Seed inventory purchase', '2026-01-05 12:00:00'),
    (6, 6, NULL, 1, 'purchase', 16.000, 2.000, 18.000, 'supplier_order', 6, 'Seed inventory purchase', '2026-01-06 12:00:00'),
    (7, 7, NULL, 1, 'purchase', 17.000, 133.000, 150.000, 'supplier_order', 7, 'Seed inventory purchase', '2026-01-07 12:00:00'),
    (8, 8, NULL, 1, 'purchase', 18.000, 82.000, 100.000, 'supplier_order', 8, 'Seed inventory purchase', '2026-01-08 12:00:00'),
    (9, 9, NULL, 1, 'purchase', 19.000, 41.000, 60.000, 'supplier_order', 9, 'Seed inventory purchase', '2026-01-09 12:00:00'),
    (10, 10, NULL, 1, 'purchase', 20.000, 0.000, 12.000, 'supplier_order', 10, 'Seed inventory purchase', '2026-01-10 12:00:00'),
    (11, 11, NULL, 1, 'purchase', 21.000, 59.000, 80.000, 'supplier_order', 11, 'Seed inventory purchase', '2026-01-11 12:00:00'),
    (12, 12, NULL, 1, 'purchase', 22.000, 3.000, 25.000, 'supplier_order', 12, 'Seed inventory purchase', '2026-01-12 12:00:00'),
    (13, 13, NULL, 1, 'purchase', 23.000, 0.000, 15.000, 'supplier_order', 13, 'Seed inventory purchase', '2026-01-13 12:00:00'),
    (14, 14, NULL, 1, 'purchase', 24.000, 16.000, 40.000, 'supplier_order', 14, 'Seed inventory purchase', '2026-01-14 12:00:00'),
    (15, 15, NULL, 1, 'purchase', 25.000, 85.000, 110.000, 'supplier_order', 15, 'Seed inventory purchase', '2026-01-15 12:00:00'),
    (16, 16, NULL, 1, 'purchase', 26.000, 104.000, 130.000, 'supplier_order', 16, 'Seed inventory purchase', '2026-01-16 12:00:00'),
    (17, 17, NULL, 1, 'purchase', 27.000, 28.000, 55.000, 'supplier_order', 17, 'Seed inventory purchase', '2026-01-17 12:00:00'),
    (18, 18, NULL, 1, 'purchase', 28.000, 0.000, 10.000, 'supplier_order', 18, 'Seed inventory purchase', '2026-01-18 12:00:00'),
    (19, 19, NULL, 1, 'purchase', 29.000, 0.000, 25.000, 'supplier_order', 19, 'Seed inventory purchase', '2026-01-19 12:00:00'),
    (20, 20, NULL, 1, 'purchase', 30.000, 5.000, 35.000, 'supplier_order', 20, 'Seed inventory purchase', '2026-01-20 12:00:00');

-- =========================================================
-- VIEWS
-- =========================================================

CREATE VIEW event_sales_summary AS
SELECT
    e.id_event,
    e.event_name,
    e.event_start,
    e.event_status,
    COUNT(DISTINCT so.id_sale) AS total_sales_orders,
    COALESCE(SUM(CASE WHEN so.sale_status = 'paid' THEN so.total_amount ELSE 0 END),0) AS total_revenue,
    COALESCE(SUM(CASE WHEN so.sale_status = 'paid' THEN soi.quantity ELSE 0 END),0) AS total_items_sold
FROM events e
LEFT JOIN sales_orders so ON so.id_event = e.id_event
LEFT JOIN sales_order_items soi ON soi.id_sale = so.id_sale
GROUP BY e.id_event,e.event_name,e.event_start,e.event_status;

CREATE VIEW event_product_sales AS
SELECT
    e.id_event,
    e.event_name,
    p.id_product,
    p.product_name,
    p.catalog_number,
    COALESCE(SUM(soi.quantity),0) AS quantity_sold,
    COALESCE(SUM(soi.line_total),0) AS total_sales,
    COALESCE(SUM(soi.quantity * p.product_cost),0) AS estimated_cost,
    COALESCE(SUM(soi.line_total),0)
        - COALESCE(SUM(soi.quantity * p.product_cost),0) AS estimated_profit
FROM events e
JOIN sales_orders so
    ON so.id_event = e.id_event
    AND so.sale_status = 'paid'
JOIN sales_order_items soi ON soi.id_sale = so.id_sale
JOIN products p ON p.id_product = soi.id_product
GROUP BY e.id_event,e.event_name,p.id_product,p.product_name,p.catalog_number;

CREATE VIEW vip_card_activity_summary AS
SELECT
    vc.id_vip_card,
    vc.card_number,
    vc.id_customer,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    vc.tier,
    vc.external_card,
    vc.balance,
    vc.card_status,
    vc.expires_at,
    COUNT(vct.id_vip_transaction) AS transaction_count,
    COALESCE(SUM(CASE WHEN vct.transaction_type = 'load' THEN vct.amount ELSE 0 END),0) AS total_loaded,
    COALESCE(SUM(CASE WHEN vct.transaction_type = 'payment' THEN vct.amount ELSE 0 END),0) AS total_spent
FROM vip_cards vc
JOIN customers c ON c.id_customer = vc.id_customer
LEFT JOIN vip_card_transactions vct ON vct.id_vip_card = vc.id_vip_card
GROUP BY
    vc.id_vip_card,vc.card_number,vc.id_customer,
    c.first_name,c.last_name,vc.tier,vc.external_card,
    vc.balance,vc.card_status,vc.expires_at;

-- End of initialization.