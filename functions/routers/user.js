const express = require('express');
const router = express.Router();
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
const { bucket, db } = require('../utils/firebase_services');
const { FBAuth } = require('../utils/auth');
const { reduceUserDetails } = require('../utils/validator');
const { v4: uuidv4 } = require('uuid');

/* ----- ALL ROUTES -----
1. get own user details -> '/user' [DONE]
2. get other user details -> '/user/:handle' [DONE] but haven't fetched likes and notifications collection yet
3. add user details -> '/user' [DONE]
4. upload user's image -> '/user/image' [DONE]
*/

// Get own user details
router.get('/', FBAuth, (req, res) => {
	const userData = { 
		credentials: { ...req.user }, 
		likes: [],
		notifications: [] 
	};
	const { credentials: { handle }, likes, notifications } = userData; 

	return db.collection('likes').where('userHandle', '==', handle).get()
	.then(data => {
		data.forEach(doc => {
			likes.push(doc.data());
		});
		// return res.json(userData);
		return db.collection('notifications').where('recipient', '==', handle).orderBy('createdAt', 'desc').limit(10).get();
	})
	.then(data => {
		data.forEach(doc => {
			notifications.push({
				...doc.data(),
				notificationId: doc.id
			});
		});
		return res.json(userData);
	})
	.catch(err => {
		return res.status(500).json({ error: err.message });
	});
});

// Add user details
router.post('/', FBAuth, (req, res) => {
	let userDetails = reduceUserDetails(req.body); // { bio, website, location }

	db.doc(`/users/${req.user.handle}`).update(userDetails)
	.then(() => {
		return res.json({ message: 'Added details successfully' });
	})
	.catch(err => {
		console.error(err);
		return res.status(500).json({ error: err.message });
	});
});

// Upload user's profile image
router.post('/image', FBAuth, (req, res) => {
	// Save all incoming files to disk
	let imageFileName;
	let imageToBeUploaded = {};

	const busboy = new Busboy({ headers: req.headers });

	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

		// validate file type
		const validImageType = [ 'image/jpeg', 'image/png' ];
		if (!validImageType.includes(mimetype)) {
			return res.status(400).json({ error: "Wrong file type submitted" });
		}

		// name.name.ext
		const imageExtension = filename.split('.').slice(-1)[0];
		// 3423432501.ext
		imageFileName = `${Math.round(Math.random() * 1e10)}.${imageExtension}`;
		const filepath = path.join(os.tmpdir(), imageFileName);
		imageToBeUploaded = { filepath, mimetype }; // using for firebase
		file.pipe(fs.createWriteStream(filepath));
	});
	busboy.on('finish', () => {
		// Upload file
		const firebaseStorageDownloadTokens = uuidv4();
		const { filepath, mimetype } = imageToBeUploaded;
		bucket.upload(filepath, {
			gzip: true,
			metadata: {
				metadata: {
					contentType: mimetype,
					firebaseStorageDownloadTokens
				}
			}
		})
		.then((result) => {
			const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.firebase_storageBucket}/o/${imageFileName}?alt=media&token=${firebaseStorageDownloadTokens}`; // adding 'alt=media' to show the file on a browser and prevent downloading the file to a computer.
			return db.doc(`users/${req.user.handle}`).update({ imageUrl });
		})
		.then(() => {
			return res.json({ message: 'Image uploaded successfully' });
		})
		.catch(err => {
			res.status(500).json({ msg: err.message });
		});
	});
	busboy.end(req.rawBody);
});

// Get another user details
router.get('/:handle', (req, res) => {
	let userData = {};
	db.doc(`users/${req.params.handle}`).get()
	.then(doc => {
		if (!doc.exists) return Promise.reject({ httpCode: 404, message: "User not found" });
		userData = {
			...doc.data(),
			likes: [],
			notifications: [],
			screams: []
		}
		// fetch all user's screams
		return db.collection('screams').where('userHandle', '==', req.params.handle).orderBy('createdAt', 'desc').get();
	})
	.then(data => {
		data.forEach(doc => {
			userData.screams.push({
				...doc.data(),
				screamId: doc.id
			});
		});
		return res.json(userData);
	})
	.catch(err => {
		// return res.status(err.code ? err.code : 500).json({ error: err.message });
		return res.status(err.httpCode ? err.httpCode : 500).json({ err: err.message });
	});
});

module.exports = router;