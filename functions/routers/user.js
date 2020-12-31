const express = require('express');
const router = express.Router();
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
const { storage } = require('../utils/firebase_services');

router.post('/image', (req, res) => {
	// Save all incoming files to disk
	let imageFileName;
	let imageToBeUploaded = {};

	console.log(req.headers);
	const busboy = new Busboy({ headers: req.headers });

	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
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


	});

	// req.pipe(busboy);
	busboy.end(req.rawBody);
});

router.get('/info', (req, res) => {

	res.end("Info");
});

module.exports = router;