USE lab;

CREATE TABLE IF NOT EXISTS doctor_specialization (
  specialization_id VARCHAR(255),
  doctor_id VARCHAR(255),
  FOREIGN KEY (specialization_id) REFERENCES specializations (id),
  FOREIGN KEY (doctor_id) REFERENCES doctors (id)
);
