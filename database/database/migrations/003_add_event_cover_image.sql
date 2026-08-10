USE pub_management;

ALTER TABLE events
ADD COLUMN cover_image VARCHAR(255) NULL
AFTER event_description;