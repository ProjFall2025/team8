SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE LeasePhotos;
TRUNCATE TABLE Photos;
TRUNCATE TABLE LeaseArchive;
TRUNCATE TABLE Documents;
TRUNCATE TABLE MaintenanceRequests;
TRUNCATE TABLE PaymentHistory;
TRUNCATE TABLE Payments;
TRUNCATE TABLE LeaseTenants;
TRUNCATE TABLE Leases;
TRUNCATE TABLE Properties;
TRUNCATE TABLE UserIDs;
TRUNCATE TABLE SmartPasscodes;
TRUNCATE TABLE UserReminders;
TRUNCATE TABLE TenantHistory;
TRUNCATE TABLE Users;

SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO Users (name, email, phone, mobile_number, role, password)
VALUES
('User1', 'u1@mail.com', '111-1111', '911-1111', 'admin', 'pw1'),
('User2', 'u2@mail.com', '222-2222', '922-2222', 'tenant', 'pw2'),
('User3', 'u3@mail.com', '333-3333', '933-3333', 'tenant', 'pw3'),
('User4', 'u4@mail.com', '444-4444', '944-4444', 'landlord', 'pw4'),
('User5', 'u5@mail.com', '555-5555', '955-5555', 'landlord', 'pw5'),
('User6', 'u6@mail.com', '666-6666', '966-6666', 'tenant', 'pw6'),
('User7', 'u7@mail.com', '777-7777', '977-7777', 'tenant', 'pw7'),
('User8', 'u8@mail.com', '888-8888', '988-8888', 'tenant', 'pw8'),
('User9', 'u9@mail.com', '999-9999', '999-9999', 'tenant', 'pw9'),
('User10', 'u10@mail.com', '101-0101', '910-1010', 'landlord', 'pw10');

INSERT INTO UserIDs (user_id, id_type, id_number, id_photo_url, uploaded_at)
VALUES
(1, 'passport', 'ID001', 'id1.jpg', '2025-01-01 10:00:00'),
(2, 'license', 'ID002', 'id2.jpg', '2025-01-02 10:00:00'),
(3, 'passport', 'ID003', 'id3.jpg', '2025-01-03 10:00:00'),
(4, 'license', 'ID004', 'id4.jpg', '2025-01-04 10:00:00'),
(5, 'passport', 'ID005', 'id5.jpg', '2025-01-05 10:00:00'),
(6, 'license', 'ID006', 'id6.jpg', '2025-01-06 10:00:00'),
(7, 'passport', 'ID007', 'id7.jpg', '2025-01-07 10:00:00'),
(8, 'license', 'ID008', 'id8.jpg', '2025-01-08 10:00:00'),
(9, 'passport', 'ID009', 'id9.jpg', '2025-01-09 10:00:00'),
(10, 'license', 'ID010', 'id10.jpg', '2025-01-10 10:00:00');


INSERT INTO Properties (address, city, state, zip, rent_amount, status)
VALUES
('101 Main St', 'City1', 'ST', '00001', 1000.00, 'available'),
('102 Main St', 'City2', 'ST', '00002', 1100.00, 'occupied'),
('103 Main St', 'City3', 'ST', '00003', 1200.00, 'available'),
('104 Main St', 'City4', 'ST', '00004', 1300.00, 'occupied'),
('105 Main St', 'City5', 'ST', '00005', 1400.00, 'available'),
('106 Main St', 'City6', 'ST', '00006', 1500.00, 'occupied'),
('107 Main St', 'City7', 'ST', '00007', 1600.00, 'available'),
('108 Main St', 'City8', 'ST', '00008', 1700.00, 'occupied'),
('109 Main St', 'City9', 'ST', '00009', 1800.00, 'available'),
('110 Main St', 'City10', 'ST', '00010', 1900.00, 'occupied');

INSERT INTO Leases (property_id, user_id, start_date, end_date, lease_file_url)
VALUES
(1, 2, '2025-01-01', '2025-12-31', 'lease1.pdf'),
(2, 3, '2025-02-01', '2025-11-30', 'lease2.pdf'),
(3, 4, '2025-03-01', '2026-02-28', 'lease3.pdf'),
(4, 5, '2025-04-01', '2026-03-31', 'lease4.pdf'),
(5, 6, '2025-05-01', '2026-04-30', 'lease5.pdf'),
(6, 7, '2025-06-01', '2026-05-31', 'lease6.pdf'),
(7, 8, '2025-07-01', '2026-06-30', 'lease7.pdf'),
(8, 9, '2025-08-01', '2026-07-31', 'lease8.pdf'),
(9, 10, '2025-09-01', '2026-08-31', 'lease9.pdf'),
(10, 1, '2025-10-01', '2026-09-30', 'lease10.pdf');

