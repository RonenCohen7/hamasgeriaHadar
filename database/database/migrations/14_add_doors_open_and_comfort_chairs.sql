ALTER TABLE events
ADD COLUMN doors_open TIME NULL AFTER event_end;

ALTER TABLE sales_orders
ADD COLUMN comfort_chairs INT UNSIGNED NOT NULL DEFAULT 0 AFTER ticket_unit_price;

ALTER TABLE tickets
ADD COLUMN needs_comfort_chair BOOLEAN NOT NULL DEFAULT FALSE AFTER ticket_source;
