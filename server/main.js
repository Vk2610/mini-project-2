import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const saltRounds = 10;

const hashAndUpdateMobiles = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'project',
  });


  const [users] = await connection.execute('SELECT HRMS_No, Mobile_no FROM users');

  for (const user of users) {
    if (!user.Mobile_no) continue;

    const hashedMobile = await bcrypt.hash(user.Mobile_no, saltRounds);

    const id = uuidv4();

    await connection.execute(
      'UPDATE users SET id = ?, mobile_no = ? WHERE HRMS_No = ?',
      [id, hashedMobile, user.HRMS_No]
    );

    console.log(`Updated user with HRMS_No ${user.HRMS_No}`);
  }

  await connection.end();
  console.log('✅ All mobile numbers have been hashed and UUIDs assigned.');
};


//   get user by mobile no

hashAndUpdateMobiles().catch(console.error);
