var ipFromBrowser;
var savedConfigData="config.json";
var rpyDataUrl="/data/rpy.json";



var rpyData;
var tphData;

var sampleTime;
var sampleQuantity;
var ip;
var port;
var timer;




var tChart;
var pChart;
var hChart;


var tyData;
var pyData;
var hyData;

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

    rpyDataUrl="http://"+ip+"/tph.json";
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
            rpyData=responseJSON;

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

    if(tyData.length >= sampleQuantity)
    {
        xData.splice(0,1);

        tyData.splice(0,1);
        pyData.splice(0,1);
        hyData.splice(0,1);

        lastTimeStamp += sampleTime;

        xData.push(lastTimeStamp.toFixed(2));
    }

    tyData.push(rpyData.temp);
    pyData.push(rpyData.press);
    hyData.push(rpyData.humi);


    tChart.data.datasets[0].data =tyData ;
    pChart.data.datasets[0].data =pyData ;
    hChart.data.datasets[0].data =hyData ;


    tChart.update();
    pChart.update();
    hChart.update();



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

    tyData = [];
    pyData = [];
    hyData = [];


    
    rContext = $("#tChart")[0].getContext('2d');
    piContext = $("#pChart")[0].getContext('2d');
    yContext = $("#hChart")[0].getContext('2d');


    tChart=newChart("Temperature Chart",xData,tyData,"[s]","[degree]",-180,180,rContext)
    pChart=newChart("Humidity Chart",xData,pyData,"[s]","[degree]",-180,180,piContext)
    hChart=newChart("Pressure",xData,hyData,"[s]","[degree]",-180,180,yContext)


}









