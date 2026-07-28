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

DELIMITER ;