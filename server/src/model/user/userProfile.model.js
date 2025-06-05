import pool from "../../config/db.js";

// Create userProfile table
const createUserProfileTable = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS user_profile (
  Profile_Type varchar(255) NULL,
  HRMS_No varchar(255),
  Employee_Name varchar(255) NULL,
  Gender varchar(255) NULL,
  Marital_status varchar(255) NULL,
  PAN_no varchar(255) NULL,
  Email_ID varchar(255),
  Mobile_No varchar(255),
  Present_Address varchar(255) NULL,
  Permanent_Address varchar(255) NULL,
  Branch_Name varchar(255),
  Branch_Region_Name varchar(255),
  Branch_Type varchar(255) NULL,
  Branch_Joining_Date date,
  Designation varchar(255) NULL,
  CurrentAppointmentDate date NULL,
  CurrentAppointmentType varchar(255) NULL,
  FirstAppointmentDate date NULL,
  FirstJoiningDate date NULL,
  FirstAppointmentType varchar(255) NULL,
  EmployeeType varchar(255) NULL,
  Approval_Ref_No varchar(255) NULL,
  Approval_letter_date date NULL,
  Retirement_date date NULL,
  Appointment_Nature varchar(255) NULL,
  Qualifications varchar(255) NULL
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

// Add this helper function at the top of the file
const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10); // Returns YYYY-MM-DD format
};

export const updateUserProfile = async (userId, profileData) => {
    try {
        // Validate userId
        if (!userId) {
            throw new Error('User ID is required');
        }

        // Format and validate the data
        const formattedData = {
            Profile_Type: profileData.Profile_Type || null,
            HRMS_No: profileData.HRMS_No || null,
            Employee_Name: profileData.Employee_Name || null,
            Gender: profileData.Gender || null,
            Marital_status: profileData.Marital_status || null,
            PAN_no: profileData.PAN_no || null,
            Email_ID: profileData.Email_ID || null,
            Mobile_No: profileData.Mobile_No || null,
            Present_Address: profileData.Present_Address || null,
            Permanent_Address: profileData.Permanent_Address || null,
            Branch_Name: profileData.Branch_Name || null,
            Branch_Region_Name: profileData.Branch_Region_Name || null,
            Branch_Type: profileData.Branch_Type || null,
            Branch_Joining_Date: profileData.Branch_Joining_Date ? 
                formatDate(profileData.Branch_Joining_Date) : null,
            Designation: profileData.Designation || null,
            CurrentAppointmentDate: profileData.CurrentAppointmentDate ? 
                formatDate(profileData.CurrentAppointmentDate) : null,
            CurrentAppointmentType: profileData.CurrentAppointmentType || null,
            FirstAppointmentDate: profileData.FirstAppointmentDate ? 
                formatDate(profileData.FirstAppointmentDate) : null,
            FirstJoiningDate: profileData.FirstJoiningDate ? 
                formatDate(profileData.FirstJoiningDate) : null,
            FirstAppointmentType: profileData.FirstAppointmentType || null,
            EmployeeType: profileData.EmployeeType || null,
            Retirement_date: profileData.Retirement_date ? 
                formatDate(profileData.Retirement_date) : null,
            Appointment_Nature: profileData.Appointment_Nature || null,
            Qualifications: profileData.Qualifications || null,
            Approval_Ref_No: profileData.Approval_Ref_No || null,
            Approval_letter_date: profileData.Approval_letter_date ? 
                formatDate(profileData.Approval_letter_date) : null
        };

        // Build dynamic query based on available data
        const updates = [];
        const values = [];

        Object.entries(formattedData).forEach(([key, value]) => {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        });

        // Add userId at the end for WHERE clause
        values.push(userId);

        const query = `
            UPDATE user_profile
            SET ${updates.join(', ')}
            WHERE id = ?
        `;

        const [result] = await pool.execute(query, values);

        if (result.affectedRows === 0) {
            throw new Error('User profile not found');
        }

        return { 
            success: true,
            message: 'Profile updated successfully',
            updatedFields: Object.keys(formattedData).filter(key => formattedData[key] !== undefined)
        };

    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        throw new Error('Failed to update user profile');
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