CREATE TABLE tickets (

    id_ticket INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_sale INT UNSIGNED NOT NULL,
    id_event INT UNSIGNED NOT NULL,
    id_customer INT UNSIGNED  NULL,

    ticket_number VARCHAR(50) NOT NULL,
    qr_token VARCHAR(255) NOT NULL,

    ticket_status ENUM(
        'valid',
        'checked_in',
        'cancelled',
        'refunded'
    ) NOT NULL DEFAULT 'valid',

    ticket_source ENUM(
        'website',
        'phone',
        'walk_in',
        'other'
    ) NOT NULL DEFAULT 'website',

    checked_in_at DATETIME NULL,
    checked_in_by INT UNSIGNED NULL,


    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_tickets_ticket_number (ticket_number),
    UNIQUE KEY uq_ticket_qr_token (qr_token),

    KEY idx_tickets_sale (id_sale),
    KEY idx_tickets_event (id_event),
    KEY idx_tickets_customer (id_customer),
    KEY idx_tickets_status (ticket_status),
    KEY idx_tickets_source (ticket_source),
    KEY idx_tickets_checked_in_by (checked_in_by),


    CONSTRAINT fk_ticket_sale
        FOREIGN KEY (id_sale)
        REFERENCES sales_orders(id_sale)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_tickets_event
        FOREIGN KEY (id_event)
        REFERENCES events(id_event)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_tickets_customer
        FOREIGN KEY (id_customer)
        REFERENCES customers(id_customer)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_tickets_checked_in_by
        FOREIGN KEY (checked_in_by)
        REFERENCES users(id_user)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;