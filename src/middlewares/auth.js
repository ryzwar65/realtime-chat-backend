const jwt = require('jsonwebtoken');
const jwtSecret = process.env.TOKEN_SECRET_JWT;

const authorization = (req, res, next) => {
	if (req.cookies.access_token) {
		try {
			const token = req.cookies.access_token;
			const data = jwt.verify(token, jwtSecret);
			req.email = data.email;
			return next();
		} catch (error) {
			res.status(401).json({ message: 'Sesi Anda Telah Habis', error: error });
		}
	} else {
		res.status(403).json({ message: 'Tidak memiliki Otoritas Akses' });
	}
};

module.exports = { authorization };
