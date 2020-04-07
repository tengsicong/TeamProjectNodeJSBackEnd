var nowDate=new Date();
var nowYear=nowDate.getFullYear();
var nowMonth=nowDate.getMonth()+1;
//var month=(nowMonth<10?"0"+month:month);
var text=document.getElementById("yearAndMon");
text.innerText=nowYear+"-"+nowMonth+"";
var monthDays1=[31,29,31,30,31,30,31,31,30,31,30,31];
var monthDays2=[31,28,31,30,31,30,31,31,30,31,30,31]
function becomeDate(nowYear,nowMonth){
    var dt=new Date(nowYear,nowMonth-1,1);
    var firstDay=dt.getDay();
    var table=document.getElementById("table1");
    var monthDays=isRunYear();
    var rows=5;
    var cols=7;
    var k=1;

    for(var i=1;i<=rows;i++){
        var tri=table.insertRow();
        var tri1 = table.insertRow();
        for(var j=1;j<=7;j++){
            var tdi=tri.insertCell();
            var cellEvent = tri1.insertCell();

            // 到时候 判断语句根据数据库 meeting 对应值是否为空
            if (k%7==0 && j!= 6 && j!=7){
                cellEvent.innerHTML = "Team1 13:00-14:00";

            }else if(k%3==0 && j!= 6 && j!=7){
                cellEvent.innerHTML = "Team1 13:00-14:00";
                cellEvent.innerHTML = "Team2 09:00-10:00";

            } else{
                cellEvent.innerHTML="";
            }

            if(i==1&&i*j<firstDay+1)
                tdi.innerHTML="";
            else{
                if(k>monthDays[nowMonth-1])
                    break;
                tdi.innerHTML=k;
                k++;
            }
        }




        cellEvent.style.height="200px";
        tdi.style.width="5%";
        tri1.style.border="1px #e0e0e0 solid";
        tri.style.border="1px #e0e0e0 solid";

    }
}

function lastMon(){
    table1.innerHTML="";
    var text=document.getElementById("yearAndMon");
    if(nowMonth>1)
        nowMonth=nowMonth-1;
    else{
        nowYear--;
        nowMonth=12;
    }
    text.innerText=nowYear+"-"+nowMonth+"";
    becomeDate(nowYear,nowMonth);
}

function nextMon(){
    table1.innerHTML="";
    if(nowMonth<12)
        nowMonth=nowMonth+1;
    else{
        nowYear++;
        nowMonth=1;
    }
    var text=document.getElementById("yearAndMon");
    text.innerText=nowYear+"-"+nowMonth+"";
    becomeDate(nowYear,nowMonth);
}

function isRunYear(){
    if((nowYear%4==0||nowYear%400==0)&&nowYear%100!=0)
        return monthDays1;
    else
        return monthDays2;
}
becomeDate(nowYear,nowMonth);