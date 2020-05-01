const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose"); // assign mongoose variable

const flash = require("connect-flash");
const session = require("express-session");

// import diff Routes
const gateRoute = require("./routes/GateRoutes");
const userRoute = require("./routes/userRoutes");
const userTypeRoute = require("./routes/userTypeRoutes");

// connect to database
mongoose.connect("mongodb://localhost/dascanner",
{ 
	useNewUrlParser: true,
	useUnifiedTopology: true 
});

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

// set static file to /static/views route
// so all files in views will be static now
app.use("/static",express.static(path.join(__dirname, "/static")));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

var sessionStore = new session.MemoryStore;

app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

// set home route
// simple get request by user
app.get("/", (request, response) =>
{
	response.render("studentViews/index",
	{
		title: "Helloo, Welcome to DAScanner."
	});
});

// set /gate routes gateRoutes
app.use("/gate", gateRoute);
app.use("/users", userRoute); // set /users routes
app.use("/userTypes", userTypeRoute);

// init port so server can start listening
app.listen(3000, ()=>
{
	console.log("DAScanner's Server started at port 3000");
});