CREATE VIEW event_sales_summary AS
SELECT
    e.id_event,
    e.event_name,
    e.event_start,
    e.event_status,

    COUNT(DISTINCT so.id_sale) AS total_sales_orders,

    COALESCE(SUM(
        CASE
            WHEN so.sale_status = 'paid'
            THEN so.total_amount
            ELSE 0
        END
    ), 0) AS total_revenue,

    COALESCE(SUM(
        CASE
            WHEN so.sale_status = 'paid'
            THEN soi.quantity
            ELSE 0
        END
    ), 0) AS total_items_sold

FROM events e

LEFT JOIN sales_orders so
    ON so.id_event = e.id_event

LEFT JOIN sales_order_items soi
    ON soi.id_sale = so.id_sale

GROUP BY
    e.id_event,
    e.event_name,
    e.event_start,
    e.event_status;