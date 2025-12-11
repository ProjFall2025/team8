const LeaseRequest = require('../models/LeaseRequest');

exports.createRequest = async (req, res) => {
  try {
    const { user_id } = req.body;
    const request = await LeaseRequest.create({ user_id });
    res.json({ message: 'Lease request submitted successfully', request });
  } catch (err) {
    res.status(500).json({ message: 'Error creating lease request', error: err.message });
  }
};

exports.getRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await LeaseRequest.findByUserId(userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await LeaseRequest.findPending();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending requests', error: err.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const updated = await LeaseRequest.updateStatus(requestId, status);
    res.json({ message: 'Lease request updated', updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating request', error: err.message });
  }
};