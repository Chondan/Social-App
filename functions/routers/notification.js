const express = require('express');
const router = express.Router();

const { db } = require('../utils/firebase_services');
const { FBAuth } = require('../utils/auth');

router.put('/',FBAuth, (req, res) => {
	const { notifications } = req.body;

	const batch = db.batch();
	notifications.forEach(notificationId => {
		const notificationRef = db.doc(`notifications/${notificationId}`);
		batch.update(notificationRef, { read: true });
	});
	batch.commit()
	.then(() => {
		return res.json({ message: "Marked notifications as read" });
	})
	.catch(err => {
		return res.status(500).json({ error: err.message });
	})
});

module.exports = router;