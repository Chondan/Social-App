const { auth, admin, db } = require('./firebase_services');

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
		// req.user.handle = data.docs[0].data().handle;
		req.user = data.docs[0].data();
		return next();
	})
	.catch(err => {
		console.log(err);
		return res.status(401).json({ error: "Unauthorized", msg: err.message });
	});
}

module.exports = { FBAuth };