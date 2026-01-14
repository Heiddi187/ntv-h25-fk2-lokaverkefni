import db from '../config/db';

export const buyTicketModel = async (
    userId: number,
    eventId: number,
    quantity: number
) => {
    return db.tx(async (t) => {
        const event = await t.oneOrNone(`
            SELECT id, price, tix_available, event_date
            FROM events
            WHERE id = $1
            FOR UPDATE
            `, [eventId]);

            // possible errors
            if (!event) {
                throw new Error('EVENT_NOT_FOUND');
            };
            
            const eventDateTime = new Date(`${event.event_date.toISOString().slice(0,10)}T${event.event_time}Z`);
            if (eventDateTime <= new Date()) {
                throw new Error('EVENT_HAS_PASSED');
            }
            
            if (event.tix_available < quantity) {
                throw new Error('NOT_ENOUGH_TICKETS');
            };

            const totalPrice = quantity * event.price;

            await t.none(`
                UPDATE events
                SET tix_available = tix_available - $1
                WHERE id = $2
                `, [quantity, eventId]
            );

            const ticket = await t.one(`
                INSERT INTO tickets (user_id, event_id, quantity, total_price)
                VALUES ($1, $2, $3, $4)
                RETURNING *
                `, [userId, eventId, quantity, totalPrice]
            );

            return ticket;
    });
};

export const getUsersTicketsModel = async (userId: number) => {
    return db.manyOrNone(`
        SELECT
            t.id AS ticket_id,
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
        WHERE t.user_id = $1
        ORDER BY e.event_time DESC
        `, [userId]
    );
};

export const returnTicketModel = async (ticketId: number, userId: number) => {
    return db.oneOrNone(`
        UPDATE tickets
        SET ticket_status = 'refunded'
        WHERE id = $1 AND user_id = $2 AND ticket_status = 'bought'
        RETURNING *
        `, [ticketId, userId]
    );
};

export const ticketToReturnModel = async (ticketId: number, userId: number) => {
    return db.oneOrNone(`
        SELECT 
            t.*, 
            (e.event_date + e.event_time) AT TIME ZONE 'UTC' AS event_ts
        FROM tickets t
        JOIN events e ON e.id = t.event_id
        WHERE t.id = $1 AND t.user_id = $2
        `, [ticketId, userId]
    );
}

// verður að vera logged in
// tix available
// greiðslu uppl?
// búa til bókun
// fækkar fjölda miða í boði
// skilar staðfestingu á bókun með einkvæmu? auðkenni ???
// hætta við bókun (>24h fyrir viðburð)