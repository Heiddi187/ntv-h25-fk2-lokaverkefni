import dotenv from 'dotenv';
import pgPromise from 'pg-promise';

dotenv.config({ 
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const pgp = pgPromise({});

const db = process.env.DATABASE_URL ? pgp(process.env.DATABASE_URL) : pgp({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
});

export default db;