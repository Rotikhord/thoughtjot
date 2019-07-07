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

CREATE TABLE IF NOT EXISTS keywords (
kword_pk        SERIAL NOT NULL PRIMARY KEY,
kword_name      VARCHAR(50) NOT NULL,
kword_user_fk   INT
);

CREATE TABLE IF NOT EXISTS entries (
entry_pk        SERIAL NOT NULL PRIMARY KEY,
entry_user_fk   INT NOT NULL,
entry_date      DATE NOT NULL DEFAULT NOW(),
entry_text      TEXT NOT NULL,
entry_isshared  BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS pendingEntries (
pending_user_fk   INT UNIQUE NOT NULL,
pending_text      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    tag_pk          SERIAL NOT NULL PRIMARY KEY,
    tag_kword_fk    INT NOT NULL,
    tag_entry_fk    INT NOT NULL
);

 

INSERT INTO keywords (kword_name, kword_user_fk) values ('Faith', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Hope', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Charity', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Courage', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Kindness', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Gladness', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Family', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Funny', 0);