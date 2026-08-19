USE pub_management;

SELECT
    so.sale_date AS transactionDate,

    p.id_product AS productId,
    p.product_name AS productName,

    soi.quantity AS quantity,
    soi.unit_price AS unitPrice,
    soi.line_total AS lineTotal,

    so.payment_method AS paymentMethod,

    vc.card_number AS vipCardNumber,

    c.first_name AS cardHolderName,
    c.email AS cardHolderEmail,
    c.phone AS cardHolderPhone

FROM sales_orders AS so

JOIN sales_order_items AS soi
    ON soi.id_sale = so.id_sale

JOIN products AS p
    ON p.id_product = soi.id_product

JOIN vip_cards AS vc
    ON vc.id_vip_card = so.id_vip_card

JOIN customers AS c
    ON c.id_customer = vc.id_customer

WHERE so.payment_method = 'vip_card'

ORDER BY so.sale_date DESC;