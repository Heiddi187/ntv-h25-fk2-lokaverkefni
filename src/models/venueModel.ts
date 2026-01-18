import db from '../config/db';

export const getAllVenuesModel = async () => {
    return await db.any('SELECT * FROM venues ORDER BY id');
};

export const getVenueByIdModel = async (id: number) => {
    return await db.oneOrNone('SELECT * FROM venues WHERE id=$1', [id]);
};

export const getAllEventsByVenueModel = async (id: number) => {
    return await db.any('SELECT * FROM events WHERE venue_id = $1 ORDER BY id ASC', [id]);
};