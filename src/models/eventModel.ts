import db from '../config/db';

export const getAllEventsModel = async () => {
    return await db.any("SELECT * FROM events ORDER BY event_date, event_time");
};

export const getEventByIdModel = async (id: number) => {
    return await db.oneOrNone("SELECT * FROM events WHERE id=$1", [id]);
};

export const createEventModel = async (data: any) => {
    return await db.one(`INSERT INTO events
        (title, description, city, category, event_date, event_time, duration, venue_id, price, tix_available)
        VALUES ($/title/, $/description/, $/city/, $/category/, $/event_date/, $/event_time/, $/duration/, $/venue_id/, $/price/, $/tix_available/)
        RETURNING *`, data);
};

// update event

// delete event by id

// delete all events   ???

// events group by - category / dates / city / venue
// order by - dates / price / tix sold