INSERT INTO LeaseTenants (lease_id, user_id)
VALUES
(1, 2), (2, 3), (3, 4), (4, 5), (5, 6),
(6, 7), (7, 8), (8, 9), (9, 10), (10, 1);

INSERT INTO Payments (user_id, lease_id, amount, paid_date, status, payment_type, payment_for_month)
VALUES
(2, 1, 1000.00, '2025-01-05', 'completed', 'regular', '2025-01-01'),
(3, 2, 1100.00, '2025-02-05', 'completed', 'regular', '2025-02-01'),
(4, 3, 1200.00, '2025-03-05', 'completed', 'regular', '2025-03-01'),
(5, 4, 1300.00, '2025-04-05', 'completed', 'regular', '2025-04-01'),
(6, 5, 1400.00, '2025-05-05', 'completed', 'regular', '2025-05-01'),
(7, 6, 1500.00, '2025-06-05', 'completed', 'regular', '2025-06-01'),
(8, 7, 1600.00, '2025-07-05', 'completed', 'regular', '2025-07-01'),
(9, 8, 1700.00, '2025-08-05', 'completed', 'regular', '2025-08-01'),
(10, 9, 1800.00, '2025-09-05', 'completed', 'regular', '2025-09-01'),
(1, 10, 1900.00, '2025-10-05', 'completed', 'regular', '2025-10-01');

INSERT INTO PaymentHistory (payment_id, status, late_fee_applied, note, updated_at)
VALUES
(1, 'completed', 0, 'Paid on time', '2025-01-06 10:00:00'),
(2, 'completed', 0, 'Paid on time', '2025-02-06 10:00:00'),
(3, 'completed', 0, 'Paid on time', '2025-03-06 10:00:00'),
(4, 'completed', 0, 'Paid on time', '2025-04-06 10:00:00'),
(5, 'completed', 0, 'Paid on time', '2025-05-06 10:00:00'),
(6, 'completed', 0, 'Paid on time', '2025-06-06 10:00:00'),
(7, 'completed', 0, 'Paid on time', '2025-07-06 10:00:00'),
(8, 'completed', 0, 'Paid on time', '2025-08-06 10:00:00'),
(9, 'completed', 0, 'Paid on time', '2025-09-06 10:00:00'),
(10, 'completed', 0, 'Paid on time', '2025-10-06 10:00:00');


INSERT INTO MaintenanceRequests (property_id, user_id, description, status, created_at)
VALUES
(1, 2, 'Leaky faucet', 'open', '2025-01-10 09:00:00'),
(2, 3, 'Broken heater', 'in_progress', '2025-02-12 10:00:00'),
(3, 4, 'Clogged drain', 'closed', '2025-03-15 11:00:00'),
(4, 5, 'Window stuck', 'open', '2025-04-18 12:00:00'),
(5, 6, 'AC not working', 'closed', '2025-05-20 13:00:00'),
(6, 7, 'Pest issue', 'in_progress', '2025-06-22 14:00:00'),
(7, 8, 'Water leak', 'open', '2025-07-25 15:00:00'),
(8, 9, 'Broken lock', 'closed', '2025-08-28 16:00:00'),
(9, 10, 'No hot water', 'in_progress', '2025-09-30 17:00:00'),
(10, 1, 'Ceiling crack', 'open', '2025-10-02 18:00:00');


INSERT INTO Documents (lease_id, uploaded_by, file_url)
VALUES
(1, 2, 'doc1.pdf'),
(2, 3, 'doc2.pdf'),
(3, 4, 'doc3.pdf'),
(4, 5, 'doc4.pdf'),
(5, 6, 'doc5.pdf'),
(6, 7, 'doc6.pdf'),
(7, 8, 'doc7.pdf'),
(8, 9, 'doc8.pdf'),
(9, 10, 'doc9.pdf'),
(10, 1, 'doc10.pdf');


INSERT INTO LeaseArchive (lease_id, user_id, lease_pdf_url, archived_at)
VALUES
(1, 2, 'archive1.pdf', '2025-12-31 10:00:00'),
(2, 3, 'archive2.pdf', '2025-12-31 10:00:00'),
(3, 4, 'archive3.pdf', '2025-12-31 10:00:00'),
(4, 5, 'archive4.pdf', '2025-12-31 10:00:00'),
(5, 6, 'archive5.pdf', '2025-12-31 10:00:00'),
(6, 7, 'archive6.pdf', '2025-12-31 10:00:00'),
(7, 8, 'archive7.pdf', '2025-12-31 10:00:00'),
(8, 9, 'archive8.pdf', '2025-12-31 10:00:00'),
(9, 10, 'archive9.pdf', '2025-12-31 10:00:00'),
(10, 1, 'archive10.pdf', '2025-12-31 10:00:00');

