const express = require("express");
// import validators
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

//bring user type model
const UserTypes = require("../models/UserTypes"); 
// bring user model
const User = require("../models/User");

const userRouter = express.Router();

userRouter.get("/loadAddUser", (request, response, next) =>
{
	UserTypes.find({}, (error, userTypes)=>
	{
		if(error)
		{
			console.log(error);
		}
		else
		{
			//console.log(userTypes);
			response.render("UserRegistration",
			{
				title: "User Registration",
				userTypes: userTypes,
				errors: null
			});
		}
	});
});

userRouter.get("/loadAddUserType", (request, response, next) =>
{
	response.render("AddUserType",
	{
		title: "Add User Type",
	});
});

userRouter.post("/addUser", (request, response, next) =>
{
	const validationRes = validationResult(request);
	if(!validationRes.isEmpty())
	{
		console.log(validationRes.mapped());
		UserTypes.find({}, (error, userTypes)=>
		{
			if(error)
			{
				console.log(error);
			}
			else
			{
				//console.log(userTypes);
				response.render("UserRegistration",
				{
					title: "User Registration",
					userTypes: userTypes,
					errors: validationRes.mapped()
				});
			}
		});
	}
	else
	{
		// const user = matchedData(request);
		// console.log("user data is : ");
		// console.log(user);
		console.log(request.body);
		let user = new User();
		user._id = request.body.userId;
		user.userEmailId = request.body.userEmailId;
		user.fName = request.body.fName;
		user.lName = request.body.lName;
		user.userTypeId = request.body.userTypeId;
		user.courseName = request.body.courseName;
		user.batchYear = request.body.batchYear;
		user.password = request.body.password;

		user.save()
		.then(result=>
		{
			console.log(result);
			response.redirect("/users/loadAllUsers");
		})
		.catch(err=>
		{
			console.log(err);
		});
	}
});


userRouter.post("/addUserType", (request, response, next) =>
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

userRouter.get("/loadAllUsers", (request, response, next) =>
{
	User.find({}, (error, users)=>
	{
		if(error)
		{
			console.log(error);
		}
		else
		{
			//console.log(userTypes);
			response.render("DisplayAllUsers",
			{
				title: "Showing all users",
				users: users,
				errors: null
			});
		}
	});
});

module.exports = userRouter;

/*

[
	check("userId","this userId is already exist").trim()
	.custom((value,request) =>
	{
		User.findById(value)
		.then(user =>
		{
			if(user)
			{
				throw new Error();
			}
			else
			{
				return true;
			}
		})
		.catch(err =>
		{
			console.log("error occured while findById in User");
			console.log(err);
		})
	})
	,
	check("userEmailId", "Enter valid email address").trim().isEmail(),
	check("userEmailId", "this email is already exist").trim().isEmail().custom((value) =>
	{
		User.find({userEmailId: value})
		.then(user =>
		{
			console.log(user);
			if(user)
			{
				throw new Error();
			}
			else
			{
				return true;
			}
		})
		.catch(err=>
		{
			console.log("error occured while find in User");
			console.log(err);
		})
	})
	,
	check("password", "Enter valid password").trim().isLength({min: 8}),
	check("passwordAgain").custom((value,request)=>
	{
		//console.log(request.req.body.password);
		if(value != request.req.body.password)
		{
			//console.log(value);
			throw new Error("password does not match");
		}
		else
		{
			return true;
		}
	})
]
,

*/