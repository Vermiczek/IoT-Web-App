var R = 0;
var G = 0;
var B = 0;
var defaultIp = "192.168.1.27";
var configurl="config.json";
var setledUrl= "http://"+defaultIp+"/setled.php";
var ip;
var port;


function getSliderValue(color)
{
   if(color == "R")
      R = document.getElementById("rSlider").value;
      console.log(R);
   if(color == "B")
      B = document.getElementById("bSlider").value;
      console.log(B);
   if(color == "G")
      G = document.getElementById("gSlider").value;
      console.log(G);
   
   var colourView =  createColuor();
   updateDivsBackground(colourView);
}

$(document).ready(function(){

   getConfigData();

});

function LEDsend(){
   let matrix=prepareMatrixTable();
   updateMatrix(matrix);
}

function LEDreset(){
   let clearMtrx=clearMatrix();
   updateMatrix(clearMtrx);
}


function clearMatrix(){
   let clear="";
   for(let x=0;x<=7;x++)
   {
       for(let y=0;y<=7;y++)
       {
           let btnId="btn"+x+"_"+y;
           console.log(btnId);
           document.getElementById(btnId).style.backgroundColor='white';
           clear = clear + 'LED'+x+y+'=['+x+','+y+',0,0,0]&&';

       }

   }
   clear=clear.substring(0, clear.length - 2);
   return clear
}



function prepareMatrixTable(){
   let output="";
   for(let x=0;x<=7;x++)
   {
       for(let y=0;y<=7;y++)
       {
           let btnId="btn"+x+"_"+y;
           let button=  window.getComputedStyle(document.getElementById(btnId), null);
           let colour = button.backgroundColor;
           colour=colour.substring(4, colour.length - 1);
           output = output + 'LED'+x+y+'=['+x+','+y+','+colour+']&&';
   
       }
   
   }
   output=output.substring(0, output.length - 2);
   return output
   }


function updateMatrix(matrixtableText) {

  
      $.ajax(setledUrl, {
          type: "POST",
          data: matrixtableText,
          dataType: "text",
          crossDomain: true,
  
          beforeSend: function (x) {
              console.log("AJAX POST REQUEST: initialization");
          },
          success: function (result) {
              console.log("AJAX POST REQUEST SUCCESFULL: " + result);
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              console.log("AJAX POST REQUEST: FAILURE");
              console.log("STATUS: " + textStatus);
              console.log("ERROR: " + errorThrown);
          },
          cache: false
  
      });
  }

/**
* @brief Download config data from server and starts updateConfigValues function.
*/
function getConfigData() {
   $.ajax(configurl, {
       type: 'GET',
       dataType: 'json',
       crossDomain: true,
       cache: false,
       success: function(responseJSON, status, xhr) {
           updateConfig(responseJSON);
       },
       error: function (ajaxContext) {
           console.log("Error while getting data from server");
       },

   });

}



/**
* @brief Update config values with data downloaded from server
* @param responseJSON: data structure that keeps information about configuration
*/
function updateConfig(responseJSON){
   ip=responseJSON.ip;
   port=responseJSON.port;
   setledUrl="http://"+defaultIp+"/setled.php";
   console.log("Config values updated");
}

function createColuor(){
   if(R===undefined) R=0;
   if(G===undefined) G=0;
   if(B===undefined) B=0;
   return "rgb(" + R + ", " + G + ", " + B + ")"
}

function updateDivsBackground(colour){
   document.getElementById("ColorDiv").style.backgroundColor=colour;

}

function updateBtn(id){
   let colour= document.getElementById("ColorDiv").style.backgroundColor;
   let btnId="btn"+id;
   document.getElementById(btnId).style.backgroundColor=colour;
}

