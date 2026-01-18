// Til að fikta og staðfesta fyrirspurnir

DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;

CREATE TABLE venues (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	address VARCHAR(150) NOT NULL,
	capacity INTEGER NOT NULL
);

CREATE TABLE events (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	description TEXT,
	event_date DATE NOT NULL,
	event_time TIME NOT NULL,
	duration INTEGER NOT NULL,
	city VARCHAR(50),
	venue_id INTEGER REFERENCES venues(id),
	category VARCHAR(50),
	price INTEGER NOT NULL,
	tix_available INTEGER NOT NULL
);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	money_spent INTEGER DEFAULT 0,
	role VARCHAR(5) DEFAULT 'user',
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tickets (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id),
	event_id INTEGER REFERENCES events(id),
	quantity INTEGER NOT NULL CHECK (quantity > 0),
	purchased_at TIMESTAMP DEFAULT NOW(),
	total_price INTEGER NOT NULL CHECK (total_price >= 0),
	ticket_status VARCHAR(12) DEFAULT 'bought'
		CHECK (ticket_status IN ('bought', 'refunded', 'used', 'expired'))
);



TRUNCATE TABLE tickets RESTART IDENTITY CASCADE;
TRUNCATE TABLE events RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE venues RESTART IDENTITY CASCADE;

INSERT INTO venues (name, address, capacity) VALUES
('Harpa Concert Hall', 'Austurbakki 2, Reykjavík', 1800),
('Laugardalshöll', 'Engjavegur 8, Reykjavík', 5500),
('Gamla Bíó', 'Ingólfsstræti 2a, Reykjavík', 800),
('Háskólabíó', 'Hagatorg, Reykjavík', 950),
('Kópavogur Sports Center', 'Digranesvegur 12, Kópavogur', 2500);

INSERT INTO events
(title, description, city, category, event_date, event_time, duration, venue_id, price, tix_available) VALUES

-- Concerts
('Sigur Rós Live', 'Icelandic post-rock legends', 'Reykjavík', 'Concert', '2026-03-01', '20:00', 120, 1, 12900, 1800),
('Of Monsters and Men', 'Indie folk concert', 'Reykjavík', 'Concert', '2026-03-05', '20:00', 110, 1, 11900, 1800),
('Björk Orchestral', 'Symphonic Björk performance', 'Reykjavík', 'Concert', '2026-03-12', '19:00', 130, 1, 15900, 1800),
('GusGus Club Night', 'Electronic party', 'Reykjavík', 'Concert', '2026-03-20', '22:00', 180, 3, 5900, 800),

-- Sports
('Iceland vs Norway', 'International football match', 'Reykjavík', 'Sports', '2026-04-01', '18:00', 105, 2, 8900, 5500),
('KR vs Valur', 'Premier league derby', 'Reykjavík', 'Sports', '2026-04-05', '19:30', 100, 2, 7500, 5500),
('National Handball Finals', 'Championship finals', 'Reykjavík', 'Sports', '2026-04-12', '17:00', 120, 2, 6900, 5500),
('Basketball Cup Final', 'Icelandic Cup', 'Reykjavík', 'Sports', '2026-04-18', '19:00', 100, 5, 6500, 2500),

-- Theatre
('Romeo and Juliet', 'Classic Shakespeare play', 'Reykjavík', 'Theatre', '2026-05-01', '19:00', 140, 4, 8200, 950),
('Hamlet', 'Dark tragedy', 'Reykjavík', 'Theatre', '2026-05-08', '19:00', 150, 4, 8200, 950),
('The Book of Mormon', 'Musical comedy', 'Reykjavík', 'Theatre', '2026-05-15', '20:00', 160, 4, 9900, 950),
('Grease', 'Classic musical', 'Reykjavík', 'Theatre', '2026-05-22', '20:00', 145, 4, 9000, 950),

-- Other
('Reykjavík Comedy Night', 'Stand-up show', 'Reykjavík', 'Comedy', '2026-06-01', '21:00', 120, 3, 4500, 800),
('Magic Show', 'Family magic show', 'Reykjavík', 'Family', '2026-06-05', '16:00', 90, 3, 4000, 800),
('Kids Science Fair', 'Fun experiments for kids', 'Reykjavík', 'Family', '2026-06-10', '14:00', 120, 5, 3000, 2500),
('Yoga Festival', 'Outdoor wellness event', 'Reykjavík', 'Wellness', '2026-06-15', '10:00', 240, 5, 3500, 2500),
('A passed event', 'For testing purposes', 'Reykjavík', 'Test', '2025-01-01', '10:00', 10, 1, 123, 10),

