USE pub_management;

CREATE TABLE IF NOT EXISTS experiences(
    id_experience INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    experience_type ENUM (
        'chef',
        'cocktail'
    ) NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT NULL,

    image_name VARCHAR(255) NULL,

    price DECIMAL(10,2) NOT NULL DEFAULT 0,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    display_order INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);