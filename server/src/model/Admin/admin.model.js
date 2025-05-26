import pool from '../../config/db.js';

const getAllSubAdmins = async () => {
  const query = `SELECT * FROM sub_admins`;
  const [rows] = await
    pool.query(query);
  return rows;
}

const getSubadmin = async (id) => {
  const query = `SELECT * FROM sub_admins WHERE id = ?`;
  const [rows] = await pool.query(query, [id]);
  return rows;
}

const editSubAdmin = async (id, data) => {
  // First get the current data
  const [currentData] = await pool.query('SELECT * FROM sub_admins WHERE id = ?', [id]);

  if (!currentData.length) return false;

  // Build the query dynamically based on changed fields
  let updateFields = [];
  let queryParams = [];

  if (data.name && data.name !== currentData[0].fullname) {
    updateFields.push('fullname = ?');
    queryParams.push(data.name);
  }

  if (data.email && data.email !== currentData[0].email) {
    updateFields.push('email = ?');
    queryParams.push(data.email);
  }

  if (data.branch_name && data.branch_name !== currentData[0].branch_name) {
    updateFields.push('branch_name = ?');
    queryParams.push(data.branch_name);
  }

  // Fixed branch region comparison
  if (data.branch_region_name && data.branch_region_name !== currentData[0].branch_region_name) {
    updateFields.push('branch_region_name = ?');
    queryParams.push(data.branch_region_name);
  }

  // If no fields have changed, return true without making a query
  if (updateFields.length === 0) return true;

  // Add id to params array
  queryParams.push(id);

  const query = `UPDATE sub_admins SET ${updateFields.join(', ')} WHERE id = ?`;
  console.log('Update Query:', query); // Add this for debugging
  console.log('Query Params:', queryParams); // Add this for debugging

  const [result] = await pool.query(query, queryParams);
  return result.affectedRows > 0;
}

export { getAllSubAdmins, getSubadmin, editSubAdmin };