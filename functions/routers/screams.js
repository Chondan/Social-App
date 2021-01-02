const express = require('express');
const router = express.Router();

const { db } = require('../utils/firebase_services');
const { FBAuth } = require('../utils/auth');

// ----- ALL ROUTES -----
/* 
1. get all screams [DONE]
2. post one screams [DONE]
3. get one screams -> '/scream/:screamId'
4. delete a scream
5. unlike a scream
6. comment on scream
*/

// ----- Get all screams -----
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