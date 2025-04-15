import { pool } from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

// Create forms table if not exists
const createFormTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS forms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lastName VARCHAR(255),
        firstName VARCHAR(255),
        middleName VARCHAR(255),
        position VARCHAR(255),
        branch VARCHAR(255),
        address TEXT,
        mobileNo VARCHAR(15),
        whatsappNo VARCHAR(15),
        email VARCHAR(255),
        dateOfAppointment DATE,
        permanentDate DATE,
        dateOfBirth DATE,
        dateOfRetirement DATE,
        bankRegNo VARCHAR(255),
        bankBranch VARCHAR(255),
        oldUserID VARCHAR(255),
        oldSubscriptionAmt VARCHAR(255),
        hrmsNo VARCHAR(255),
        nominee1 VARCHAR(255),
        relation1 VARCHAR(255),
        nominee2 VARCHAR(255),
        relation2 VARCHAR(255)
      );
    `;
    await pool.query(query);
    console.log('Forms table created or already exists.');
  } catch (error) {
    console.error('Error creating forms table:', error);
    throw error;
  }
};
createFormTable();

// Save form data
export const saveFormData = async (formData) => {
  try {
    const query = `
      INSERT INTO forms (
        lastName, firstName, middleName, position, branch, address, mobileNo, whatsappNo, email,
        dateOfAppointment, permanentDate, dateOfBirth, dateOfRetirement, bankRegNo, bankBranch,
        oldUserID, oldSubscriptionAmt, hrmsNo, nominee1, relation1, nominee2, relation2
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      formData.lastName,
      formData.firstName,
      formData.middleName,
      formData.position,
      formData.branch,
      formData.address,
      formData.mobileNo,
      formData.whatsappNo,
      formData.email,
      formData.dateOfAppointment,
      formData.permanentDate,
      formData.dateOfBirth,
      formData.dateOfRetirement,
      formData.bankRegNo,
      formData.bankBranch,
      formData.oldUserID,
      formData.oldSubscriptionAmt,
      formData.hrmsNo,
      formData.nominee1,
      formData.relation1,
      formData.nominee2,
      formData.relation2
    ];

    const [result] = await pool.execute(query, values);
    return result;
  } catch (error) {
    console.error('Error saving form data:', error);
    throw error;
  }
};

// Get form data by ID
export const getFormById = async (id) => {
  try {
    const query = 'SELECT * FROM forms WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching form data:', error);
    throw error;
  }
};

