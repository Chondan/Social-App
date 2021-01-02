# Social App

## Problems 
- Handling uplaoded file using busboy
	- links
		- https://stackoverflow.com/questions/56091250/firebase-and-busboy-do-i-get-the-whole-file-in-memory-or
		- https://cloud.google.com/functions/docs/writing/http#multipart_data
```JavaScript
router.post('/image', (req, res) => {
	// Save all incoming files to disk
	let imageFileName;
	let imageToBeUploaded = {};

	console.log(req.headers);
	const busboy = new Busboy({ headers: req.headers });

	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		console.log(fieldname, file, filename, encoding, mimetype);
		// name.name.ext
		const imageExtension = filename.split('.').slice(-1)[0];
		// 3423432501.ext
		imageFileName = `${Math.round(Math.random() * 1e10)}.${imageExtension}`;
		const filepath = path.join(os.tmpdir(), imageFileName);
		imageToBeUploaded = { filepath, mimetype }; // using for firebase
		file.pipe(fs.createWriteStream(filepath));
	});

	busboy.on('finish', () => {
		res.json({ msg: "finished test"} );
	});

	// req.pipe(busboy); // However this does not work in Firebase.
	busboy.end(req.rawBody); // Use this instead
});
```


---

## Lesson Learned
- Firebase
	- we can use 'express' library with firebase function
	- we can set deployment region of firebase function
	- emulator -> run firebase function locally during developing
		- `firebase emulators:start` or `firebase serve`
	- verify tokenId (JWT) -> https://firebase.google.com/docs/auth/admin/verify-id-tokens
	- Firebase Storage 
		- Firebase Storage is currently browser JS only. Since 'Google Cloud Storage' already provides a number of high quality client libraries. 
- JavaScript
	- string method
		- `.startsWith('Bearer')`
- Export modules
```JavaScript
module.exports = () => console.log("Default");
module.exports.hello = () => console.log("Hello");
```
- Image Upload
	- npm package: `busboy`
- Node.js
	- `os.tmpdir()` -> an inbuilt application programming interface of the os module which is used to get path of default directory for temporary files of the operating system.
	- `path.basename()` -> extract the filename from a file path.
- BLOB
	- What is a BLOB?
		- A binary large object (blob) is concentrated binary data that's compressed into an individual file inside a database. 
		- The large size of file means they need special storage treatment.
		- Blobs are binary, which means they are usually images, audios or other media. However, they can also be other forms such as binary code. A blob is made up of raw data in the form of a file though slightly different in makeup.
		- A blob is a data type that can store binary data. This is different than most other data types used in databases, such as integers, floating point numbers, characters, and strings, which store letters and numbers.
		- Since blobs can store binary data, they can be used to store images or other multimedia files. For example, a photo album could be stored in a database using a blob data type for the images, and a string data type for the captions.
- base64url vs base64
	- links:
		- https://stackoverflow.com/questions/55389211/string-based-data-encoding-base64-vs-base64url
	- Both base64 and base64url are ways to encode binary data in string form. The problem with base64 is that it contains the characters `+`, `/`, and `=`, which have a reserved meaning in some filesystem names and URLs. 
	- So base64url solves this by replacing `+` with `-` and `/` with `_`. The trailing padding character `=` can be eliminated when not needed, but in a URL it would instead most likely be `%` URL encoded. Then the encoded data can be included in a URL without problems.
- metadata
	- Metadata is data that describes other data. 'Meta' is a prefix that -- in most information technology usages -- means "an underlying definition or description". Metadata summarizes basic information about data, which can make finding and working with particular instances of data easier.
- gzip -> gzip if a file format and a software application used for file compression and decompression.
- google cloud storage node.js -> https://googleapis.dev/nodejs/storage/latest/



---

> Currently at 2:36:36 -> https://www.youtube.com/watch?v=m_u6P5k0vP0&t=2949s

---