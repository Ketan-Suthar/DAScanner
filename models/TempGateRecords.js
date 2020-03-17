const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let tempGateRecordsSchema =new Schema(
{
	userId:
	{
		type: Number,
		ref: "User",
		required: true
	},
	inDate:
	{
		type: String,
		default: ""
	},
	outDate:
	{
		type: String,
		default: ""
	},
	inTime:
	{
		type: String,
		default: ""
	},
	outTime:
	{
		type: String,
		default: ""
	},
	noOfVisitors:
	{
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model("TempGateRecords", tempGateRecordsSchema);