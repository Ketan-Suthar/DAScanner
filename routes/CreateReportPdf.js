var PdfTable = require('voilab-pdf-table'),
    PdfDocument = require('pdfkit');
var fs=require('fs');
const date = require('date-and-time');
const GateRecords = require("../models/GateRecords");

module.exports = {
	create: function(sDate, eDate)
	{
		//let startDate = request.body.startDate;
		const startDate = date.format(new Date(sDate), 'DD-MM-YYYY');
		const endDate = date.format(new Date(eDate), 'DD-MM-YYYY');
		//const endDate = request.body.endDate;
		console.log("in CreateReportPdf");
		console.log(startDate, endDate);

		var pdf = new PdfDocument({
                autoFirstPage: false
        }),
        table = new PdfTable(pdf, {
            bottomMargin: 30,
        });

        table
            // add some plugins (here, a 'fit-to-width' for a column)
            .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
                column: 'StudentId'
            }))
            // set defaults to your columns
            .setColumnsDefaults({
                //headerBorder: ['L', 'T', 'B','R'],
    			//border: ['L','T','B','R'],
    			padding: [5, 5, 5, 0],
                align: 'middle'
            })
            // add table columns
            .addColumns([
                {
                    id: 'StudentId',
                    header: 'StudentId',
                    align: 'left'
                },
                {
                    id: 'CourseName',
                    header: 'CourseName',
                    align: 'left',
                    width: 85
                },
                {
                    id: 'InDate',
                    header: 'InDate',
                    align: 'left',
                    width: 60
                },
                {
                    id: 'InTime',
                    header: 'InTime',
                    align: 'left',
                    width: 60
                },
                {
                    id: 'OutDate',
                    header: 'OutDate',
                    align: 'left',
                    width: 60
                },
                {
                    id: 'OutTime',
                    header: 'OutTime',
                    align: 'left',
                    width: 60
                },
                {
                    id: 'Visitors',
                    header: 'Visitors',
                    align: 'left',
                    width: 50
                }
            ])
            // add events (here, we draw headers on each new page)
            .onPageAdded(function (tb) {
                tb.addHeader();
            });
 
        // if no page already exists in your PDF, do not forget to add one
        pdf.addPage();
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

			if(result)
			{
				console.log("data found");
					for(record of result)
				    {
				    	console.log(record.userId.toString());
				    	table.addBody([
					    	{
					        	StudentId: record.userId.toString() ,
					        	CourseName: record.gaterecords.courseName.toString(),
					        	InDate: record.inDate.toString(),
					        	OutDate: record.outDate.toString(),
					        	InTime: record.inTime.toString(),
					        	OutTime: record.outTime.toString(),
					        	Visitors: record.noOfVisitors.toString()
					        }
				        ]);
				    }
			}
			else
			{
				table.addBody([
		        {
		        	StudentId:"No Data",
		        	CourseName: "No Data",
		        	InDate: "No Data",
		        	OutDate: "No Data",
		        	InTime:"No Data",
		        	OutTime: "No Data",
		        	Visitors: "No Data"}
		        ]);
			}
		});
        return pdf;
	}
};