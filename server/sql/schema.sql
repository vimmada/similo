CREATE TABLE users (
  userid INTEGER PRIMARY KEY AUTOINCREMENT,
  fullname VARCHAR(40) NOT NULL,
  email VARCHAR(40) NOT NULL,
  password VARCHAR(256) NOT NULL
);

CREATE TABLE saved_items (
  itemid INTEGER PRIMARY KEY AUTOINCREMENT,
  item_title TEXT NOT NULL,
  description VARCHAR(1000) NOT NULL,
  price REAL,
  link TEXT NOT NULL,
  userid INTEGER NOT NULL,
  FOREIGN KEY(userid) REFERENCES users(userid) ON DELETE CASCADE
);

CREATE TABLE history_items (
  image BLOB NOT NULL,
  userid INTEGER NOT NULL,
  searched TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY(userid) REFERENCES users(userid) ON DELETE CASCADE
);
