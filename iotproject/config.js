var urlFromBrowser;
var urlConfig="config.json";
var saveConfigBackend="saveConfig.php"
var responseJSON;
var ipAdress;
var sampleTime;
var sampleQuantity;


function loadConfig() {
	$.getJSON( urlConfig, function( json ) {
  console.log( "JSON Data: " + json);
  responseJSON = json;
  console.log(responseJSON);
    try{
	ipAdress=responseJSON.ip;
    console.log(ipAdress)
    document.getElementById("IPAdress").value=ipAdress;
	sampleTime=responseJSON.sampleTime;
	console.log(sampleTime)
    document.getElementById("sampleTime").value = sampleTime;
	sampleQuantity=responseJSON.sampleQuantity;
    document.getElementById("sampleQuantity").value=sampleQuantity;
	console.log("Config data updated");}
    finally{
         console.log("uwu")
    }
 });	
}


function saveConfig(){
	var JSONtext='';
	sampleTime=document.getElementById("sampleTime").value;
	ipAdress = document.getElementById("IPAdress").value;
	console.log("New ip: " + ipAdress);
    sampleQuantity = document.getElementById("sampleQuantity").value;
	if(ipAdress!=""){JSONtext=JSONtext+"ip="+ipAdress;}
	if( sampleTime!=""){JSONtext=JSONtext+"&&sampleTime="+sampleTime;}
	if( sampleQuantity!=""){JSONtext=JSONtext+"&&sampleQuantity="+sampleQuantity;}
	console.log(JSONtext);
	
	$.ajax(saveConfigBackend, {
		type: "POST",
		data: JSONtext,
		dataType: "text",
		crossDomain: true,
		
		beforeSend: function(x) {
			console.log("AJAX POST REQUEST: initialization");
		},
		success: function(result) {
			console.log("AJAX POST REQUEST SUCCESFULL: " + result);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("AJAX POST REQUEST: FAILURE");
			console.log("STATUS: " + textStatus);
			console.log("ERROR: " + errorThrown);
		},
		cache: false
		
});
}