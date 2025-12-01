const db = require('../config/database');

const Document = {
  // Get all documents (mainly for admin/debug)
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM documents');
    return rows;
  },

  // ✅ Role-aware document fetch
  getByLease: async (lease_id, user_id, role) => {
    const query =
      role === 'tenant'
        ? `SELECT * FROM documents WHERE lease_id = ? AND is_visible_to_tenant = TRUE`
        : `SELECT * FROM documents WHERE lease_id = ?`;

    const [rows] = await db.query(query, [lease_id]);
    return rows;
  },

  // ✅ Create with optional replacement and visibility
  create: async (data) => {
    const { lease_id, uploaded_by, file_url, uploaded_at, replace } = data;
    const conn = await db.getConnection();
    let replaced_file_url = null;

    try {
      await conn.beginTransaction();

      const [existingRows] = await conn.query(
        'SELECT * FROM documents WHERE lease_id = ?',
        [lease_id]
      );
      const existing = existingRows[0];

      if (existing && !replace) {
        await conn.rollback();
        const error = new Error('Document already uploaded');
        error.code = 'DUPLICATE_LEASE';
        throw error;
      }

      if (existing && replace) {
        replaced_file_url = existing.file_url;
        await conn.query('DELETE FROM documents WHERE lease_id = ?', [lease_id]);
      }

      const [result] = await conn.query(
        `INSERT INTO documents (lease_id, uploaded_by, file_url, uploaded_at, is_visible_to_tenant)
         VALUES (?, ?, ?, ?, TRUE)`,
        [lease_id, uploaded_by, file_url, uploaded_at]
      );

      const [newRow] = await conn.query(
        'SELECT * FROM documents WHERE document_id = ?',
        [result.insertId]
      );

      await conn.commit();
      return { ...newRow[0], replaced_file_url };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // ✅ Delete by ID
  delete: async (id) => {
    const [result] = await db.query(
      'DELETE FROM documents WHERE document_id = ?',
      [id]
    );
    return result.affectedRows;
  },

  // ✅ Toggle visibility
  toggleVisibility: async (document_id) => {
    await db.query(
      `UPDATE documents
       SET is_visible_to_tenant = NOT is_visible_to_tenant
       WHERE document_id = ?`,
      [document_id]
    );

    const [rows] = await db.query(
      'SELECT * FROM documents WHERE document_id = ?',
      [document_id]
    );
    return rows[0];
  },

  // Optional: find duplicate
  findDuplicate: async (lease_id) => {
    const [rows] = await db.query(
      'SELECT * FROM documents WHERE lease_id = ? LIMIT 1',
      [lease_id]
    );
    return rows[0] || null;
  }
};

module.exports = Document;