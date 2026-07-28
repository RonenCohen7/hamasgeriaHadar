CREATE TABLE events (
    id_event INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    event_name VARCHAR(200) NOT NULL,
    event_description TEXT,

    event_start DATETIME NOT NULL,
    event_end DATETIME,

    event_location VARCHAR(255),

    maximum_guests INT UNSIGNED,
    expected_guests INT UNSIGNED,
    actual_guests INT UNSIGNED,

    ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    event_status ENUM(
        'planned',
        'active',
        'completed',
        'cancelled'
    ) NOT NULL DEFAULT 'planned',

    created_by INT UNSIGNED NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_events_user
        FOREIGN KEY (created_by)
        REFERENCES users(id_user)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_event_dates
        CHECK (event_end IS NULL OR event_end >= event_start),

    CONSTRAINT chk_ticket_price
        CHECK (ticket_price >= 0)
);