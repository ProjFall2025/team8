const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const leasesRoutes = require('./routes/leases');
const leaseArchiveRoutes = require('./routes/leaseArchive');
const leasePhotosRoutes = require('./routes/leasePhotos');
const leaseTenantsRoutes = require('./routes/leaseTenants');
const documentsRoutes = require('./routes/documents');
const maintenanceRoutes = require('./routes/maintenance');
const paymentsRoutes = require('./routes/payments');
const paymentHistoryRoutes = require('./routes/paymentHistory');
const photosRoutes = require('./routes/photos');
const propertiesRoutes = require('./routes/properties');
const smartPasscodesRoutes = require('./routes/smartPasscodes');
const tenantHistoryRoutes = require('./routes/tenantHistory');
const userIDsRoutes = require('./routes/userIDs');
const userRemindersRoutes = require('./routes/userReminders');
const userRoutes = require('./routes/users'); // ✅ Added

app.use('/api/auth', authRoutes);
app.use('/api/leases', leasesRoutes);
app.use('/api/lease-archive', leaseArchiveRoutes);
app.use('/api/lease-photos', leasePhotosRoutes);
app.use('/api/lease-tenants', leaseTenantsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/payment-history', paymentHistoryRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/smart-passcodes', smartPasscodesRoutes);
app.use('/api/tenant-history', tenantHistoryRoutes);
app.use('/api/user-ids', userIDsRoutes);
app.use('/api/user-reminders', userRemindersRoutes);
app.use('/api/users', userRoutes); // ✅ Mounted

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});