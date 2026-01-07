import db from '../config/db';

export const getAllEvents = () => {
    return db.any("SELECT * FROM events ORDER BY event_date, event_time");
};

export const getEventById = (id: number) => {
    return db.oneOrNone("SELECT * FROM events WHERE id=$1", [id]);
};

export const createEvent = (data: any) => {
    return db.one(`INSERT INTO event
        (title, description, city, category, event_date, event_time, duration, venue_id, price, tix_available)
        VALUES ($/title/, $/description/, $/city/, $/category/, $/event_date/, $/event_time/, $/duration/, $/venue_id/, $/price/, $/tix_available/)
        RETURNING *`, data);
};