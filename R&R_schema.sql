CREATE SCHEMA R&R

CREATE TABLE products (
  id INT PRIMARY KEY,
);

CREATE TABLE review (
  id INT GENERATED AS IDENTITY PRIMARY KEY,
  product_id INT NOT NULL,
  rating SMALLINT DEFAULT 0,
  summary VARCHAR(60) NOT NULL CHECK (summary <> ''),
  recommend BOOLEAN DEFAULT false,
  response VARCHAR,
  body VARCHAR(1000) NOT NULL CHECK (body <> ''),
  date DATE DEFAULT CURRENT_DATE,
  reviewer_name VARCHAR(60) NOT NULL CHECK (reviewer_name <> ''),
  reviewer_email VARCHAR(60) NOT NULL CHECK (reviewer_email <> ''),
  helpfulness SMALLINT DEFAULT 0,
  FOREIGN KEY(product_id)
    REFERENCES products(id)
);

CREATE TABLE photos (
  id INT GENERATED AS IDENTITY PRIMARY KEY,
  review_id INT NOT NULL,
  url TEXT,
  FOREIGN KEY(review_id)
    REFERENCES review(id)
);

CREATE TABLE characteristics (
  id INT GENERATED AS IDENTITY PRIMARY KEY,
  description VARCHAR(60)
);

CREATE TABLE review_characteristics (
  id INT GENERATED AS IDENTITY PRIMARY KEY,
  review_id INT NOT NULL,
  characteristics_id INT NOT NULL,
  value REAL NOT NULL CHECK (5 >= value >= 0),
  FOREIGN KEY(review_id)
    REFERENCES review(id),
  FOREIGN KEY(characteristics_id)
    REFERENCES characteristics(id)
);

CREATE TABLE products_characteristics (
  id INT GENERATED AS IDENTITY PRIMARY KEY,
  products_id INT NOT NULL,
  characteristics_id INT NOT NULL,
  value REAL NOT NULL CHECK (5 >= value >= 0),
  FOREIGN KEY(products_id)
    REFERENCES products(id),
  FOREIGN KEY(characteristics_id)
    REFERENCES characteristics(id)
);