CREATE VIEW event_product_sales AS
SELECT
    e.id_event,
    e.event_name,

    p.id_product,
    p.product_name,
    p.catalog_number,

    COALESCE(SUM(soi.quantity), 0) AS quantity_sold,
    COALESCE(SUM(soi.line_total), 0) AS total_sales,

    COALESCE(SUM(
        soi.quantity * p.product_cost
    ), 0) AS estimated_cost,

    COALESCE(SUM(soi.line_total), 0)
    -
    COALESCE(SUM(
        soi.quantity * p.product_cost
    ), 0) AS estimated_profit

FROM events e

JOIN sales_orders so
    ON so.id_event = e.id_event
    AND so.sale_status = 'paid'

JOIN sales_order_items soi
    ON soi.id_sale = so.id_sale

JOIN products p
    ON p.id_product = soi.id_product

GROUP BY
    e.id_event,
    e.event_name,
    p.id_product,
    p.product_name,
    p.catalog_number;