INSERT INTO Photos (property_id, image_url, caption, uploaded_at)
VALUES
(1, 'p1.jpg', 'Front view', '2025-01-01 09:00:00'),
(2, 'p2.jpg', 'Living room', '2025-01-02 09:00:00'),
(3, 'p3.jpg', 'Kitchen', '2025-01-03 09:00:00'),
(4, 'p4.jpg', 'Bedroom', '2025-01-04 09:00:00'),
(5, 'p5.jpg', 'Bathroom', '2025-01-05 09:00:00'),
(6, 'p6.jpg', 'Balcony', '2025-01-06 09:00:00'),
(7, 'p7.jpg', 'Garage', '2025-01-07 09:00:00'),
(8, 'p8.jpg', 'Backyard', '2025-01-08 09:00:00'),
(9, 'p9.jpg', 'Dining area', '2025-01-09 09:00:00'),
(10, 'p10.jpg', 'Hallway', '2025-01-10 09:00:00');

INSERT INTO LeasePhotos (lease_id, photo_url, uploaded_by, is_visible_to_tenant, uploaded_at)
VALUES
(1, 'lp1.jpg', 2, 1, '2025-01-01 10:00:00'),
(2, 'lp2.jpg', 3, 1, '2025-01-02 10:00:00'),
(3, 'lp3.jpg', 4, 0, '2025-01-03 10:00:00'),
(4, 'lp4.jpg', 5, 1, '2025-01-04 10:00:00'),
(5, 'lp5.jpg', 6, 0, '2025-01-05 10:00:00'),
(6, 'lp6.jpg', 7, 1, '2025-01-06 10:00:00'),
(7, 'lp7.jpg', 8, 0, '2025-01-07 10:00:00'),
(8, 'lp8.jpg', 9, 1, '2025-01-08 10:00:00'),
(9, 'lp9.jpg', 10, 0, '2025-01-09 10:00:00'),
(10, 'lp10.jpg', 1, 1, '2025-01-10 10:00:00');

INSERT INTO SmartPasscodes (lease_id, user_id, passcode, created_at, expires_at, is_active)
VALUES
(1, 2, '1111', '2025-01-01 09:00:00', '2025-01-31 23:59:59', 1),
(2, 3, '2222', '2025-02-01 09:00:00', '2025-02-28 23:59:59', 1),
(3, 4, '3333', '2025-03-01 09:00:00', '2025-03-31 23:59:59', 1),
(4, 5, '4444', '2025-04-01 09:00:00', '2025-04-30 23:59:59', 1),
(5, 6, '5555', '2025-05-01 09:00:00', '2025-05-31 23:59:59', 1),
(6, 7, '6666', '2025-06-01 09:00:00', '2025-06-30 23:59:59', 1),
(7, 8, '7777', '2025-07-01 09:00:00', '2025-07-31 23:59:59', 1),
(8, 9, '8888', '2025-08-01 09:00:00', '2025-08-31 23:59:59', 1),
(9, 10, '9999', '2025-09-01 09:00:00', '2025-09-30 23:59:59', 1),
(10, 1, '0000', '2025-10-01 09:00:00', '2025-10-31 23:59:59', 1);

INSERT INTO UserReminders (user_id, type, message, remind_at, is_sent)
VALUES
(2, 'payment', 'Rent due Nov 1', '2025-10-28 09:00:00', FALSE),
(3, 'payment', 'Rent due Oct 1', '2025-09-28 09:00:00', TRUE),
(4, 'late_fee', 'Late fee applied for Oct', '2025-11-02 10:00:00', FALSE),
(7, 'lease', 'Lease renewal due Dec 1', '2025-11-15 09:00:00', FALSE),
(8, 'payment', 'Rent due Aug 1', '2025-07-28 09:00:00', TRUE),
(9, 'late_fee', 'Reminder: late fee pending', '2025-08-05 08:30:00', FALSE),
(10, 'lease', 'Lease ends April 30', '2025-04-01 09:00:00', TRUE),
(2, 'payment', 'Rent due April 1', '2025-03-28 09:00:00', TRUE),
(3, 'payment', 'Rent due March 1', '2025-02-25 09:00:00', TRUE),
(4, 'late_fee', 'Final notice: late fee unpaid', '2025-03-05 10:00:00', FALSE);


INSERT INTO TenantHistory (lease_id, user_id, activity_type)
VALUES
(1, 2, 'payment'),
(2, 3, 'maintenance'),
(3, 4, 'lease_change'),
(4, 5, 'payment'),
(5, 6, 'maintenance'),
(6, 7, 'lease_change'),
(7, 8, 'payment'),
(8, 9, 'maintenance'),
(9, 10, 'lease_change'),
(10, 1, 'payment');