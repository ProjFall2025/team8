const SmartPasscode = require('../models/SmartPasscode');

const generatePasscode = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

const smartPasscodeController = {
  // GET /api/passcodes/:lease_id
  getByLease: async (req, res) => {
    try {
      const leaseId = parseInt(req.params.lease_id, 10);
      if (isNaN(leaseId)) {
        return res.status(400).json({ message: 'Invalid lease_id' });
      }

      const passcodes = await SmartPasscode.findByLease(leaseId);
      res.json(passcodes);
    } catch (error) {
      console.error('❌ getByLease error:', error);
      res.status(500).json({ message: 'Failed to fetch passcodes' });
    }
  },

  // POST /api/passcodes
  create: async (req, res) => {
  let { lease_id, user_id, passcode, expires_at } = req.body;
  console.log('➡️ Incoming create request:', req.body);

  // If no passcode provided, fallback to random
  if (!passcode) {
    passcode = generatePasscode(); // optional fallback
  }

  const expiresAt = expires_at
    ? new Date(expires_at)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    const newCode = await SmartPasscode.create({
      lease_id,
      user_id,
      passcode,   // <-- now uses manual if provided
      expires_at: expiresAt,
      is_active: true
    });

    res.status(201).json({ message: 'Passcode created', passcode: newCode });
  } catch (error) {
    console.error('❌ create error:', error);
    res.status(500).json({ message: 'Failed to create passcode' });
  }
},

  // DELETE /api/passcodes/:passcode_id
  delete: async (req, res) => {
    try {
      const deleted = await SmartPasscode.delete(req.params.passcode_id);
      if (!deleted) {
        return res.status(404).json({ message: 'Passcode not found' });
      }
      res.json({ message: 'Passcode deleted' });
    } catch (error) {
      console.error('❌ delete error:', error);
      res.status(500).json({ message: 'Failed to delete passcode' });
    }
  },

  // POST /api/passcodes/validate
  validate: async (req, res) => {
    const { passcode } = req.body;
    if (!passcode) {
      return res.status(400).json({ message: 'Passcode required' });
    }

    try {
      // FIX: your model method is SmartPasscode.validate, not findValid
      const match = await SmartPasscode.validate(passcode);

      if (!match) return res.status(404).json({ valid: false });

      res.json({
        valid: true,
        lease_id: match.lease_id,
        user_id: match.user_id,
        expires_at: match.expires_at
      });
    } catch (error) {
      console.error('❌ validate error:', error);
      res.status(500).json({ message: 'Validation failed' });
    }
  },

  // PATCH /api/passcodes/:passcode_id/revoke
  revoke: async (req, res) => {
    try {
      const revoked = await SmartPasscode.revoke(req.params.passcode_id);

      if (!revoked) {
        return res.status(404).json({ message: 'Passcode not found' });
      }

      res.json({ message: 'Passcode revoked' });
    } catch (error) {
      console.error('❌ revoke error:', error);
      res.status(500).json({ message: 'Failed to revoke passcode' });
    }
  },

  // POST /api/passcodes/regenerate
  regenerate: async (req, res) => {
    let { user_id, lease_id } = req.body;

    if (!user_id || !lease_id) {
      return res
        .status(400)
        .json({ message: 'user_id and lease_id required' });
    }

    user_id = parseInt(user_id, 10);
    lease_id = parseInt(lease_id, 10);

    if (isNaN(user_id) || isNaN(lease_id)) {
      return res
        .status(400)
        .json({ message: 'user_id and lease_id must be integers' });
    }

    try {
      // Revoke old ones
      await SmartPasscode.revokeByUserLease(user_id, lease_id);

      // New code
      const passcode = generatePasscode();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const newCode = await SmartPasscode.create({
        lease_id,
        user_id,
        passcode,
        expires_at: expiresAt,
        is_active: true
      });

      res.status(201).json({
        message: 'Passcode regenerated',
        passcode: newCode
      });
    } catch (error) {
      console.error('❌ regenerate error:', error);
      res
        .status(500)
        .json({ message: 'Failed to regenerate passcode' });
    }
  }
};

module.exports = smartPasscodeController;
