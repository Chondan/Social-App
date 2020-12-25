const express = require('express');
const router = express.Router();

router.post('/image', (req, res) => {
	

});

router.get('/info', (req, res) => {
	res.end("Info");
});

module.exports = router;