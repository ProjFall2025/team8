const db = require('../config/database');

const SmartPasscode = {
<<<<<<< HEAD
  async findByLease(leaseId) {
    const [rows] = await db.query(
      'SELECT * FROM smartpasscodes WHERE lease_id = ?',
      [leaseId]
    );
    return rows;
  },

  async create(data) {
    const leaseId = parseInt(data.lease_id, 10);
    const userId = parseInt(data.user_id, 10);

    if (isNaN(leaseId) || isNaN(userId)) {
      throw new Error('Invalid lease_id or user_id: must be integers');
    }

    const safeData = {
      passcode: data.passcode,
      lease_id: leaseId,
      user_id: userId,
      expires_at: data.expires_at instanceof Date
        ? data.expires_at.toISOString().slice(0, 19).replace('T', ' ')
        : data.expires_at,
      is_active: data.is_active ? 1 : 0
    };

    const [result] = await db.query('INSERT INTO smartpasscodes SET ?', safeData);
    return { passcode_id: result.insertId, ...safeData };
  },

  async delete(passcodeId) {
    const [result] = await db.query(
      'DELETE FROM smartpasscodes WHERE passcode_id = ?',
      [passcodeId]
    );
    return result.affectedRows > 0;
  },

  async validate(passcode) {
    const [rows] = await db.query(
      `SELECT * FROM smartpasscodes 
       WHERE passcode = ? AND is_active = 1 AND expires_at > NOW()`,
      [passcode]
    );
    return rows[0] || null;
  },

  async revoke(passcodeId) {
    const [result] = await db.query(
      'UPDATE smartpasscodes SET is_active = 0 WHERE passcode_id = ?',
      [passcodeId]
    );
    return result.affectedRows > 0;
  },

  async revokeByUserLease(userId, leaseId) {
    const safeUserId = parseInt(userId, 10);
    const safeLeaseId = parseInt(leaseId, 10);

    if (isNaN(safeUserId) || isNaN(safeLeaseId)) {
      throw new Error('Invalid user_id or lease_id: must be integers');
    }

    const [result] = await db.query(
      'UPDATE smartpasscodes SET is_active = 0 WHERE user_id = ? AND lease_id = ? AND is_active = 1',
      [safeUserId, safeLeaseId]
    );
    return result.affectedRows > 0;
=======
  findByLease: (leaseId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM smart_passcodes WHERE lease_id = ?', [leaseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO smart_passcodes SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ passcode_id: result.insertId, ...data });
      });
    });
  },

  delete: (passcodeId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM smart_passcodes WHERE passcode_id = ?', [passcodeId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  }
};

module.exports = SmartPasscode;