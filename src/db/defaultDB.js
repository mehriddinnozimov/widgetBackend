const User = require("../model/user")
const Time =require("../model/time")

module.exports = async () => {
	const envAdmin = {
		AdminName: process.env.ADMIN_NAME,
		AdminUsername: process.env.ADMIN_USERNAME,
		AdminPassword: process.env.ADMIN_PASSWORD
	}

	const a = await User.findOne({username: envAdmin.AdminUsername})
	if(!a) {
		const admin = new User({
			name: envAdmin.AdminName,
			isAdmin: true,
			username: envAdmin.AdminUsername,
			password: envAdmin.AdminPassword
		})

		await admin.save()

		const time = new Time({
			bomdod: "5:50",
			peshin: "12:50",
			asr: "16:55",
			shom: "18:45",
			xufton: "20:15",
			owner: admin._id
		})

		await time.save()
	}
}