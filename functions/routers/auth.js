const express = require('express');
const router = express.Router();

const { auth, db } = require('../utils/firebase_services');
const { isEmail, isEmpty, validateSignupData, validateSinginData } = require('../utils/validator');

router.post('/sign-up', validateSignupData, (req, res) => {
	const { email, password, confirmPassword, handle } = req.body;
	
	const defaultProfileImage = 'default-profile.png';
	let userToken, userId;

	db.doc(`/users/${handle}`).get()
	.then(doc => {
		if (doc.exists) {
			return res.status(400).json({ handle: 'this handle is already taken' });
		}
		return auth.createUserWithEmailAndPassword(email, password);
	})
	.then(data => {
		userId = data.user.uid;
		return data.user.getIdToken();
	})
	.then(token => {
		userToken = token;
		const userCredentials = {
			handle,
			email,
			createdAt: new Date().toISOString(),
			userId,
			imageUrl: `https://storage.cloud.google.com/${process.env.firebase_storageBucket}/${imageFileName}`
		};
		return db.doc(`/users/${handle}`).set(userCredentials);
	})
	.then(() => {
		return res.status(201).json({ token: userToken });
	})
	.catch(err => {
		res.status(500).json({ error: "something went wrong", msg: err.message });
	});
});

router.post('/login', validateSinginData, (req, res) => {
	const { email, password } = req.body;

	auth.signInWithEmailAndPassword(email, password)
	.then(data => {
		return data.user.getIdToken();
	})
	.then(token => {
		return res.json({ token });
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({ error: err.code });
	});
});

module.exports = router;