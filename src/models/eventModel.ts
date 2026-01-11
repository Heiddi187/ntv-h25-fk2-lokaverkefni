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
export const updateEventModel = async (id: number, data: any) => {
    const fields: string[] = [];
    const values: any[] = [];
    let parameterIndex = 1;

    if (data.title !== undefined) {
        fields.push(`title = $${parameterIndex++}`);
        values.push(data.title);
    };

    if (data.description !== undefined) {
        fields.push(`description = $${parameterIndex++}`);
        values.push(data.description);
    };

    if (data.city !== undefined) {
        fields.push(`city = $${parameterIndex++}`);
        values.push(data.city);
    };

    if (data.category !== undefined) {
        fields.push(`category = $${parameterIndex++}`);
        values.push(data.category);
    };

    if (data.event_date !== undefined) {
        fields.push(`event_date = $${parameterIndex++}`);
        values.push(data.event_date);
    };

    if (data.event_time !== undefined) {
        fields.push(`event_time = $${parameterIndex++}`);
        values.push(data.event_time);
    };

    if (data.duration !== undefined) {
        fields.push(`duration = $${parameterIndex++}`);
        values.push(data.duration);
    };

    if (data.venue_id !== undefined) {
        fields.push(`venue_id = $${parameterIndex++}`);
        values.push(data.venue_id);
    };

    if (data.price !== undefined) {
        fields.push(`price = $${parameterIndex++}`);
        values.push(data.price);
    };

    if (data.tix_available !== undefined) {
        fields.push(`tix_available = $${parameterIndex++}`);
        values.push(data.tix_available);
    };

    if (fields.length === 0) {
        return null;
    };

    values.push(id)

    return await db.oneOrNone(`
        UPDATE events SET ${fields.join(', ')} WHERE id = $${parameterIndex} RETURNING *`, values)
}

// delete event by id

// delete all events   ???

// events group by - category / dates / city / venue
// order by - dates / price / tix sold