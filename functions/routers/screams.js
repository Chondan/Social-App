const express = require('express');
const router = express.Router();

const { db } = require('../utils/firebase_services');
const { FBAuth } = require('../utils/auth');

/* ----- ALL ROUTES -----
1. get all screams [DONE]
2. post one screams [DONE]
3. get one screams -> '/scream/:screamId' [DONE]
4. delete a scream -> '/scream/:screamId' [DONE] -> delete all related document with trigger function
5. like a scream  -> '/scream/:screamId/like' [DONE]
6. unlike a scream -> '/scream/:screamId/unlike' [DONE]
7. comment on scream -> '/scream/:screamId/comment/ [DONE]
*/

// Get all screams
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

// Post one scream
router.post('/scream', FBAuth, (req, res) => {
	if (req.method !== "POST") {
		return res.status(400).json({ error: "Method not allowd" });
	}

	const newScream = {
		body: req.body.body,
		userHandle: req.user.handle,
		createdAt: new Date().toISOString(),
		userImage: req.user.imageUrl,
		likeCount: 0,
		commentCount: 0
	};

	db.collection('screams').add(newScream)
	.then(doc => {
		res.json({... newScream, screamId: doc.id });
	})
	.catch(err => {
		res.status(500).json({ error: 'something went wrong' });
	});
});

// Get one scream
router.get('/scream/:screamId', (req, res) => {
	const { screamId } = req.params;
	let screamData = {};
	db.doc(`/screams/${screamId}`).get()
	.then(doc => {
		if (!doc.exists) {
			return Promise.reject({ httpCode: 404, message: "Scream not found" });
		}
		screamData = doc.data();
		screamData.screamId = doc.id;
		return db.collection('comments').orderBy('createdAt', 'desc').where('screamId', '==', screamId).get();
	})
	.then(data => {
		screamData.comments = [];
		data.forEach(doc => {
			screamData.comments.push(doc.data())
		});
		return res.json(screamData);
	})
	.catch(err => {
		return res.status(err.httpCode ? err.httpCode : 500).json({ error: err.message });
	});
});

// Comment on scream
router.post('/scream/:screamId/comment', FBAuth, (req, res) => {
	const { screamId } = req.params;
	const { body } = req.body;
	const { handle, imageUrl } = req.user;

	if (body.trim() === '') return res.status(404).json({ error: "Comment must not be empty" });

	const newComment = {
		body,
		createdAt: new Date().toISOString(),
		userHandle: handle,
		screamId,
		userImage: imageUrl,
	}

	db.doc(`/screams/${screamId}`).get()
	.then(doc => {
		if (!doc.exists) {
			// return res.status(404).json({ error: "Scream not found" });
			return Promise.reject({ httpCode: 404, message: "Scream not found" });
		}
		// update comment count
		return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
	})
	.then(() => {
		return db.collection('comments').add(newComment);
	})
	.then(() => {
		return res.json(newComment);
	})
	.catch(err => {
		return res.status(err.httpCode ? err.httpCode : 500).json({ error: err.message });
	});
});

// Like a scream
router.post('/scream/:screamId/like', FBAuth, (req, res) => {
	const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
	.where('screamId', '==', req.params.screamId).limit(1);

	const screamDocument = db.doc(`/screams/${req.params.screamId}`);
	let screamData = {};

	screamDocument.get()
	.then(doc => {
		if (!doc.exists) return Promise.reject({ httpCode: 404, message: "Scream not found" });
		screamData = doc.data();
		return likeDocument.get();
	})
	.then(data => {
		if (!data.empty) return Promise.reject({ httpCode: 404, message: "Scream is already liked" });

		// adding new like document
		return db.collection('likes').add({
			screamId: req.params.screamId,
			userHandle: req.user.handle
		});
	})
	.then(() => {
		// update an amount of likes in screams doc
		return screamDocument.update({
			likeCount: ++screamData.likeCount
		});
	})
	.then(() => {
		return res.json(screamData);
	})
	.catch(err => {
		return res.status(err.httpCode ? err.httpCode : 500).json({ error: err.message });
	});
});

// Unlike a scream
router.post('/scream/:screamId/unlike', FBAuth, (req, res) => {
	const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
	.where('screamId', '==', req.params.screamId).limit(1);

	const screamDocument = db.doc(`/screams/${req.params.screamId}`);
	let screamData = {};

	screamDocument.get()
	.then(doc => {
		if (!doc.exists) return Promise.reject({ httpCode: 404, message: "Scream not found" });
		screamData = doc.data();
		return likeDocument.get();
	})
	.then(data => {
		if (data.empty) return Promise.reject({ httpCode: 404, message: "Scream is already unliked" });

		const doc = data.docs[0]; // to access doc_data = doc.data(), doc_id = doc.id
		// delete like document
		return db.collection('likes').doc(doc.id).delete();
	})
	.then(() => {
		// update an amount of likes in screams doc
		return screamDocument.update({
			likeCount: --screamData.likeCount
		});
	})
	.then(() => {
		return res.json(screamData);
	})
	.catch(err => {
		return res.status(err.httpCode ? err.httpCode : 500).json({ error: err.message });
	});
});

// Delete a scream
router.delete('/scream/:screamId', FBAuth, (req, res) => {
	const docToDelete = db.doc(`/screams/${req.params.screamId}`);
	docToDelete.get()
	.then(doc => {
		if (!doc.exists) return Promise.reject({ httpCode: 404, message: "Scream not found" });

		// is the user is the owner of this scream
		if (doc.data().userHandle !== req.user.handle) return Promise.reject({ httpCode: 403, message: "Forbidden, You can only delete your own screams." });

		return docToDelete.delete();
		// Should we also delete all documents related with the document we are going to delete?
	})
	.then(() => {
		res.json({ message: "Deleted scream successfully" });
	})
	.catch(err => {
		return res.status(err.httpCode ? err.httpCode : 500).json({ error: err.message });
	});
});

module.exports = router;