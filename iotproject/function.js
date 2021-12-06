var screen = 0;
var previousScreen = 0;


function unHide(number)
{   var tempvar = previousScreen
    screen = number;
   if(tempvar == screen){
         document.getElementById("content").style.display="none";
         screen = 0;
        }
    else if(document.getElementById("content").style.display != "block")   
    {
        document.getElementById("content").style.display="block";
    }
    previousScreen = screen;
}