const user = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

const login = async (req, res) => {
	try {
		let foundUser = await user.findOne({ email: req.body.email });

		if (!foundUser) {
			throw { message: "User not found, please go sign up." };
		}
		let comparedPassword = await bcrypt.compare(
			req.body.password,
			foundUser.password
		);
		if (!comparedPassword) {
			throw { message: "Please check your email and password" };
		}
	} catch (e) {
		res.status(500).json({ message: e.message });
	}

	let jwtToken = jwt.sign(
		{
			email: foundUser.email,
			username: foundUser.username,
		},
		process.env.JWT_SECRET_STRING
	);
	{
		expiresIn: "1d";
	}
};

module.exports = {
	signUp,
};
