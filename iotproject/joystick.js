var ipFromBrowser;
var savedConfigData="config.json";
var rpyDataUrl="/data/rpy.json";



var joyData;

var sampleTime;
var sampleQuantity;
var ip;
var port;
var timer;




var xChart;
var yChart;
var zChart;


var xyData;
var yyData;
var zyData;

var xData;

var lastTimeStamp;



$(document).ready(function(){
    ipFromBrowser=self.location.hostname
    console.log(ipFromBrowser);
    getConfigDataFromServer();
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
        createCharts()
        startTimer();
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

    rpyDataUrl="http://"+ip+"/joy.json";
    document.getElementById("sampletime").innerHTML=sampleTime*1000;
    document.getElementById("sampleQuantity").innerHTML=sampleQuantity;

    console.log("Config values updated");
}




/**
 * @brief Start timer that downloads data
 */
function startTimer(){
    timer=setInterval(getData, sampleTime*1000);
}

/**
 * @brief Gets chosen data from server
 * @param dataURL: URL of json file to download
 * @param key: information what data was downloaded
 */
function getDataRequest(dataURL){

    $.ajax(dataURL, {
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        cache: false,
        async : true,
        success: function(responseJSON, status, xhr) {
            joyData=responseJSON;

        },
        error: function (ajaxContext) {
            console.log("Error while getting data from server");
        },

    });


}

/**
 * @brief Choose data to get from server, calls getDataRequest function
 * and updateTable function
 */
function getData(){
    getDataRequest(rpyDataUrl);
    updateChart();

}

/**
 * @brief Updates data in table
 * @param
 */
function updateChart(){

    if(xyData.length >= sampleQuantity)
    {
        xData.splice(0,1);

        xyData.splice(0,1);
        yyData.splice(0,1);
        zyData.splice(0,1);

        lastTimeStamp += sampleTime;

        xData.push(lastTimeStamp.toFixed(2));
    }

    xyData.push(joyData.x);
    yyData.push(joyData.y);
    zyData.push(joyData.z);


    xChart.data.datasets[0].data =xyData ;
    yChart.data.datasets[0].data =yyData ;
    zChart.data.datasets[0].data =zyData ;


    xChart.update();
    yChart.update();
    zChart.update();



}

function newChart(name,xData,yData,xlabel,ylabel,ymin,ymax,context){
    chart = new Chart(context, {
        // The type of chart: linear plot
        type: 'line',

        // Dataset: 'xdata' as labels, 'ydata' as dataset.data
        data: {
            labels: xData,
            datasets: [{
                fill: false,
                label: name,
                backgroundColor: 'rgb(0, 0, 255)',
                borderColor: 'rgb(0, 0, 255)',
                data: yData,
                lineTension: 0
            }]
        },
        // Configuration options
        options: {
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: ylabel
                    },
                    ticks: {
                        suggestedMin: ymin,
                        suggestedMax: ymax
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: xlabel
                    }
                }]
            }
        }
    });

    return chart
}
/**
 * @brief Generates table
 */
function createCharts(){

    xData = [...Array(sampleQuantity).keys()];

    xData.forEach(function (value,index){value=(value*sampleTime).toFixed(2);},xData)

    lastTimeStamp = xData[xData.length-1];

    xyData = [];
    yyData = [];
    zyData = [];


    
    rContext = $("#xChart")[0].getContext('2d');
    piContext = $("#yChart")[0].getContext('2d');
    yContext = $("#zChart")[0].getContext('2d');


    xChart=newChart("Temperature Chart",xData,xyData,"[s]","[degree]",-20,20,rContext)
    yChart=newChart("Humidity Chart",xData,yyData,"[s]","[degree]",-20,20,piContext)
    zChart=newChart("Pressure",xData,zyData,"[s]","[degree]",-20,20,yContext)


}









