DROP DATABASE IF EXISTS ReviewsAndRatings;

CREATE DATABASE ReviewsAndRatings;

DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS reviews_photos CASCADE;
DROP TABLE IF EXISTS characteristics CASCADE;
DROP TABLE IF EXISTS characteristic_reviews CASCADE;
DROP TABLE IF EXISTS reviewstemp CASCADE;
DROP TABLE IF EXISTS reviews_photostemp CASCADE;
DROP TABLE IF EXISTS characteristic_reviewstemp CASCADE;

CREATE TABLE reviews (
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  rating SMALLINT DEFAULT 0,
  date BIGINT,
  summary VARCHAR(60) NOT NULL CHECK (summary <> ''),
  body VARCHAR(1000) NOT NULL CHECK (body <> ''),
  recommend BOOLEAN DEFAULT false,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR(60) NOT NULL CHECK (reviewer_name <> ''),
  reviewer_email VARCHAR(60) NOT NULL CHECK (reviewer_email <> ''),
  response VARCHAR,
  helpfulness SMALLINT DEFAULT 0
);

CREATE TABLE reviews_photos (
  id INT PRIMARY KEY,
  review_id INT NOT NULL,
  url TEXT,
  FOREIGN KEY(review_id)
    REFERENCES reviews(id)
);

CREATE TABLE characteristics (
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR(15)
);

CREATE TABLE characteristic_reviews (
  id INT PRIMARY KEY,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  value REAL NOT NULL CHECK (value <= 5 AND value >= 0),
  FOREIGN KEY(review_id)
    REFERENCES reviews(id),
  FOREIGN KEY(characteristic_id)
    REFERENCES characteristics(id)
);

-- \timing

CREATE TABLE reviewstemp (
  id INT PRIMARY KEY,
  product_id INT,
  rating SMALLINT DEFAULT 0,
  date  BIGINT,
  summary VARCHAR,
  body VARCHAR,
  recommend BOOLEAN DEFAULT false,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR,
  reviewer_email VARCHAR,
  response VARCHAR,
  helpfulness SMALLINT DEFAULT 0
);

COPY reviewstemp(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/sergioh/Documents/Hackreactor/SEI SFO135/API-ReviewsAndRatings/data/reviews.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE reviews_photostemp (
  id INT PRIMARY KEY,
  review_id INT NOT NULL,
  url TEXT,
  FOREIGN KEY(review_id)
    REFERENCES reviewstemp(id)
);

COPY reviews_photostemp (id, review_id, url)
FROM '/Users/sergioh/Documents/Hackreactor/SEI SFO135/API-ReviewsAndRatings/data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(id, product_id, name)
FROM '/Users/sergioh/Documents/Hackreactor/SEI SFO135/API-ReviewsAndRatings/data/characteristics.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE characteristic_reviewstemp (
  id INT PRIMARY KEY,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  value REAL NOT NULL CHECK (value <= 5 AND value >= 0),
  FOREIGN KEY(review_id)
    REFERENCES reviewstemp(id),
  FOREIGN KEY(characteristic_id)
    REFERENCES characteristics(id)
);

COPY characteristic_reviewstemp(id, characteristic_id, review_id, value)
FROM '/Users/sergioh/Documents/Hackreactor/SEI SFO135/API-ReviewsAndRatings/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

INSERT INTO reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) SELECT id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness FROM reviewstemp WHERE LENGTH(SUMMARY) <= 60;

ALTER TABLE reviews ALTER COLUMN date TYPE TIMESTAMPTZ USING to_timestamp(date/1000) AT TIME ZONE 'UTC', ALTER COLUMN date SET DEFAULT NOW();

INSERT INTO reviews_photos(id, review_id, url) SELECT id, review_id, url FROM reviews_photostemp WHERE EXISTS ( SELECT 1 FROM reviews WHERE id = reviews_photostemp.review_id);

INSERT INTO characteristic_reviews(id, characteristic_id, review_id, value) SELECT id, characteristic_id, review_id, value FROM characteristic_reviewstemp WHERE EXISTS ( SELECT 1 FROM reviews WHERE id = characteristic_reviewstemp.review_id);

ALTER TABLE reviews ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;
ALTER TABLE reviews_photos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;
ALTER TABLE characteristic_reviews ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;

CREATE INDEX reviews_product_id_asc ON reviews(product_id ASC);
CREATE INDEX mul_col_idx_reviews ON reviews(product_id ASC, recommend ASC);
CREATE INDEX reviews_photos_review_id_asc ON reviews_photos(review_id ASC);
CREATE INDEX characteristics_product_id_asc ON characteristics(product_id ASC);
CREATE INDEX characteristic_reviews_characteristic_id_asc ON characteristic_reviews(characteristic_id ASC);

SELECT pg_catalog.setval(pg_get_serial_sequence('reviews', 'id'), MAX(id)) FROM reviews;
SELECT pg_catalog.setval(pg_get_serial_sequence('reviews_photos', 'id'), MAX(id)) FROM reviews_photos;
SELECT pg_catalog.setval(pg_get_serial_sequence('characteristic_reviews', 'id'), MAX(id)) FROM characteristic_reviews;





