DELIMITER $$

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