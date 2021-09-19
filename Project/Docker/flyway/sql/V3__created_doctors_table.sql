USE lab;

CREATE TABLE IF NOT EXISTS doctors (
  id VARCHAR(255),
  first_name VARCHAR(255),
  email VARCHAR(255),
  user_id VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);
