const jwt = require("jsonwebtoken");
require('dotenv').config();

// Token creation
module.exports.createAccessToken = (user) => {

	// payload
    // When the user logs in, a token will be created with user's information
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	
	// Generate a JSON web token using the jwt's sign method
    // Generates the token using the form data and the secret code with no additional options provided
    // SECRET_KEY is a User defined string data that will be used to create our JSON web tokens
    // Used in the algorithm for encrypting our data which makes it difficult to decode the information without the defined secret keyword
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
}

// Token verification
module.exports.verify = (req, res, next) => {

	console.log(req.headers.authorization)

	let token = req.headers.authorization;

	if(typeof token === "undefined") {

		return res.send({ auth: "Failed. No Token"});

	} else {
		console.log(token)
		token = token.slice(7, token.length);
		console.log(token);

		// Token verification
		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {
			if(err) {
				return res.send({
					auth: "Failed",
					message: err.message
				});
			} else {
				console.log("Result from verify method:")
				console.log(decodedToken);

				req.user = decodedToken;

				next();
			}
		})
	}
}


// Verify admin
module.exports.verifyAdmin = (req, res, next) => {
	console.log("Result from verifyAdmin method");
	console.log(req.user);

	// Checks if the owner of the token is an admin.
	if(req.user.isAdmin) {
		// If it is, move to the next middleware/controller using next() method.
		next();
	} else {
		// Else, end the request-response cycle by sending the appropriate response and status code.
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}


// Error handler
module.exports.errorHandler = (err, req, res, next) => {
	console.log(err);

	const statusCode = err.status || 500
	const errorMessage = err.message || 'Internal Server Error';

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	})
}


// Middleware to check if the use is authenticated
module.exports.isLoggedIn = (req, res, next) => {

	if(req.user) {
		next();
	} else {
		res.sendStatus(401);
	}
}