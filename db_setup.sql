CREATE TABLE IF NOT EXISTS users (
user_pk                 SERIAL NOT NULL PRIMARY KEY,
user_username           VARCHAR(80) NOT NULL,
user_fname              VARCHAR(80) NOT NULL,
user_lname              VARCHAR(80) NOT NULL,
user_email              VARCHAR(80) NOT NULL UNIQUE,
user_hash               VARCHAR(255) NOT NULL,
user_signup             DATE NOT NULL,
user_last_signin        DATE NOT NULL,
user_security_question  TEXT NOT NULL,
user_security_answer    VARCHAR(80) NOT NULL
);
