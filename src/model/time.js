const mongoose =  require("mongoose")

const timeSchema = new mongoose.Schema({
	bomdod: {
		type: String,
		required: true
	},
	peshin: {
		type: String,
		required: true
	},
	asr: {
		type: String,
		required:true
	},
	shom: {
		type: String,
		required: true
	},
	xufton: {
		type: String,
		required: true
	},
	owner: {
		type: mongoose.Types.ObjectId,
		required: true
	},
	countViewer: {
		type: Number
	}
})


module.exports = new mongoose.model("Time", timeSchema)