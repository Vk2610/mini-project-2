import { pool } from "../../config/db.js";

// Function to create the application form table
const createApplicationFormTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS applicationForm (
        id CHAR(36) PRIMARY KEY,
        memberNo VARCHAR(255),
        name VARCHAR(255),
        address VARCHAR(255),
        mobile VARCHAR(15),
        whatsappNo VARCHAR(15),
        email VARCHAR(255),
        hrmsNo VARCHAR(255),
        date DATE,
        branch VARCHAR(255),
        designation VARCHAR(255),    
        permanentAddress VARCHAR(255),
        appointmentDate DATE,
        confirmationDate DATE,
        birthDate DATE,
        retirementDate DATE,
        nomineeName VARCHAR(255),    
        nomineeRelation VARCHAR(255),    
        alternateNomineeName VARCHAR(255),    
        alternateNomineeRelation VARCHAR(255),    
        bankMemberNo VARCHAR(255),    
        bankBranch VARCHAR(255),    
        pre2017MemberNo VARCHAR(255),    
        subscriptionAmount VARCHAR(255),    
        signature VARCHAR(2083),
        Status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        remarks varchar(2000) DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        principal_sign_stamp VARCHAR(2083) DEFAULT NULL,
        approval_date DATE DEFAULT NULL
    )`;
    await pool.query(query);
  console.log("Application form table created or already exists.");
};

createApplicationFormTable();

// Function to insert application form data into the database
export const applicationFormData = async (data) => {
    const id = data.id;
    const query = `
        INSERT INTO applicationForm (
            id, memberNo, name, address, mobile, whatsappNo, email, hrmsNo, branch, designation,
            permanentAddress, appointmentDate, confirmationDate, birthDate, retirementDate,
            nomineeName, nomineeRelation, alternateNomineeName, alternateNomineeRelation,
            bankMemberNo, bankBranch, pre2017MemberNo, subscriptionAmount, signature, Status,
            remarks, principal_sign_stamp, approval_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      id,
        data.memberNo,
        data.fullName,
        data.permanentAddress,
        data.mobileNo,
        data.whatsappNo,
        data.email,
        data.hrmsNo,
        data.branch,
        data.designation,
        data.permanentAddress,
        data.appointmentDate,
        data.confirmationDate,
        data.birthDate,
        data.retirementDate,
        data.nomineeName,
        data.nomineeRelation,
        data.alternateNomineeName,
        data.alternateNomineeRelation,
        data.bankMemberNo,
        data.bankBranch,
        data.pre2017MemberNo,
        data.subscriptionAmount,
      data.signature,
      data.Status || 'pending',
      data.remarks || null,
      data.principal_sign_stamp || null,
      data.approval_date || null
    ];

    await pool.query(query, values);
    return { id, ...data };
};

// check form submitted or not
export const getFormById = async (id) => {
  try {
    const query = `SELECT * FROM applicationForm WHERE id = ?`;
    const values = [id]; // Use the `id` parameter correctly
    const [result] = await pool.query(query, values);
    return result;
  } catch (error) {
    console.error("Error executing checkFormSubmitted query:", error);
    throw error;
  }
};