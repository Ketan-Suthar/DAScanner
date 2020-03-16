const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose"); // assign mongoose variable

// import diff Routes
const gateRoute = require("./routes/GateRoutes");
const userRoute = require("./routes/userRoutes");

// connect to database
mongoose.connect("mongodb://localhost/dascanner");
const db = mongoose.connection;

//check db connection
db.once("open", ()=>
{
	console.log("connected to databse.");
});

//check for db connection error if any
db.on("error", (error)=>
{
	console.log(error);
});

// initialize app with express
const app = express();

// set views
app.set("views", path.join(__dirname, "views"));
// set view engine - EJS
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
// set home route
// simple get request by user
app.get("/", (request, response) =>
{
	response.send("Helloo, Welcome to DAScanner.");
});


// set /gate routes gateRoutes
app.use("/gate", gateRoute);
app.use("/users", userRoute); // set /users routes

// init port so server can start listening
app.listen(3000, ()=>
{
	console.log("DAScanner's Server started at port 3000");
});