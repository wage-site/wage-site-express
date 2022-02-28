
   var userid = "7137"; 
   var userkey= "a8e0ed5e1cf288124d1b84cd0c994958";
   var time = 24 * 3600; // last 24 hours of data
   
   // HELPER FUNCTIONS FOR URADMONITOR API
   
     function getUnit(sensor) {
       switch (sensor) {
         case "temperature": return "°C";
         case "cpm": return "CPM";
         case "voltage": return "Volts";
         case "duty": return "‰";
         case "pressure": return "Pa";
         case "humidity": return "% RH";
         case "gas1": return "ppm";
         case "gas2": return "ppm";
         case "gas3": return "ppm";
         case "gas4": return "ppm";
         case "dust": return "mg/m³";
         case "co2" : return "ppm";
         case "ch2o" : return "ppm";
         case "pm25" : return "µg/m³";
         case "pm10" : return "µg/m³";
         case "noise" : return "dBA";
         case "voc" : return "voc";
       }
     }
     function showValue(data,index){

       // faci cate un document.getelementbyid pentru fiecare valoare
       //inlocuiesti data[data.length - 1].pm1 cu data[data.length -1].sensorul de care ai nevoie
       document.getElementById('pm1' + index).innerHTML = parseFloat(data[data.length-1].pm1)
       document.getElementById('pm10' + index).innerHTML = parseFloat(data[data.length-1].pm10)
       document.getElementById('pm25' + index).innerHTML = parseFloat(data[data.length-1].pm25)
       document.getElementById('pressure' + index).innerHTML = parseFloat(data[data.length-1].pressure) / 100
       document.getElementById('temperature' + index).innerHTML = Math.round(parseFloat(data[data.length-1].temperature))
       document.getElementById('humidity' + index).innerHTML = Math.round(parseFloat(data[data.length-1].humidity))
     }

     function downloadUnits(u) {
       $("#status").html('loading').css('color', 'magenta');
       $.ajax({
             type: 'GET',
             url: "https://data.uradmonitor.com/api/v1/devices/userid/" + u ,
             dataType: 'json',
         success: function(data) { 
             // status
             if (Object.keys(data)[0] == 'error') 

              console.log('Error downloadUnits')

           else

           for(var i=0;i<=data.length;i++)
             {
               downloadData(time, data[i].id, "all", userid, userkey, chart1 , i)
             }

           // first trigger
           if (data.length > 0)
             $('#units').trigger('change');
         },
         async: true
       });
     }
   
     function downloadData(time, data, sensor, u, k, graph,index) {
       $("#status").html('loading').css('color', 'magenta');
       $.ajax({
             type: 'GET',
             url: "https://data.uradmonitor.com/api/v1/devices/" + data + "/" + sensor + "/" + time,
             dataType: 'json',
         headers: { 'Content-Type' : 'text/plain', 'X-User-id': u, 'X-User-hash': k },
             success: function(data, status) { 
           if (status != 'success') {
             $("#status").html('error').css('color', 'red');
           } else {
             if (Object.keys(data)[0] != 'error') {
               var stringified = JSON.stringify(data);
               showValue(data,index)
               drawChart(data, data, sensor, graph);
             }
           }
             },
             async: true
       });
     }
     
     function drawChart(id, data, sensor, graph) {
       var plot = [];
       for(var index in data) {
         if(!data.hasOwnProperty(index)) continue;
         var unit = data[index];
         var value = parseFloat(unit[sensor]);
         plot[index] = [new Date(unit.time * 1000), value];
       }
           if (sensor == "cpm") sensor = "dose";
       graph.updateOptions({ 
             colors: ['#0d0dff', '0dff0d'],
                 labels: ['Time', sensor],
               'file': plot,
               ylabel: getUnit(sensor),
           }
       );
     }
     

     
     // START EXECUTION
     if (typeof userid == 'undefined' || typeof userkey == 'undefined')
       $("#status").html('Configure variables userid and userkey in the code, using your credentials, as presented in the dashboard').css('color', 'red');
     else {
       downloadUnits(userid);
     }          
     

     var chart1 = new Dygraph(
       'graph1', [], {
         axisLabelColor: '#555',
         legend: 'always',
               labelsDivStyles: { 'textAlign': 'right' },
               connectSeparatedPoints: true,
               colors: [],
             labels: []
       }
     );