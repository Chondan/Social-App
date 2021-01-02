const isEmail = email => {
	const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if (regex.test(email)) {
		return true;
	}
	return false;
}

const isEmpty = (string) => {
	if (string.trim() === '') return true;
	return false;
}

const validateSignupData = ((req, res, next) => {
	const { email, password, confirmPassword, handle } = req.body;

	let errors = {};

	if (isEmpty(email)) {
		errors.email = "Email must not be empty";
	} else if (!isEmail(email)) {
		errors.email = "Email must be valid"
	}

	if (isEmpty(password)) errors.password = "Password must not be empty";
	if (password !== confirmPassword) errors.password = "Passwords must match";
	if (isEmpty(handle)) errors.handle = "Handle must not be empty";
	if (Object.keys(errors).length > 0) return res.status(400).json(errors);

	next();
});

const validateSinginData = ((req, res, next) => {
	const { email, password } = req.body;

	let errors = {};

	if (isEmpty(email)) errors.email = "Email must not be empty";
	if (isEmpty(password)) errors.password = "Password must not be empty";
	if (Object.keys(errors).length > 0) return res.status(400).json(errors);

	next();
});

const reduceUserDetails = (data) => {
	const { bio, website, location } = data;
	let userDetails = {};

	if (!isEmpty(bio.trim())) userDetails.bio = bio;
	if (!isEmpty(website.trim())) {
		// https://website.com
		if (website.trim().substring(0, 4) !== 'http') {
			userDetails.website = `http://${website.trim()}`;
		} else userDetails.website = website;
	}
	if (!isEmpty(location.trim())) userDetails.location = location;

	return userDetails;
}

module.exports = { isEmail, isEmpty, validateSignupData, validateSinginData, reduceUserDetails };