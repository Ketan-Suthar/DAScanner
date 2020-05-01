function username(){
    var name = document.getElementById('uname').value;
    if(name.length<9){
        document.getElementById('error-ID').innerHTML="*ID have must be 9 digit";
        document.getElementById('uname').focus();
    }
    else{
        var year=name.substr(0,4)
        var cid=name.substr(4,2);
        var flag=0;
        if(cid=='01'||cid=='11'||cid=='12'){
            flag=1;
        } 
        if(year<2001||year>=2001&&flag==0){
        
            document.getElementById('error-ID').innerHTML="*ID is Invalid";
            document.getElementById('uname').focus();
        }     
        else{
            document.getElementById('error-ID').innerHTML="";
        }
    }          
}
function ValidateEmail()
{
    var mail = document.getElementById('email').value;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(mail.value.match(mailformat))
    {
        document.form1.text1.focus();
        return true;
    }
    else
    {
        document.getElementById('error-email').innerHTML="*Email is Invalid";
        document.form1.text1.focus();
        return false;
    }
}