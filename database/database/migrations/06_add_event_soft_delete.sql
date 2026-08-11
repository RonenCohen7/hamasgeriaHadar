USE pub_management;

ALTER TABLE events
ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0;