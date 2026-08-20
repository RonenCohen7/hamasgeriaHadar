ALTER TABLE sales_orders
    ADD COLUMN payment_reference VARCHAR(150) NULL AFTER payment_method,
    ADD COLUMN external_document_id VARCHAR(150) NULL AFTER payment_reference,
    ADD COLUMN external_document_number VARCHAR(100) NULL AFTER external_document_id;