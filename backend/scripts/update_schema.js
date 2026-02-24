const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateSchema = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'kost_db',
            multipleStatements: true
        });

        console.log('Connected to MySQL server.');

        // Add status column if it doesn't exist
        try {
            await connection.query(`
                ALTER TABLE kost 
                ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' 
                AFTER last_room_update;
            `);
            console.log('Added status column to kost table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Status column already exists.');
            } else {
                throw err;
            }
        }

        // Ensure users table has role column (it should, but just in case)
        try {
            await connection.query(`
                ALTER TABLE users
                MODIFY COLUMN role ENUM('admin', 'owner') NOT NULL DEFAULT 'owner';
            `);
            console.log('Verified role column in users table.');
        } catch (err) {
            console.error('Error verifying user role:', err);
        }

        console.log('Schema update completed successfully.');
        await connection.end();
    } catch (err) {
        console.error('Error updating schema:', err);
        process.exit(1);
    }
};

updateSchema();
