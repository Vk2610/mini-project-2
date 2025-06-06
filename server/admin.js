import bcrypt from 'bcrypt';
import { pool } from './src/config/db.js';
import { v4 as uuidv4 } from 'uuid';

const createAdmin = async () => {
    try {
        const password = 'admin';
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminId = uuidv4(); // Generate UUID for admin
        
        const query = `
            INSERT INTO user_profile (id, HRMS_No, password, role) 
            VALUES (?, ?, ?, ?)
        `;
        
        await pool.query(query, [adminId, 'admin', hashedPassword, 'admin']);
        console.log('Admin user created successfully');
        console.log('Admin ID:', adminId); // Log the generated ID
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        process.exit();
    }
};

createAdmin();