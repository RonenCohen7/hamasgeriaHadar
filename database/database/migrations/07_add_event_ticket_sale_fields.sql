-- 07_add_event_ticket_sale_fields.sql
-- Add event ticket purchase fields to sales_orders

ALTER TABLE sales_orders
    ADD COLUMN ticket_quantity INT UNSIGNED NULL AFTER id_vip_card,
    ADD COLUMN ticket_unit_price DECIMAL(10,2) NULL AFTER ticket_quantity;