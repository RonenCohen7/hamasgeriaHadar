USE pub_management;

CREATE TABLE event_media (

    id_media INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_event INT UNSIGNED NOT NULL,

    file_name VARCHAR(255) NOT NULL,

    media_type ENUM('image','video') NOT NULL DEFAULT 'image',

    title VARCHAR(200),

    description TEXT,

    is_cover BOOLEAN NOT NULL DEFAULT FALSE,

    display_order INT UNSIGNED NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_media_event
        FOREIGN KEY(id_event)
        REFERENCES events(id_event)
        ON DELETE CASCADE
        ON UPDATE CASCADE

);

CREATE INDEX idx_event_media_event
ON event_media(id_event);

CREATE INDEX idx_event_media_cover
ON event_media(id_event, is_cover);