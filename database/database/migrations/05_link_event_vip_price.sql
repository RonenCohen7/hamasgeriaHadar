USE pub_management;

ALTER TABLE events
ADD COLUMN vip_price DECIMAL(10,2) NULL
AFTER ticket_price;