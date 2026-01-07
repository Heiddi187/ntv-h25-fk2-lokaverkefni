TRUNCATE TABLE venues RESTART IDENTITY CASCADE;
TRUNCATE TABLE events RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE tickets RESTART IDENTITY CASCADE;

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

('Startup Pitch Night', 'Entrepreneurship event', 'Reykjavík', 'Business', '2026-06-20', '18:00', 180, 3, 2000, 800),
('Food Truck Festival', 'Street food paradise', 'Reykjavík', 'Food', '2026-06-25', '12:00', 300, 5, 2500, 2500),
('Poetry Slam', 'Live poetry performances', 'Reykjavík', 'Culture', '2026-07-01', '19:00', 120, 3, 1500, 800),
('Open Air Cinema', 'Outdoor movie night', 'Reykjavík', 'Culture', '2026-07-05', '22:00', 120, 5, 1800, 2500);

INSERT INTO users (name, email, password_hash, money_spent) VALUES
('Anna Jónsdóttir', 'anna@test.is', 'hash1', 0),
('Björn Karlsson', 'bjorn@test.is', 'hash2', 0),
('Katrín Sigurðardóttir', 'katrin@test.is', 'hash3', 0);