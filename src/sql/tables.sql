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
	money_spent INTEGER DEFAULT 0
);

CREATE TABLE tickets (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id),
	event_id INTEGER REFERENCES events(id),
	purchased_at TIMESTAMP DEFAULT NOW(),
	returned BOOLEAN DEFAULT FALSE
);