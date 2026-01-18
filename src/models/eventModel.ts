import db from '../config/db';
import { EventsQuery } from '../schemas/event.schema';

export const getAllEventsModel = async () => {
    return await db.any(`
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
        ORDER BY e.id`
    );
};

export const getEventByIdModel = async (id: number) => {
    return await db.oneOrNone(`
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
        WHERE e.id=$1
        ORDER BY e.id
        `, [id]
    );
};

export const queryEventsModel = async (data: string) => {
    return await db.any(`
        SELECT * 
        FROM events
        WHERE category = 
        GROUP BY =
        HAVING = 
        ORDER BY =
        `, [data]
    );
};

export const getFilteredEventsModel = async (filter: EventsQuery) => {
    const fields: string[] = [];
    const values: any[] = [];
    let parameterIndex = 1;
    
    if (filter.category !== undefined) {
        fields.push(`e.category ILIKE $${parameterIndex++}`);
        values.push(`%${filter.category}%`);
    };
    
    if (filter.event_date !== undefined) {
        fields.push(`e.event_date = $${parameterIndex++}`);
        values.push(filter.event_date);
    };
    
    if (filter.date_from !== undefined) {
        fields.push(`e.event_date >= $${parameterIndex++}`);
        values.push(filter.date_from);
    };
    
    if (filter.date_to !== undefined) {
        fields.push(`e.event_date <= $${parameterIndex++}`);
        values.push(filter.date_to);
    };
    
    if (filter.city !== undefined) {
        fields.push(`e.city ILIKE $${parameterIndex++}`);
        values.push(`%${filter.city}%`);
    };
    
    if (filter.venue !== undefined) {
        fields.push(`v.name ILIKE $${parameterIndex++}`);
        values.push(`%${filter.venue}%`);
    };
    
    const where = fields.length ? `WHERE ${fields.join(' AND ')}` : '';
    
    const SORT_COLUMNS = {
        price: 'e.price',
        date: 'e.event_date',
        tickets: 'e.tix_available'
    } as const;
    
    const orderBy = SORT_COLUMNS[filter.sort ?? 'date'] ?? 'e.id';
    const orderDirection = filter.order === 'asc' ? 'ASC' : 'DESC';
    
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const offset = (page -1) * limit;
    
    const rows = await db.manyOrNone(`
        SELECT 
        COUNT(*) OVER()::int AS total_count,
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
        ${where}
        ORDER BY ${orderBy} ${orderDirection}
        LIMIT $${parameterIndex++}
        OFFSET $${parameterIndex++}
        `, [...values, limit, offset]
    );
    
    const total = rows[0]?.total_count ?? 0;
    
    return {
        total,
        events: rows.map(({ total_count, ...event }) => event)
    };
};



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Drasl sem ég er búinn að vera fikta með til að finna útúr hinu og þessu
    
    // export const createEventModel = async (data: any) => {
    //     return await db.one(`INSERT INTO events
    //         (title, description, city, category, event_date, event_time, duration, venue_id, price, tix_available)
    //         VALUES ($/title/, $/description/, $/city/, $/category/, $/event_date/, $/event_time/, $/duration/, $/venue_id/, $/price/, $/tix_available/)
    //         RETURNING *`, data);
    // };
    
    // export const updateEventModel = async (id: number, data: any) => {
    //     const fields: string[] = [];
    //     const values: any[] = [];
    //     let parameterIndex = 1;
    
    //     if (data.title !== undefined) {
    //         fields.push(`title = $${parameterIndex++}`);
    //         values.push(data.title);
    //     };
    
    //     if (data.description !== undefined) {
    //         fields.push(`description = $${parameterIndex++}`);
    //         values.push(data.description);
    //     };
    
    //     if (data.city !== undefined) {
    //         fields.push(`city = $${parameterIndex++}`);
    //         values.push(data.city);
    //     };
    
    //     if (data.category !== undefined) {
    //         fields.push(`category = $${parameterIndex++}`);
    //         values.push(data.category);
    //     };
    
    //     if (data.event_date !== undefined) {
    //         fields.push(`event_date = $${parameterIndex++}`);
    //         values.push(data.event_date);
    //     };
    
    //     if (data.event_time !== undefined) {
    //         fields.push(`event_time = $${parameterIndex++}`);
    //         values.push(data.event_time);
    //     };
    
    //     if (data.duration !== undefined) {
    //         fields.push(`duration = $${parameterIndex++}`);
    //         values.push(data.duration);
    //     };
    
    //     if (data.venue_id !== undefined) {
    //         fields.push(`venue_id = $${parameterIndex++}`);
    //         values.push(data.venue_id);
    //     };
    
    //     if (data.price !== undefined) {
    //         fields.push(`price = $${parameterIndex++}`);
    //         values.push(data.price);
    //     };
    
    //     if (data.tix_available !== undefined) {
    //         fields.push(`tix_available = $${parameterIndex++}`);
    //         values.push(data.tix_available);
    //     };
    
    //     if (fields.length === 0) {
    //         return null;
    //     };
    
    //     values.push(id)
    
    //     return await db.oneOrNone(`
    //         UPDATE events SET ${fields.join(', ')} WHERE id = $${parameterIndex} RETURNING *`, values)
    // }
    ///

    /*
    export const getEventsByCategoryModel = async () => {
    return await db.any(`
        SELECT 
            e.category, 
            e.id, 
            e.title, 
            e.description, 
            e.event_date, 
            e.event_time, 
            e.duration, 
            e.venue_id, 
            v.name as venue_name, 
            e.city, 
            e.price, 
            e.tix_available 
        FROM events e
        LEFT JOIN venues v 
        ON v.id = e.venue_id 
        GROUP BY e.id, v.name
        ORDER BY e.category, e.event_date`)
}

export const getEventsByDateModel = async () => {
    return await db.any(`
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
        ORDER BY e.event_date`)
}

export const getEventsByCityModel = async () => {
    return await db.any(`
        SELECT 
            e.city, 
            e.id, 
            e.title, 
            e.description, 
            e.event_date, 
            e.event_time, 
            e.duration, 
            e.venue_id, 
            v.name as venue_name, 
            e.category, 
            e.price, 
            e.tix_available 
        FROM events e
        WHERE city = $1
        LEFT JOIN venues v 
        ON v.id = e.venue_id 
        GROUP BY e.id, v.name
        ORDER BY e.city, e.event_date`
    );
};

export const getEventsByVenueModel = async () => {
    return await db.any(`
        SELECT 
            v.name as venue_name, 
            e.id, 
            e.title, 
            e.description, 
            e.event_date, 
            e.event_time, 
            e.duration, 
            e.venue_id, 
            e.category, 
            e.city, 
            e.price, 
            e.tix_available 
        FROM events e
        LEFT JOIN venues v 
        ON v.id = e.venue_id 
        GROUP BY e.id, v.name
        ORDER BY v.name, e.event_date`
    );
};
*/