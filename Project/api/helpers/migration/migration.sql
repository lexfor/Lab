CREATE DATABASE IF NOT EXISTS lab;

USE lab;

CREATE TABLE IF NOT EXISTS specializations (
  specializationID VARCHAR(255),
  specializationName VARCHAR(255),
  PRIMARY KEY (specializationID)
);

CREATE TABLE IF NOT EXISTS doctors (
  doctorID VARCHAR(255),
  firstName VARCHAR(255),
  email VARCHAR(255),
  user_id VARCHAR(255),
  PRIMARY KEY (doctorID)
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255),
  login VARCHAR(255),
  password VARCHAR(255),
  primary key (id)
);

CREATE TABLE IF NOT EXISTS doctor_specialization (
  specializationID VARCHAR(255),
  doctorID VARCHAR(255)
);

 INSERT INTO users ( id, login, password ) VALUES
    ('a4789d4e-4293-4f43-9e9a-d26f620fe5ff', 'michail.zyusko@gmail.com','michail.zyusko@gmail.com'),
    ('6e41e3a4-38f7-4c23-ad96-d6f46a9180a0', 'tim.kinevich@gmail.com','tim.kinevich@gmail.com'),
    ('97a8d5ba-4cbf-40ea-96e8-5d6ccfab12ca', 'dima.mitrichenko@gmail.com','dima.mitrichenko@gmail.com'),
    ('99b57aeb-d2a3-435f-9d76-42ac1dbeadd8', 'katya.lok@gmail.com', 'katya.lok@gmail.com'),
    ('670cf933-c65e-4068-ae69-666bdbbe3a19', 'oleg.dyblian@gmail.com','oleg.dyblian@gmail.com');

 INSERT INTO specializations ( specializationID, specializationName ) VALUES
    ('c43fca01-3ea9-48f5-b5d8-4d7a4705e30f', 'surgeon'),
    ('902240b7-514a-48c3-a67f-6acfb1d35030', 'therapist'),
    ('ff01ee4f-f005-48f2-830c-7dd456a1cc17', 'ophthalmologist'),
    ('fbebec6f-5ec0-4dcd-8e87-2a27af771f5a', 'pediatrician');

 INSERT INTO doctors ( doctorID, firstName, email, user_id) VALUES
    ('fb088f00-ce53-42f8-be44-7ba2ff8252a2', 'Michail', 'michail.zyusko@gmail.com','a4789d4e-4293-4f43-9e9a-d26f620fe5ff'),
    ('cc039971-a29b-4877-a6f7-83b62f682543', 'Tim', 'tim.kinevich@gmail.com', '6e41e3a4-38f7-4c23-ad96-d6f46a9180a0'),
    ('6ca11e90-7756-4286-a2e5-ed730f3332c7', 'Dima', 'dima.mitrichenko@gmail.com', '97a8d5ba-4cbf-40ea-96e8-5d6ccfab12ca'),
    ('52cffec1-1045-4579-97b9-19740175b9e8', 'Katya', 'katya.lok@gmail.com', '99b57aeb-d2a3-435f-9d76-42ac1dbeadd8'),
    ('00699915-d8c1-455e-aa26-25fd3b3b26c2', 'Oleg', 'oleg.dyblian@gmail.com', '670cf933-c65e-4068-ae69-666bdbbe3a19');
   
 INSERT INTO doctor_specialization ( specializationID, doctorID ) VALUES
    ('ff01ee4f-f005-48f2-830c-7dd456a1cc17', 'fb088f00-ce53-42f8-be44-7ba2ff8252a2'),
    ('c43fca01-3ea9-48f5-b5d8-4d7a4705e30f', 'cc039971-a29b-4877-a6f7-83b62f682543'),
    ('902240b7-514a-48c3-a67f-6acfb1d35030', '6ca11e90-7756-4286-a2e5-ed730f3332c7'),
    ('fbebec6f-5ec0-4dcd-8e87-2a27af771f5a', '00699915-d8c1-455e-aa26-25fd3b3b26c2'),
    ('fbebec6f-5ec0-4dcd-8e87-2a27af771f5a', '52cffec1-1045-4579-97b9-19740175b9e8');