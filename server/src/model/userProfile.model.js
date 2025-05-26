import pool from "../config/db.js";

// Create userProfile table
const createUserProfileTable = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS user_profile (
  Profile_Type varchar(255),
  HRMS_No varchar(255),
  Employee_Name varchar(255),
  Gender varchar(255),
  Marital_status varchar(255),
  PAN_no varchar(255),
  Email_ID varchar(255),
  Mobile_No varchar(255),
  Present_Address varchar(255),
  Permanent_Address varchar(255),
  Branch_Name varchar(255),
  Branch_Region_Name varchar(255),
  Branch_Type varchar(255),
  Branch_Joining_Date date,
  Designation varchar(255),
  CurrentAppointmentDate date,
  CurrentAppointmentType varchar(255),
  FirstAppointmentDate date,
  FirstJoiningDate date,
  FirstAppointmentType varchar(255),
  EmployeeType varchar(255),
  Approval_Ref_No varchar(255),
  Approval_letter_date date,
  Retirement_date date,
  Appointment_Nature varchar(255),
  Qualifications varchar(255)
  );`;
  await pool.query(query);
  console.log("User Profile table created successfully");
};

createUserProfileTable();

// Insert user profile data into user_profile table
export const insertUserProfile = async (userProfile) => {
  const query = `
    INSERT INTO user_profile (
      Profile_Type, HRMS_No, Employee_Name, Gender, Marital_status, PAN_no, Email_ID, Mobile_No,
      Present_Address, Permanent_Address, Branch_Name, Branch_Region_Name, Branch_Type,
      Branch_Joining_Date, Designation, CurrentAppointmentDate, CurrentAppointmentType,
      FirstAppointmentDate, FirstJoiningDate, FirstAppointmentType, EmployeeType,
      Retirement_date, Appointment_Nature, Qualifications, Approval_Ref_No, Approval_letter_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    userProfile.Profile_Type,
    userProfile.HRMS_No,
    userProfile.Employee_Name,
    userProfile.Gender,
    userProfile.Marital_status,
    userProfile.PAN_no,
    userProfile.Email_ID,
    userProfile.Mobile_No,
    userProfile.Present_Address,
    userProfile.Permanent_Address,
    userProfile.Branch_Name,
    userProfile.Branch_Region_Name,
    userProfile.Branch_Type,
    userProfile.Branch_Joining_Date,
    userProfile.Designation,
    userProfile.CurrentAppointmentDate,
    userProfile.CurrentAppointmentType,
    userProfile.FirstAppointmentDate,
    userProfile.FirstJoiningDate,
    userProfile.FirstAppointmentType,
    userProfile.EmployeeType,
    userProfile.Retirement_date,
    userProfile.Appointment_Nature,
    userProfile.Qualifications,
    userProfile.Approval_Ref_No,
    userProfile.Approval_letter_date,
  ];

  try {
    const [result] = await pool.query(query, values);
    return result;
  } catch (error) {
    console.error("Error inserting user profile:", error.message);
    throw new Error("Failed to insert user profile");
  }
};

// Get user profile by user ID
export const getUserById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM user_profile WHERE id = ?", [id]);
    return rows; // Do NOT throw an error here
};

// Update user profile by id
export const updateUserProfile = async (id, userData) => {
  // List of valid columns in your user_profile table
  const validColumns = [
    "Profile_Type", "HRMS_No", "Employee_Name", "Gender", "Marital_status", "PAN_no", "Email_ID",
    "Mobile_No", "Present_Address", "Permanent_Address", "Branch_Name", "Branch_Region_Name",
    "Branch_Type", "Branch_Joining_Date", "Designation", "CurrentAppointmentDate",
    "CurrentAppointmentType", "FirstAppointmentDate", "FirstJoiningDate", "FirstAppointmentType",
    "EmployeeType", "Approval_Ref_No", "Approval_letter_date", "Retirement_date",
    "Appointment_Nature", "Qualifications" // Only this column for qualification
  ];

  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(userData)) {
    if (validColumns.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields to update");
  }

  const sql = `
    UPDATE user_profile
    SET ${fields.join(', ')}
    WHERE id = ?
  `;

  values.push(id);

  try {
    const [result] = await pool.query(sql, values);
    return result;
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    throw new Error("Failed to update user profile");
  }
};

// get all user profiles
export const getAllUserProfiles = async () => {
  const query = `
    SELECT * FROM user_profile
  `;
  const [result] = await pool.query(query);
  return result;
}

// delete user profile by id
export const deleteUserProfile = async (id) => {
  const query = `
    DELETE FROM user_profile
    WHERE id = ?
  `;
  try {
    const [result] = await pool.query(query, [id]);
    if (result.affectedRows === 0) {
      throw new Error("User profile not found");
    }
    return result;
  } catch (error) {
    console.error("Error deleting user profile:", error.message);
    throw new Error("Failed to delete user profile");
  }
}

// get user profile by HRMS number
export const getUserByHRMSNo = async (hrmsNo) => {
  const query = `
    SELECT * FROM user_profile
    WHERE HRMS_No = ?
  `;
  const [result] = await pool.query(query, [hrmsNo]);
  if (result.length === 0) {
    throw new Error("User profile not found");
  }
  return result;
}

// get users by branch name
export const getUsersByBranchName = async (branchName) => {
  const query = `
    SELECT * FROM user_profile
    WHERE Branch_Name = ?
  `;
  const [result] = await pool.query(query, [branchName]);
  if (result.length === 0) {
    throw new Error("No users found for this branch name");
  }
  return result;
}

// get users by branch region name
export const getUsersByBranchRegionName = async (branchRegionName) => {
  const query = `
    SELECT * FROM user_profile
    WHERE Branch_Region_Name = ?
  `;
  const [result] = await pool.query(query, [branchRegionName]);
  if (result.length === 0) {
    throw new Error("No users found for this branch region name");
  }
  return result;
}