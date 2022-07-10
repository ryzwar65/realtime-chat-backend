const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const login = async (req, res, next) => {
	const customer = await prisma.customer.findFirst({
		where: {
			email: req.body.email
		}
	});
	const merchant = await prisma.merchant.findFirst({
		where: {
			email: req.body.email
		}
	});
	try {
		var token;
		var refreshToken;
		if (customer) {
			if (bcrypt.compareSync(req.body.password, customer.password)) {
				token = jwt.sign(
					{
						id: customer.id,
						name: customer.firstname + ' ' + customer.lastname,
						email: customer.email
					},
					process.env.TOKEN_SECRET_JWT,
					{ expiresIn: '60s' }
				);
				refreshToken = jwt.sign(
					{
						id: customer.id,
						name: customer.firstname + ' ' + customer.lastname,
						email: customer.email
					},
					process.env.TOKEN_SECRET_JWT,
					{ expiresIn: '1h' }
				);
			} else {
				res.status(500).json({
					data: null,
					message: 'Password tidak sesuai'
				});
			}
		} else if (merchant) {
			if (bcrypt.compareSync(req.body.password, merchant.password)) {
				token = jwt.sign(
					{
						id: merchant.id,
						name: merchant.firstname + ' ' + merchant.lastname,
						email: merchant.email
					},
					process.env.TOKEN_SECRET_JWT,
					{ expiresIn: '60s' }
				);
				refreshToken = jwt.sign(
					{
						id: merchant.id,
						name: merchant.firstname + ' ' + merchant.lastname,
						email: merchant.email
					},
					process.env.TOKEN_SECRET_JWT,
					{ expiresIn: '1h' }
				);
			} else {
				res.status(500).json({
					data: null,
					message: 'Password tidak sesuai'
				});
			}
		} else {
			res.status(404).json({
				data: null,
				message: 'Akun Tidak ditemukan'
			});
		}
		var user = customer ? customer : merchant;
		res
			.cookie('access_token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production'
			})
			.cookie('refresh_token', refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production'
			})
			.status(200)
			.json({
				success: true,
				token: token,
				refresh_token: refreshToken,
				data: {
					user: user
				}
			});
	} catch (error) {
		return next(error);
	}
};

const logout = (req, res) => {
	return res.clearCookie('access_token').clearCookie('refresh_token').status(200).json({ message: 'Sukses Logout' });
};

const refreshToken = async (req, res, next) => {
	try {
		var data = req.cookies.refresh_token;
		var token = jwt.sign(
			{
				id: data.id,
				name: data.name,
				email: data.email
			},
			process.env.TOKEN_SECRET_JWT,
			{ expiresIn: '1h' }
		);
		var refreshtoken = jwt.sign(
			{
				id: data.id,
				name: data.name,
				email: data.email
			},
			process.env.TOKEN_SECRET_JWT,
			{ expiresIn: '3h' }
		);
		return res
			.cookie('access_token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production'
			})
			.cookie('refresh_token', refreshtoken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production'
			})
			.status(200)
			.json({
				success: true,
				token: token
			});
	} catch (error) {
		return next(error);
	}
};

const isLogin = async (req, res, next) => {
	try {
		var data = jwt.verify(req.cookies.access_token, process.env.TOKEN_SECRET_JWT);
		const customer = await prisma.customer.findFirst({
			select: {
				id: true,
				firstname: true,
				lastname: true,
				email: true
			},
			where: {
				email: data.email
			}
		});
		const merchant = await prisma.merchant.findFirst({
			where: {
				email: data.email
			}
		});
		var user = customer ? customer : merchant;
		return res.status(200).json({
			message: 'Successfully',
			data: user
		});
	} catch (error) {
		return next(error);
	}
};

module.exports = { login, logout, refreshToken, isLogin };
