const express = require('express');
const router = express.Router();

const { auth, db } = require('../utils/firebase_services');
const { isEmail, isEmpty, validateSignupData, validateSinginData } = require('../utils/validator');

/* ----- ALL ROUTES -----
1. sign up -> '/sign-up' [DONE]
2. log in -> '/login' [DONE]
*/

router.post('/sign-up', validateSignupData, (req, res) => {
	const { email, password, confirmPassword, handle } = req.body;
	
	const defaultProfileImage = 'default-profile.png';
	let userToken, userId;

	db.doc(`/users/${handle}`).get()
	.then(doc => {
		if (doc.exists) {
			return Promise.reject({ httpCode: 400, message: "This handle is already taken" });
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
			imageUrl: `https://firebasestorage.googleapis.com/v0/b/${process.env.firebase_storageBucket}/o/${defaultProfileImage}?alt=media&token=${process.env.firebase_default_profile_image_access_token}`
		};
		return db.doc(`/users/${handle}`).set(userCredentials);
	})
	.then(() => {
		return res.status(201).json({ token: userToken });
	})
	.catch(err => {
		res.status(err.httpCode ? err.httpCode : 500).json({ error: "something went wrong, please try again.", message: err.message });
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
		return res.status(500).json({ error: "something went wrong, please try again", message: err.message });
	});
});

module.exports = router;