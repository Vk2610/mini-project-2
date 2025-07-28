import { pool } from '../../config/db.js';

// get admin profile
export const getAdminProfile = async (id) => {
  const query = `SELECT * FROM user_profile WHERE id = ? AND role = 'admin'`;
  const [rows] = await pool.query(query, [id]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
}

// update admin phone and email 

export const updateAdmin = async (id, updates) => {
  try {
    const updateFields = Object.keys(updates);
    const query = `
            UPDATE user_profile 
            SET ${updateFields.map(field => `${field} = ?`).join(', ')}
            WHERE id = ? AND role = 'admin'
        `;

    const values = [...Object.values(updates), id];
    const [result] = await pool.query(query, values);

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error in updateAdmin:', error);
    throw error;
  }
};

export const getAllSubAdmins = async () => {
  const query = `SELECT * FROM user_profile WHERE role = 'sub-admin'`;
  const [rows] = await
    pool.query(query);
  return rows;
}

export const getSubadmin = async (id) => {
  const query = `SELECT * FROM user_profile WHERE id = ? AND role = 'sub-admin'`;
  const [rows] = await pool.query(query, [id]);
  return rows;
}

export const editSubAdmin = async (id, data) => {
  // First get the current data
  const [currentData] = await pool.query('SELECT * FROM user_profile WHERE id = ?', [id]);

  if (!currentData.length) return false;

  // Build the query dynamically based on changed fields
  let updateFields = [];
  let queryParams = [];

  if (data.name && data.name !== currentData[0].Employee_Name) {
    updateFields.push('Employee_Name = ?');
    queryParams.push(data.name);
  }

  if (data.Email_ID && data.Email_ID !== currentData[0].Email_ID) {
    updateFields.push('Email_ID = ?');
    queryParams.push(data.Email_ID);
  }

  if (data.Branch_Name && data.Branch_Name !== currentData[0].Branch_Name) {
    updateFields.push('Branch_Name = ?');
    queryParams.push(data.Branch_Name);
  }

  // Fixed branch region comparison
  if (data.Branch_Region_Name && data.Branch_Region_Name !== currentData[0].Branch_Region_Name) {
    updateFields.push('Branch_Region_Name = ?');
    queryParams.push(data.Branch_Region_Name);
  }

  // If no fields have changed, return true without making a query
  if (updateFields.length === 0) return true;

  // Add id to params array
  queryParams.push(id);

  const query = `UPDATE user_profile SET ${updateFields.join(', ')} WHERE id = ?`;
  console.log('Update Query:', query); // Add this for debugging
  console.log('Query Params:', queryParams); // Add this for debugging

  const [result] = await pool.query(query, queryParams);
  return result.affectedRows > 0;
}

export const getApplications = async (id) => {
  const query = `SELECT * FROM applicationform WHERE status = 'approved'`;
  const [rows] = await pool.query(query, [id]);
  return rows;
}

export const getApplicationId = async (id) => {
  const query = `SELECT * FROM applicationform WHERE id = ?`;
  const [rows] = await pool.query(query, [id]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

// update the status of the application
export const updateApplicationStatus = async (id, status) => {
  const query = `UPDATE applicationform SET status = ? WHERE id = ?`;
  const [result] = await pool.query(query, [status, id]);
  return result.affectedRows > 0;
};

export const deleteApplication = async (id) => {
  const query = `DELETE FROM applicationform WHERE id = ?`;
  const [result] = await pool.query(query, [id]);
  return result.affectedRows > 0;
}

