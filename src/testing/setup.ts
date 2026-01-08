import fs from 'fs';
import db from '../config/db';

export async function resetTestDb() {
    const tables = fs.readFileSync('src/sql/tables.sql', 'utf8');
    const seed = fs.readFileSync('src/sql/seed-data.sql', 'utf8');
    
    await db.none(tables);
    await db.none(seed);
};