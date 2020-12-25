const express = require('express');
const router = express.Router();

const { auth, db, admin } = require('../utils/firebase_services');

router.get('/screams', (req, res) => {
	const screams = [];
	db.collection('screams').orderBy('createdAt', 'desc')
	.get()
	.then(snapshot => {
		snapshot.forEach(doc => {
			screams.push({
				...doc.data(),
				screamId: doc.id
			});
		});
		res.json(screams);
	})
	.catch(err => {
		res.status(500).json({ error: 'something went wrong' });
	});
});

// ----- Firebase Authentication Middleware -----
const FBAuth = (req, res, next) => {
	let idToken;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		[, idToken] = req.headers.authorization.split(' ');
	} else {
		console.error('No token found');
		return res.status(401).json({ error: "Unauthorized" });
	}
	// verify tokenId
	admin.auth().verifyIdToken(idToken)
	.then(decodedToken => {
		req.user = decodedToken;
		return db.collection('users').where('userId', '==', req.user.uid).limit(1).get();
	})
	.then(data => {
		req.user.handle = data.docs[0].data().handle;
		return next();
	})
	.catch(err => {
		return res.status(401).json({ error: "Unauthorized" });
	});
}

// ----- Post one scream -----
router.post('/scream', FBAuth, (req, res) => {
	if (req.method !== "POST") {
		return res.status(400).json({ error: "Method not allowd" });
	}

	const newScream = {
		body: req.body.body,
		userHandle: req.user.handle,
		createdAt: new Date().toISOString()
	}

	db.collection('screams').add(newScream)
	.then(doc => {
		res.json({ message: `document ${doc.id} created successfully` });
	})
	.catch(err => {
		res.status(500).json({ error: 'something went wrong' });
	});
});

module.exports = router;