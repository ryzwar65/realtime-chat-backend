const { PrismaClient } = require('@prisma/client');
const { isLogin } = require('../helpers/isLogin');
const prisma = new PrismaClient();
const crypto = require('crypto');
const generateRoom = async (req, res, next) => {
	try {
		var userLogin = await isLogin(req.cookies.access_token);
		var customerID = userLogin.role == 'customer' ? userLogin.id : req.body.customer_id;
		var merchantID = userLogin.role == 'merchant' ? userLogin.id : req.body.merchant_id;
		var roomID = crypto.randomBytes(100).toString('base64');
		var checkRoom = await prisma.chatRoom.findFirst({
			select: {
				id: true,
				room: true,
				customer: true,
				merchant: true
			},
			where: {
				customerId: customerID,
				merchantId: merchantID
			}
		});
		var roomChat;
		// return res.status(200).json(roomID)
		if (!checkRoom) {
			var customer = await prisma.customer.findFirst({
				where: {
					id: customerID
				}
			});
			var merchant = await prisma.merchant.findFirst({
				where: {
					id: merchantID
				}
			});
			roomChat = await prisma.chatRoom.create({
				data: {
					customerId: customer.id,
					merchantId: merchant.id,
					room: roomID
				},
				select: {
					id: true,
					room: true,
					customer: true,
					merchant: true
				}
			});
		} else {
			roomChat = checkRoom;
		}
		return res.status(200).json({
			message: 'Successfully',
			data: roomChat
		});
	} catch (error) {
		return next(error);
	}
};

module.exports = { generateRoom };
