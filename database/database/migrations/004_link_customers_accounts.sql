USE pub_management;

ALTER TABLE customers
ADD COLUMN id_account INT UNSIGNED NULL
AFTER id_customer;


UPDATE customers c
JOIN accounts a
    ON a.email = c.email
SET c.id_account = a.id_account
WHERE c.id_account IS NULL;

-- אחרי ה-backfill:
ALTER TABLE customers
MODIFY id_account INT UNSIGNED NOT NULL;

ALTER TABLE customers
ADD CONSTRAINT fk_customers_account
FOREIGN KEY (id_account)
REFERENCES accounts(id_account)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE customers
ADD UNIQUE KEY uq_customers_account (id_account);