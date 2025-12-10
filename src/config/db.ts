import dotenv from 'dotenv';
import pgPromise from 'pg-promise';

dotenv.config();

const pgp = pgPromise({});

const db = process.env.DATABASE_URL ? pgp(process.env.DATABASE_URL) : pgp({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
});

db.connect().then((object) => {
    console.log('Connected to PostgresSQL database');
    object.done();
}).catch((error) => {
    console.error('Database connection error: ,', error.message)
});

export default db;