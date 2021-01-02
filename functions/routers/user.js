const express = require('express');
const router = express.Router();
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
const { bucket, db } = require('../utils/firebase_services');
const { FBAuth } = require('../utils/auth');
const { reduceUserDetails } = require('../utils/validator');

// Get own user details
router.get('/', FBAuth, (req, res) => {
	const userData = { 
		credentials: { ...req.user }, 
		likes: [] 
	};
	const { credentials: { handle }, likes } = userData; 

	return db.collection('likes').where('userHandle', '==', handle).get()
	.then(data => {
		data.forEach(doc => {
			likes.push(doc.data());
		});
		return res.json(userData);
	})
	.catch(err => {
		return res.status(500).json({ error: err.code });
	});
});

// Add user details
router.post('/', FBAuth, (req, res) => {
	let userDetails = reduceUserDetails(req.body);

	db.doc(`/users/${req.user.handle}`).update(userDetails)
	.then(() => {
		return res.json({ message: 'Details added successfully' });
	})
	.catch(err => {
		console.error(err);
		return res.status(500).json({ error: err.code });
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
		const { filepath, mimetype } = imageToBeUploaded;
		bucket.upload(filepath, {
			gzip: true,
			metadata: {
				metadata: {
					contentType: mimetype
				}
			}
		})
		.then(() => {
			const imageUrl = `https://storage.cloud.google.com/${process.env.firebase_storageBucket}/${imageFileName}`; // adding 'alt=media' to show the file on a browser and prevent downloading the file to a computer.
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

module.exports = router;