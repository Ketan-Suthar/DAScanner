const express = require("express");


const gateRouter = express.Router();

gateRouter.get("/loadGateScanner",(request, response, next) =>
{
	response.render("GateScanQR",
	{
		title: "DA Gate Entry/Exit System",
	});
});

module.exports = gateRouter;