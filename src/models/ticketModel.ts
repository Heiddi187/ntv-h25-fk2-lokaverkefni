import db from '../config/db';

export const buyTicketModel = async (
    userId: number,
    eventId: number,
    quantity: number
) => {
    return db.tx(async (t) => {
        const event = await t.oneOrNone(`
            SELECT id, price, tix_available, 
                ((event_date + event_time) AT TIME ZONE 'UTC')::timestamptz AS event_ts,
                ((event_date + event_time) AT TIME ZONE 'UTC')::timestamptz < NOW() AS is_expired
            FROM events
            WHERE id = $1
            FOR UPDATE
            `, [eventId]);

            // possible errors
            if (!event) {
                throw new Error('EVENT_NOT_FOUND');
            };

            if (event.is_expired) {
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
            e.title,
            t.id AS ticket_id,
            t.quantity,
            t.total_price,
            t.ticket_status,
            e.event_date,
            e.event_time,
            t.purchased_at,
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
    return db.tx(async (t) => {
        const ticket = await t.oneOrNone(`
            SELECT *
            FROM tickets
            WHERE id = $1 
                AND user_id = $2 
                AND ticket_status = 'bought'
            FOR UPDATE
            `, [ticketId, userId]
        );

        if (!ticket) return null;

        await t.none(`
            UPDATE events
            SET tix_available = tix_available + $1
            WHERE id = $2
            `, [ticket.quantity, ticket.event_id]
        );

        const refunded = await t.one(`
            UPDATE tickets
            SET ticket_status = 'refunded'
            WHERE id = $1
            RETURNING *
            `, [ticketId]
        );

        return refunded;
    });
};

export const ticketToReturnModel = async (ticketId: number, userId: number) => {
    return db.oneOrNone(`
        SELECT 
            t.*, 
            ((e.event_date + e.event_time) AT TIME ZONE 'UTC')::timestamptz AS event_ts
        FROM tickets t
        JOIN events e ON e.id = t.event_id
        WHERE t.id = $1 AND t.user_id = $2
        `, [ticketId, userId]
    );
};

export const oldTicketsExpireModel = async () => {
    await db.none(`
        UPDATE tickets t
        SET ticket_status = 'expired'
        FROM events e
        WHERE e.id = t.event_id
            AND ((e.event_date + e.event_time) AT TIME ZONE 'UTC')::timestamptz < NOW()
            AND t.ticket_status = 'bought'
        `
    );
};

export const getUserDataModel = async (userId: number) => {
    return db.oneOrNone(`
        SELECT
            COUNT(DISTINCT event_id) AS event_count,
            COALESCE(SUM(total_price), 0) AS total_spent
        FROM tickets
        WHERE user_id = $1
            AND ticket_status IN ('bought', 'used', 'expired')
        `, [userId]
    );
};

// verður að vera logged in
// tix available
// greiðslu uppl?
// búa til bókun
// fækkar fjölda miða í boði
// skilar staðfestingu á bókun með einkvæmu? auðkenni ???
// hætta við bókun (>24h fyrir viðburð)