('Startup Pitch Night', 'Entrepreneurship event', 'Reykjavík', 'Business', '2026-06-20', '18:00', 180, 3, 2000, 800),
('Food Truck Festival', 'Street food paradise', 'Reykjavík', 'Food', '2026-06-25', '12:00', 300, 5, 2500, 2500),
('Poetry Slam', 'Live poetry performances', 'Reykjavík', 'Culture', '2026-07-01', '19:00', 120, 3, 1500, 800),
('Open Air Cinema', 'Outdoor movie night', 'Reykjavík', 'Culture', '2026-07-05', '22:00', 120, 5, 1800, 2500);

INSERT INTO users (name, email, password_hash, role) VALUES
('Anna Jónsdóttir', 'anna@test.is', '$2b$12$Yr3rfyR1xP/EM/.//TPrheOQWZEwl6Uj/pIoHTeS8fNw9WhbNPM9e', 'user'),
('Björn Karlsson', 'bjorn@test.is', '$2b$12$rxRsprN2tkr2j8wIKCX5AOCaelos9IrrDspVBxUxHd5niU2s.4kz2', 'user'),
('Katrín Sigurðardóttir', 'katrin@test.is', '$2b$12$EYqjitFg5czaVYK0FKyJheZfhsAADXLELH7jTasrWKqwwuZjftwEC', 'user');

-------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------

 
select * from venues
select * from events order by id
select * from users
--select * from tickets

SELECT
  e.id,
  e.title,
  e.description,
  e.event_date,
  e.event_time,
  e.duration,
  e.venue_id,
  v.name as venue_name,
  e.city,
  e.category,
  e.price,
  e.tix_available
FROM events e
LEFT JOIN venues v
  ON v.id = e.venue_id
ORDER BY e.id

SELECT 
	e.event_date, 
	e.id, 
	e.title, 
	e.description, 
	e.event_time, 
	e.duration, 
	e.venue_id, 
	v.name as venue_name, 
	e.city, 
	e.category, 
	e.price, 
	e.tix_available 
FROM events e
LEFT JOIN venues v 
ON v.id = e.venue_id 
GROUP BY e.id, v.name
ORDER BY e.event_date

SELECT 
  e.category,
  json_agg(
    json_build_object(
      'id', e.id,
      'title', e.title,
      'description', e.description,
      'event_date', e.event_date,
      'event_time', e.event_time,
      'duration', e.duration,
      'venue_id', e.venue_id,
      'venue_name', v.name,
      'city', e.city,
      'category', e.category,
      'price', e.price,
      'tix_available', e.tix_available
    )
    ORDER BY e.event_date, e.event_time
  ) AS items
FROM events e
LEFT JOIN venues v ON v.id = e.venue_id
GROUP BY e.category
ORDER BY e.category;

SELECT
	t.id,
	t.quantity,
	t.total_price,
	t.ticket_status,
	t.purchased_at,
	e.title,
	e.event_date,
	e.event_time,
	v.id AS venue_id,
	v.name AS venue
FROM tickets t
JOIN events e ON e.id = t.event_id
JOIN venues v ON v.id = e.venue_id
WHERE t.user_id = 1
ORDER BY t.purchased_at DESC

INSERT INTO events (title, event_date, event_time, duration, venue_id, price, tix_available)
VALUES ('Event in 2 hours',
	CURRENT_DATE,
	(CURRENT_TIME + INTERVAL '2 hours')::TIME,
	60, 2, 123, 10)
RETURNING *

SELECT id, price, tix_available, (e.event_date + e.event_time) AT TIME ZONE 'UTC' AS event_ts
            FROM events
            WHERE id = 27

INSERT INTO tickets (user_id, event_id, quantity, total_price)
            VALUES (1, 17, 2, 250)
            RETURNING *

INSERT INTO	tickets (user_id, event_id, quantity, total_price)
VALUES (1, 17, 2, 2500)
RETURNING *

SELECT id, price, tix_available,
       (event_date + event_time) AS event_ts,
       (event_date + event_time) < NOW() AS is_expired
FROM events

SELECT
  id,
  (event_date + event_time) AT TIME ZONE 'UTC' AS event_ts,
  NOW(),
  ((event_date + event_time) AT TIME ZONE 'UTC') < NOW() AS expired
FROM events
WHERE id = 17;


const passedEvent = await db.one(`
  SELECT id FROM events
  WHERE (event_date + event_time) < NOW()
  ORDER BY event_date
  LIMIT 1
`);

SELECT now()::date - INTERVAL '1 day' as result 
SELECT CURRENT_DATE - INTERVAL '1 day' as result
SELECT CURRENT_DATE
SELECT TO_CHAR(CURRENT_TIMESTAMP, 'hh24:mi')
SELECT 
	title,
	TO_CHAR(event_date, 'dd Mon, yyyy') AS event_date,
	event_time
FROM events

--FROM - WHERE - GROUP BY - HAVING - SELECT - DISTINCT - ORDER BY - LIMIT/OFFSET

SELECT category 
FROM events
WHERE category = 'Sports' 
GROUP BY
HAVING
ORDER BY
