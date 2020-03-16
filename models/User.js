const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
{
	_id:
	{
		type: Number,
		required: true
	},
	userTypeId:
	{
		type: Number,
		ref: "UserTypeId",
		required: true
	},
	userEmailId:
	{
		type: String,
		required: true
	},
	fName:
	{
		type: String,
		required: true
	},
	lName:
	{
		type: String,
		required: true
	},
	courseName:
	{
		type: String,
		required: true
	},
	batchYear:
	{
		type: Number,
		required: true
	},
	password:
	{
		type: String,
		required: true
	}
});

let User = module.exports = mongoose.model("User", userSchema);