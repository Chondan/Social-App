const isEmail = email => {
	const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if (regex.test(email)) {
		return true;
	}
	return false;
}

const a = isEmail("chondan.s@student.chula.ac.th");
const b = isEmail("chondan.com");

console.log(a, b);

module.exports = () => console.log("Default");
module.exports.hello = () => console.log("Hello");

const x = 1.523;
console.log(Math.ceil(x), Math.floor(x), Math.round(x));

const os = require('os');
console.log(os.tmpdir());

console.time("myTime");
setTimeout(() => console.timeEnd("myTime"), 1000);

const person = { name: "Chondan", age: 22 };
console.table(person);

if (1) console.log('a'), console.log('b');