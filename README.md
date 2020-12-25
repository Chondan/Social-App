# Social App

## Lesson Learned
- Firebase
	- we can use 'express' library with firebase function
	- we can set deployment region of firebase function
	- emulator -> run firebase function locally during developing
		- `firebase emulators:start` or `firebase serve`
	- verify tokenId (JWT) -> https://firebase.google.com/docs/auth/admin/verify-id-tokens
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

## Database Schema
```JavaScript
// showing how our database look like
const db = {
	screams: [
		{ 
			userHandle: 'user', 
			body: 'body', 
			createdAt: "2020-12-24T11:05:13.489Z",
			likeCount: 5, 
			commentCount: 2
		}
	],
	users: [
		{
			userId: '5DH9O5S1j0SQuwZT8Gp0y6m0Ja43',
			handle: 'chondan',
			email: 'chondan@example.com',
			createdAt: "2020-12-24T11:05:13.489Z"
		}
	]
};
```

---

> Currently at 1:19:36 -> https://www.youtube.com/watch?v=m_u6P5k0vP0&t=2949s

---