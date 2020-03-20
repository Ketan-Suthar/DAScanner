const express = require("express");
const User = require("../models/User");
const GateRecords = require("../models/GateRecords");
const TempGateRecords = require("../models/TempGateRecords");

const date = require('date-and-time'); //formate date and time

const gateRouter = express.Router();

gateRouter.get("/loadGateScanner",(request, response, next) =>
{
	response.render("GateScanQR",
	{
		title: "DA Gate Entry/Exit System",
		messages: null
	});
});

gateRouter.post("/CheckQR",(request, response, next) =>
{
	const userId = request.body.studentId;
	User.findById(userId,(err, user)=>
	{
		if(err)
		{
			console.log("error while fetching user in CheckQR: ");
			console.log(err);
		}
		console.log(userId);
		//console.log(user);
		if(user)
		{
			console.log(user._id);

			const now = new Date();
			let currDate = date.format(now, 'DD-MM-YYYY');
			let currTime = date.format(now, 'HH:mm:ss');

			if(request.body.out)
			{
				console.log(request.body.out);
				TempGateRecords.find({userId: user._id}, (err, tempRecord)=>
				{
					console.log(tempRecord);
					console.log(!(tempRecord[0] == undefined));
					if(err)
					{
						console.log("error while fetching tempRecord: ");
						console.log(err);
					}
					let gateRecord = new GateRecords();

					gateRecord.userId = user._id;
					gateRecord.outDate = currDate;
					gateRecord.outTime = currTime;

					if(!(tempRecord[0] == undefined))
					{
						
						gateRecord.inDate = tempRecord[0].inDate;
						gateRecord.inTime = tempRecord[0].inTime;

						gateRecord.noOfVisitors = tempRecord[0].noOfVisitors;

						TempGateRecords.deleteOne({userId: userId})
						.exec()
						.then((result)=>
						{
							console.log("temp record delete for "+ userId);
						})
						.catch((err)=>
						{
							console.log(err);
						});
					}

					gateRecord.save()
					.then(result=>
					{
						console.log("per. record inserted");
						console.log(result);

						
						return response.render("GateScanQR",
						{
							title: "DA Gate Entry/Exit System",
							messages: "Per. Entry recorded successfully"
						});
					})
					.catch(err=>
					{
						console.log(err);
					});
					
				});
			}
			else if(request.body.in)
			{
				console.log(request.body.in);

				let newTempRecord = new TempGateRecords();

				newTempRecord.userId = user._id;
				newTempRecord.inDate = currDate;
				newTempRecord.inTime = currTime;
				newTempRecord.noOfVisitors = request.body.noOfVisitors;

				newTempRecord.save()
				.then(result=>
				{
					console.log("Temp recorded");
					console.log(result);

					return response.render("GateScanQR",
					{
						title: "DA Gate Entry/Exit System",
						messages: "Temp. In Entry recorded successfully"
					});
				})
				.catch(err=>
				{
					console.log(err);
				});
			}
		}
		else
		{
			request.flash("success", "studentId is not valid");
			response.render("GateScanQR",
			{
				title: "DA Gate Entry/Exit System",
				messages: "Submission Failed"
			});
		}
	});
});

gateRouter.get("/loadGenerateReport",(request, response)=>
{
	response.render("GenerateReportForm",
	{
		title: "Generate Report from gate reocrds",
		messages: null
	});
});


gateRouter.post("/generateReport",(request, response)=>
{
	//let startDate = request.body.startDate;
	const startDate = date.format(new Date(request.body.startDate), 'DD-MM-YYYY');
	const endDate = date.format(new Date(request.body.endDate), 'DD-MM-YYYY');
	//const endDate = request.body.endDate;

	GateRecords.aggregate(([
		{
			"$lookup":
			{
				"from": "users",
				"localField": "userId",
				"foreignField": "_id",
				"as": "gaterecords"
			}
		},
		{
			"$unwind": "$gaterecords"
		},
		{
			"$project":
			{
				"gaterecords.password": 0
			}
		},
		{
			"$match":
			{
				"$and":
				[
					{"outDate": {"$gte": startDate}}, 
					{"inDate": {"$lte": endDate}},
				]
			}
		}
	]), (err, result)=>
	{
		if(err)
		{
			console.log("error while getting records for Report");
			console.log(err);
		}
		console.log(startDate, endDate);
		if(result)
		{
			response.render("DisplayReport",
			{
				title: "Generated Report From Gate Reocrds",
				messages: result,
				startDate: startDate,
				endDate: endDate
			});
		}
		else
		{
			response.render("DisplayReport",
			{
				title: "Generated Report From Gate Reocrds",
				messages: "No Data Found",
				startDate: startDate,
				endDate: endDate
			});
		}
	});
});


module.exports = gateRouter;

/*

{
	"$redact":
	{
		"$cond":
		[
			{
				"$and":
				[
					{$gt: "$outDate", "01-03-2020"},
					{$lt: "$inDate", "18-03-2020"}
				]
			},1,0
		]
	}
},
{
	"$project":
	{
		"users.password":0
	}
}

*/

/*

code for without in/out button entry/exit

TempGateRecords.find({userId: user._id}, (err, tempRecord)=>
{
	console.log(!(tempRecord[0] == undefined));
	if(err)
	{
		console.log("error while fetching tempRecord: ");
		console.log(err);
	}
	if(!(tempRecord[0] == undefined))
	{
		let gateRecord = new GateRecords();
		const now = new Date();
		let currDate = date.format(now, 'DD-MM-YYYY');
		let currTime = date.format(now, 'HH:mm:ss');

		gateRecord.userId = tempRecord[0].userId;
		gateRecord.outDate = tempRecord[0].outDate;
		gateRecord.outTime = tempRecord[0].outTime;

		gateRecord.inDate = currDate;
		gateRecord.inTime = currTime;
		gateRecord.noOfVisitors = tempRecord[0].noOfVisitors;

		gateRecord.save()
		.then(result=>
		{
			console.log("per. recorded");
			console.log(result);

			TempGateRecords.deleteOne({userId: userId})
			.exec()
			.then((result)=>
			{
				console.log("temp record delete for "+ userId);
			})
			.catch((err)=>
			{
				console.log(err);
			});

			return response.render("GateScanQR",
			{
				title: "DA Gate Entry/Exit System",
				messages: "Per. Entry recorded successfully"
			});
		})
		.catch(err=>
		{
			console.log(err);
		});
	}
	else
	{
		let newTempRecord = new TempGateRecords();
		const now = new Date();
		let currDate = date.format(now, 'DD-MM-YYYY');
		let currTime = date.format(now, 'HH:mm:ss');
		newTempRecord.userId = user._id;
		newTempRecord.outDate = currDate;
		newTempRecord.outTime = currTime;
		newTempRecord.noOfVisitors = request.body.noOfVisitors;

		newTempRecord.save((err) =>
		{
			if(err)
			{
				console.log("error while saving TempGateRecords");
				console.log(err);
			}
			else
			{
				console.log("temp recorded");
				return response.render("GateScanQR",
				{
					title: "DA Gate Entry/Exit System",
					messages: "Temp Entry recorded successfully"
				});
			}
		});
	}
});

*/