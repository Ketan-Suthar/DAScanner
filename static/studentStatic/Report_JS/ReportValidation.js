function changeFunc() {
    var selectedValue = document.getElementById("selectBox").value;
    var d1=document.getElementById("ReportDate");
   
    var i=document.getElementById("stuID");
    if(selectedValue=="1"){
        
        d1.style.display="block";
       
        i.style.display="none";
    }
    else if(selectedValue=="2"){
        i.style.display="block";
        d1.style.display="none";
      
    }
    else{
        i.style.display="block";
        d1.style.display="block";
       
    }
   }

function DateCheck()
{
  console.log("checking date");
  var op = document.getElementById('selectBox').value;
  console.log(op);
  if(op != 2)
  {  
      var StartDate= document.getElementById('startDate').value;
      var EndDate= document.getElementById('endDate').value;
      // var eDate = new Date(EndDate);
      // var sDate = new Date(StartDate);
      console.log(StartDate == "", EndDate == "");
      if(StartDate == '' || EndDate == '')
      {
        console.log("in if");
        alert("Please Selece both start and end date");
        document.getElementById('endDate').focus();
        return false;
      }
  }
  else
    return true;
}