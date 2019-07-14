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
    pending_user_fk   INT NOT NULL,
    pending_text      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    tag_pk          SERIAL NOT NULL PRIMARY KEY,
    tag_kword_fk    INT NOT NULL,
    tag_entry_fk    INT NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
    comment_pk          SERIAL NOT NULL PRIMARY KEY,
    comment_entry_fk    INT NOT NULL REFERENCES entries(entry_pk),
    comment_user_fk   INT NOT NULL REFERENCES users(user_pk),
    comment_date      DATE NOT NULL DEFAULT NOW(),
    comment_text      TEXT NOT NULL
);
 

INSERT INTO keywords (kword_name, kword_user_fk) values ('Faith', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Hope', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Charity', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Courage', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Kindness', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Gladness', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Family', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Funny', 0);


INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (24, '07/01/19', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Malesuada nunc vel risus commodo. Interdum consectetur libero id faucibus nisl tincidunt eget nullam. Arcu cursus euismod quis viverra nibh cras pulvinar mattis. Nulla facilisi morbi tempus iaculis urna. Nullam non nisi est sit amet facilisis magna.' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (24, '07/02/19', '' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (24, '07/03/19', '' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (24, '07/04/19', '' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (24, '07/05/19', '' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (24, '07/06/19', '' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (24, '07/07/19', '' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (24, '07/08/19', '' );
