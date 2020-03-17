const express = require("express");
// import validators
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

//bring user type model
const UserTypes = require("../models/UserTypes");


const userTypeRouter = express.Router();

userTypeRouter.get("/loadAddUserType", (request, response, next) =>
{
	response.render("AddUserType",
	{
		title: "Add User Type",
	});
});

userTypeRouter.post("/addUserType", (request, response, next) =>
{
	let userType = new UserTypes();
	userType._id = request.body.id;
	userType.userTypeName = request.body.userTypeName;

	userType.save((err)=>
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			response.redirect("/users/loadAddUser");
		}
	});
});

userTypeRouter.delete("/:userTypeId", (request, response, next)=>
{
	const userTypeId = request.params.userTypeId;
	UserTypes.deleteOne({_id: userTypeId})
	.exec()
	.then((result)=>
	{
		response.redirect("/user/loadAddUsers");
	})
	.catch((err)=>
	{
		console.log(err);
		response.redirect("/users/loadAddUsers");
	});
});

module.exports = userTypeRouter;