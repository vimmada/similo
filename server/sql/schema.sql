CREATE TABLE users (
  username VARCHAR(20) NOT NULL,
  fullname VARCHAR(40) NOT NULL,
  email VARCHAR(40) NOT NULL,
  password VARCHAR(256) NOT NULL,
  PRIMARY KEY(username)
);

CREATE TABLE items (
  itemid INTEGER PRIMARY KEY NOT NULL,
  description VARCHAR(1000) NOT NULL,
  owner VARCHAR(50),
  price REAL,
  link TEXT NOT NULL,
);

