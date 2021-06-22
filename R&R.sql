CREATE SCHEMA R&R

CREATE TABLE reviews (
  id INT PRIMARY KEY,
  product_id INT UNIQUE NOT NULL,
  page INT DEFAULT 1,
  count INT DEFAULT 5,
);

CREATE TABLE results (
  id INT PRIMARY KEY,
  review_id INT UNIQUE NOT NULL,
  rating smallint DEFAULT 0,
  summary VARCHAR(60) NOT NULL CHECK (summary <> ''),
  recommend BOOLEAN DEFAULT false,
  response VARCHAR,
  body VARCHAR(1000) NOT NULL CHECK (body <> ''),
  date DATE DEFAULT CURRENT_DATE,
  reviewer_name VARCHAR(60) NOT NULL,
  helfulness SMALLINT DEFAULT 0,
  FOREIGN KEY(id)
    REFERENCES reviews(id)
);

CREATE TABLE photos (
  id int PRIMARY KEY,
  url TEXT,
  FOREIGN KEY(id)
    REFERENCES results(id)
);

CREATE TABLE metadata (
  id INT PRIMARY KEY,
  product_id INT UNIQUE,
);

CREATE TABLE recommended (
  id INT PRIMARY KEY,
  false SMALLINT,
  true SMALLINT,
  FOREIGN KEY(id)
    REFERENCES metadata(id)
);

CREATE TABLE rating (
  id int PRIMARY KEY,
  1 SMALLINT DEFAULT 0,
  2 SMALLINT DEFAULT 0,
  3 SMALLINT DEFAULT 0,
  4 SMALLINT DEFAULT 0,
  5 SMALLINT DEFAULT 0,
  FOREIGN KEY(id)
    REFERENCES metadata(id)
);

CREATE TABLE characteristics (
  id INT PRIMARY KEY
  FOREIGN KEY(id)
    REFERENCES metadata(id)
);

CREATE TABLE comfort (
  id int PRIMARY KEY
  value real,
  FOREIGN KEY(id)
    REFERENCES characteristics(id)
);

CREATE TABLE size (
  id int PRIMARY KEY
  value real,
  FOREIGN KEY(id)
    REFERENCES characteristics(id)
);

CREATE TABLE fit (
  id int PRIMARY KEY
  value real,
  FOREIGN KEY(id)
    REFERENCES characteristics(id)
);

CREATE TABLE length (
  id int PRIMARY KEY
  value real,
  FOREIGN KEY(id)
    REFERENCES characteristics(id)
);

CREATE TABLE quality (
  id int PRIMARY KEY
  value real,
  FOREIGN KEY(id)
    REFERENCES characteristics(id)
);

CREATE TABLE width (
  id int PRIMARY KEY
  value real,
  FOREIGN KEY(id)
    REFERENCES characteristics(id)
);
