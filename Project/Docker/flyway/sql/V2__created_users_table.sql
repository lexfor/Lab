USE lab;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255),
    login VARCHAR(255),
    password VARCHAR(255),
    PRIMARY KEY (id)
);
