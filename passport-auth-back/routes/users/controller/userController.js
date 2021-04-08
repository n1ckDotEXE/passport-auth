const user = require("../model/User");
const bcrypt = require("bcryptjs");

const signUp = async (req, res) => {
	let genSalt = await bcrypt.genSalt(12);
	let hashedPassword = await bcrypt.hash(req.body.password, genSalt);
	try {
		let createdUser = new user({
			email: req.body.email,
			username: req.body.username,
			password: hashedPassword,
		});

		let savedCreatedUser = await createdUser.save();

		res.json({
			message: "User created",
			user: savedCreatedUser,
		});
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

module.exports = {
	signUp,
};
