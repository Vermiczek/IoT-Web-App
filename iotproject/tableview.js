var savedConfigData="config.json";
var sampleTime;
var sampleQuantity;
var ip = "192.168.1.27";
var joystickDataURL="http://"+ip+"/joy.json";
var  rpyDataURL="http://"+ip+"/rpy.json";
var  tphDataURL="http://"+ip+"/tph.json";
var joystickData;
var  rpyData;
var  tphData;
var port;
var timer;
var key;



var indexJSON=JSON.parse("{\"temp\":0, \"press\":0, \"humi\":0, \"roll\":0, " +
    "\"pitch\":0, \"yaw\":0, \"x\":0, \"y\":0, \"z\":0}");





$(document).ready(function(){
    getConfigDataFromServer();
    getDataFromServer();
});



/**
 * @brief Download config data from server and starts updateConfigValues function.
 */
function getConfigDataFromServer() {
    $.ajax(savedConfigData, {
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        cache: false,
        success: function(responseJSON, status, xhr) {
            updateConfigValues(responseJSON);
        },
        error: function (ajaxContext) {
            console.log("Error while getting data from server");
        },

    }).done(function(html){
    updateTableConfig();
    //startTimer();
});

}



/**
 * @brief Update config values with data downloaded from server
 * @param responseJSON: data structure that keeps information about configuration
 */
function updateConfigValues(responseJSON){
    ip=responseJSON.ip;
    port=responseJSON.port;
    sampleTime=responseJSON.sampleTime;
    sampleQuantity=responseJSON.sampleQuantity;

    joystickDataURL="http://"+ip+"/joy.json";
    rpyDataURL="http://"+ip+"/rpy.json";
    tphDataURL="http://"+ip+"/tph.json";
}


/**
 * @brief Update key to identify data to plot
  */

/**
 * @brief Update table content to plot and calls function to start timer
 */
function updateTableConfig(){
   createTable();
}

function startTimer(){
    timer=setInterval(getDataFromServer, sampleTime);
}


/**
 * @brief Gets chosen data from server
 * @param dataURL: URL of json file to download
 * @param key: information what data was downloaded
 */
function getDataRequest(dataURL){
    getConfigDataFromServer();
    $.ajax(dataURL, {
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        cache: false,
        async : true,
        success: function(responseJSON, status, xhr) {
            if(responseJSON !== "undefined"){
            if(dataURL == rpyDataURL)
            {
              rpyData = responseJSON;
            }
            if(dataURL == tphDataURL){
              tphData = responseJSON;}
            if(dataURL == joystickDataURL){
               joystickData = responseJSON;
                console.log(joystickData);}

            updateTable(rpyData, 1);
            updateTable(tphData, 2);
            updateTable(joystickData, 3);
            }
        },
        error: function (ajaxContext) {
        },

    });


}

/**
 * @brief gets data from server
 * 
 */
function getDataFromServer(){
            console.log(joystickData);
            getDataRequest(joystickDataURL);
            getDataRequest(rpyDataURL);
            getDataRequest(tphDataURL);

}

/**
 * @brief Updates data in table
 * @param data: ==json data
=
 */
function updateTable(data, key){

    if(key == 1){
    table.rows[indexJSON.roll].cells[1].innerHTML = data.roll;
    table.rows[indexJSON.pitch].cells[1].innerHTML = data.pitch;
    table.rows[indexJSON.yaw].cells[1].innerHTML = data.yaw;}
    if(key == 2){

            table.rows[indexJSON.temp].cells[1].innerHTML = data.temp;
            table.rows[indexJSON.press].cells[1].innerHTML = data.press;
            table.rows[indexJSON.humi].cells[1].innerHTML = data.humi;}
    if(key == 3){

            table.rows[indexJSON.x].cells[1].innerHTML = data.x;
            table.rows[indexJSON.y].cells[1].innerHTML = data.y;
            table.rows[indexJSON.z].cells[1].innerHTML = data.z;}
}


/**
 * @brief Generates table
 */
function createTable(){

    var data = [];

    data.push(["Name", "Value", "Unit"]);

    data.push(["Temperature", "---", 'C']);		indexJSON.temp=1;
    data.push(["Pressure", "---", 'mbar']);		indexJSON.press=2;
    data.push(["Humidity", "---", '%']); 		indexJSON.humi=3;
    data.push(["Roll", "---", 'degrees']);		indexJSON.roll=4;
    data.push(["Pitch", "---", 'degrees']);		indexJSON.pitch=5;
    data.push(["Yaw", "---", 'degrees']);		indexJSON.yaw=6;
    data.push(["Joystick X", "---", '[-]']);	indexJSON.x=7;
    data.push(["Joystick Y", "---", '[-]']);	indexJSON.y=8;
    data.push(["Joystick Z", "---", '[-]']);	indexJSON.z=9;
    
    
    //Create table element and format it
    var table = document.createElement('table');
    table.style.width = '100%';
    table.setAttribute('border', '1');
    table.id="table";
    table.style.fontSize="20px";


    var columnsNumber = data[0].length;

    //Add the header row.
    //Insert row at the end of the current table
    var row = table.insertRow(-1);

    for (var i = 0; i < columnsNumber; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = data[0][i];
        row.appendChild(headerCell);
    }

    //Add the data rows.
    for (var i = 1; i < data.length; i++) {
        row = table.insertRow(-1);
        for (var j = 0; j < columnsNumber; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = data[i][j];
        }
    }

    //Set table in html file
    var container = document.getElementById('TableDiv');
    container.innerHTML = "";
    container.appendChild(table);

}
