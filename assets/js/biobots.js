 var user_sql = " WHERE serial = 0";
 var current_user = "";
 window.onload = function() {
   $('.modal-trigger').leanModal();
 }

 function display_dashboard() {
   user_sql = "";
   document.getElementById("admin_dashboard").style.display = "block";
   document.getElementById("admin_search").style.display = "none";
   document.getElementById("dashboard_stats").style.display = "block";
   document.getElementById("user_history").style.display = "none";
   document.getElementById("display_type").innerHTML = "Dashboard";
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'load_dashboard_stats',
       'user_sql': user_sql
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     document.getElementById('active_users').innerHTML = JSONObject[
       "USER_COUNT"];
     document.getElementById('active_machines').innerHTML = JSONObject[
       "SERIAL_COUNT"];
     document.getElementById('total_prints').innerHTML = JSONObject[
       "TOTAL_PRINTS"];
     document.getElementById('prints_per_user').innerHTML = JSONObject[
       "P_P_USER"];
     print_data_chart();
     cross_linking();
     extruder();
     layer_height();
     wellpate();
   }).fail(function() {
     alert("Posting failed.");
   });
   return false;
 }

 function display_individual_user() {
   document.getElementById("admin_dashboard").style.display = "none";
   document.getElementById("admin_search").style.display = "block";
   document.getElementById("dashboard_stats").style.display = "none";
   document.getElementById("user_history").style.display = "none";
   document.getElementById("user_search_box").value = "";
 }

 function print_data_chart() {
   var chart = new CanvasJS.Chart("print_data_chart", {
     title: {
       text: "Averages"
     },
	 axisX:{ 
		title: "Print Data",
	 },
     axisY:{ 
        title: "Average Percent",
	 },
     data: [{
       dataPoints: [{
         y: 0,
         label: "Live Percent"
       }, {
         y: 20,
         label: "Dead Percent"
       }, {
         y: 0,
         label: "Elasticity"
       }]
     }]
   });
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'load_print_data',
       'user_sql': user_sql
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     document.getElementById('dp_max').innerHTML = JSONObject["MAX_DP"] +
       "%";
     document.getElementById('dp_min').innerHTML = JSONObject["MIN_DP"] +
       "%";
     document.getElementById('dp_total').innerHTML = JSONObject["TOTAL"];
     document.getElementById('dp_average').innerHTML = JSONObject[
       "AVG_DP"] + "%";
     document.getElementById('dp_std').innerHTML = JSONObject["STD_DP"] +
       "%";
     document.getElementById('lp_max').innerHTML = JSONObject["MAX_LP"] +
       "%";
     document.getElementById('lp_min').innerHTML = JSONObject["MIN_LP"] +
       "%";
     document.getElementById('lp_total').innerHTML = JSONObject["TOTAL"];
     document.getElementById('lp_average').innerHTML = JSONObject[
       "AVG_LP"] + "%";
     document.getElementById('lp_std').innerHTML = JSONObject["STD_LP"] +
       "%";
     document.getElementById('ep_max').innerHTML = JSONObject["MAX_EP"] +
       "%";
     document.getElementById('ep_min').innerHTML = JSONObject["MIN_EP"] +
       "%";
     document.getElementById('ep_total').innerHTML = JSONObject["TOTAL"];
     document.getElementById('ep_average').innerHTML = JSONObject[
       "AVG_EP"] + "%";
     document.getElementById('ep_std').innerHTML = JSONObject["STD_EP"] +
       "%";
     chart.options.data[0].dataPoints[0].y = parseFloat(JSONObject[
       "AVG_LP"]);
     chart.options.data[0].dataPoints[1].y = parseFloat(JSONObject[
       "AVG_DP"]);
     chart.options.data[0].dataPoints[2].y = parseFloat(JSONObject[
       "AVG_EP"]);
     chart.render();
   }).fail(function() {
     alert("Posting failed.");
   });
 }

 function cross_linking() {
   var chart = new CanvasJS.Chart("cross_linking_1", {
     title: {
       text: "Intensity vs Average Duration"
     },
	 axisX:{ 
		title: "Intensity",
	 },
     axisY:{ 
        title: "Average Duration",
	 },
     data: [{
       dataPoints: [{
         y: 297571.0,
         label: "0-10"
       }, {
         y: 267017.0,
         label: "10-20"
       }, {
         y: 175200.0,
         label: "20-30"
       }, {
         y: 154580.0,
         label: "30-40"
       }, {
         y: 116000.0,
         label: "40-50"
       }, {
         y: 97800.0,
         label: "50-60"
       }, {
         y: 20682.0,
         label: "60-70"
       }, {
         y: 20350.0,
         label: "70-80"
       }, {
         y: 20350.0,
         label: "80-90"
       }, {
         y: 20350.0,
         label: "90-100"
       }]
     }]
   });
   var chart2 = new CanvasJS.Chart("cross_linking_2", {
     theme: "theme2",
     title: {
       text: "Enabled vs Disabled"
     },
     data: [{
       type: "pie",
       showInLegend: true,
       toolTipContent: "#percent %",
       legendText: "{indexLabel}",
       dataPoints: [{
         y: 11,
         indexLabel: "Enabled"
       }, {
         y: 89,
         indexLabel: "Disabled"
       }]
     }]
   });
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'load_cross_linking',
       'user_sql': user_sql
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     document.getElementById('dur_max').innerHTML = JSONObject[
       "MAX_DURATION"];
     document.getElementById('dur_min').innerHTML = JSONObject[
       "MIN_DURATION"];
     document.getElementById('dur_total').innerHTML = JSONObject["TOTAL"];
     document.getElementById('dur_average').innerHTML = JSONObject[
       "AVG_DURATION"];
     document.getElementById('dur_std').innerHTML = JSONObject[
       "STD_DURATION"];
     document.getElementById('int_max').innerHTML = JSONObject[
       "MAX_INTENSITY"] + "%";
     document.getElementById('int_min').innerHTML = JSONObject[
       "MIN_INTENSITY"] + "%";
     document.getElementById('int_total').innerHTML = JSONObject["TOTAL"];
     document.getElementById('int_average').innerHTML = JSONObject[
       "AVG_INTENSITY"] + "%";
     document.getElementById('int_std').innerHTML = JSONObject[
       "STD_INTENSITY"] + "%";
     chart.render();
     chart2.options.data[0].dataPoints[0].y = parseInt(JSONObject[
       'COUNT_EN']);
     chart2.options.data[0].dataPoints[1].y = parseInt(JSONObject['TOTAL'] -
       JSONObject['COUNT_EN']);
     chart2.render();
   }).fail(function() {
     alert("Posting failed.");
   });
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'load_cross_linking_bar_graph',
       'user_sql': user_sql
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     chart.options.data[0].dataPoints[0].y = parseFloat((JSONObject[
       '0_10']).replace(",", ""));
     chart.options.data[0].dataPoints[1].y = parseFloat((JSONObject[
       '10_20']).replace(",", ""));
     chart.options.data[0].dataPoints[2].y = parseFloat((JSONObject[
       '20_30']).replace(",", ""));
     chart.options.data[0].dataPoints[3].y = parseFloat((JSONObject[
       '30_40']).replace(",", ""));
     chart.options.data[0].dataPoints[4].y = parseFloat((JSONObject[
       '40_50']).replace(",", ""));
     chart.options.data[0].dataPoints[5].y = parseFloat((JSONObject[
       '50_60']).replace(",", ""));
     chart.options.data[0].dataPoints[6].y = parseFloat((JSONObject[
       '60_70']).replace(",", ""));
     chart.options.data[0].dataPoints[7].y = parseFloat((JSONObject[
       '70_80']).replace(",", ""));
     chart.options.data[0].dataPoints[8].y = parseFloat((JSONObject[
       '80_90']).replace(",", ""));
     chart.options.data[0].dataPoints[9].y = parseFloat((JSONObject[
       '90_100']).replace(",", ""));
     chart.render();
   }).fail(function() {
     alert("Posting failed.");
   });
 }

 function extruder() {
   var chart = new CanvasJS.Chart("extruder", {
     title: {
       text: "Dispersion fo Extruder 1 versus Extruder 2"
     },
	 axisX:{ 
		title: "Extruder 1",
	 },
     axisY:{ 
        title: "Extruder 2",
	 },
     data: [{
       type: "scatter",
       dataPoints: []
     }]
   });
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'load_extruder_data',
       'user_sql': user_sql
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     document.getElementById('e1_max').innerHTML = JSONObject["MAX_E1"];
     document.getElementById('e1_min').innerHTML = JSONObject["MIN_E1"];
     document.getElementById('e1_total').innerHTML = JSONObject["TOTAL"];
     document.getElementById('e1_average').innerHTML = JSONObject[
       "AVG_E1"];
     document.getElementById('e1_std').innerHTML = JSONObject["STD_E1"];
     document.getElementById('e2_max').innerHTML = JSONObject["MAX_E2"] +
       "%";
     document.getElementById('e2_min').innerHTML = JSONObject["MIN_E2"] +
       "%";
     document.getElementById('e2_total').innerHTML = JSONObject["TOTAL"];
     document.getElementById('e2_average').innerHTML = JSONObject[
       "AVG_E2"] + "%";
     document.getElementById('e2_std').innerHTML = JSONObject["STD_E2"] +
       "%";
     chart.render();
   }).fail(function() {
     alert("Posting failed.");
   });
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'load_extruder_scatter_graph',
       'user_sql': user_sql
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     var e1 = JSONObject["E1_DATA"];
     var e2 = JSONObject["E2_DATA"];
     var i;
     for (i = 0; i < e1.length; i++) {
       chart.options.data[0].dataPoints.push({
         x: parseFloat((e1[i]).replace(",", "")),
         y: parseFloat((e2[i]).replace(",", ""))
       });
     }
     chart.render();
   }).fail(function() {
     alert("Posting failed.");
   });
 }

 function layer_height() {
   var chart = new CanvasJS.Chart("layers", {
     title: {
       text: "Average Layer Height"
     },
	 axisX:{ 
		title: "Layer Number",
	 },
     axisY:{ 
        title: "Average Height",
	 },
     data: [{
       type: "stackedColumn",
       dataPoints: []
     }]
   });
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'load_layer_height',
       'user_sql': user_sql
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     document.getElementById('lh_max').innerHTML = JSONObject["MAX_LH"];
     document.getElementById('lh_min').innerHTML = JSONObject["MIN_LH"];
     document.getElementById('lh_total').innerHTML = JSONObject["TOTAL"];
     document.getElementById('lh_average').innerHTML = JSONObject[
       "AVG_LH"];
     document.getElementById('lh_std').innerHTML = JSONObject["STD_LH"];
   }).fail(function() {
     alert("Posting failed.");
   });
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'load_layer_num_avg',
       'user_sql': user_sql
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     var avg_LH = JSONObject["avg_LH"];
     var i;
     for (i = 0; i < avg_LH.length; i++) {
       if (avg_LH[i] != null) {
         chart.options.data[0].dataPoints.push({
           y: parseFloat((avg_LH[i]).replace(",", "")),
           label: (i + 1).toString()
         });
       } else {
         chart.options.data[0].dataPoints.push({
           y: 0
         });
       }
     }
     chart.render();
   }).fail(function() {
     alert("Posting failed.");
   });
 }

 function wellpate() {
   var chart = new CanvasJS.Chart("wellpate", {
     title: {
       text: "Wellplate Usage Count"
     },
	 axisX:{ 
		title: "Wellplate Number",
	 },
     axisY:{ 
        title: "Usage Count",
	 },
     data: [{
       dataPoints: []
     }]
   });
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'load_wellpate',
       'user_sql': user_sql
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     document.getElementById('wellpate_max').innerHTML = JSONObject[
       "MAX_WELLPATE"];
     document.getElementById('wellpate_min').innerHTML = JSONObject[
       "MIN_WELLPATE"];
     document.getElementById('wellpate_total').innerHTML = JSONObject[
       "TOTAL"];
     document.getElementById('wellpate_average').innerHTML = JSONObject[
       "AVG_WELLPATE"];
     document.getElementById('wellpate_std').innerHTML = JSONObject[
       "STD_WELLPATE"];
     chart.render();
   }).fail(function() {
     alert("Posting failed.");
   });
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'load_wellpate_totals',
       'user_sql': user_sql
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     var totals = JSONObject["WELLPATE_TOTALS"];
     chart.options.data[0].dataPoints.push({
       y: parseInt(totals[0]),
       label: 1
     });
     chart.options.data[0].dataPoints.push({
       y: parseInt(totals[1]),
       label: 6
     });
     chart.options.data[0].dataPoints.push({
       y: parseInt(totals[2]),
       label: 12
     });
     chart.options.data[0].dataPoints.push({
       y: parseInt(totals[3]),
       label: 24
     });
     chart.options.data[0].dataPoints.push({
       y: parseInt(totals[4]),
       label: 96
     });
     chart.render();
   }).fail(function() {
     alert("Posting failed.");
   });
 }

 function validate_user() {
   var username = document.getElementById("user_search_box").value;
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'user_exists',
       'user_sql': username
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     var FOUND = JSONObject["FOUND"];
     if (!(FOUND)) {
       $('#modal1').openModal();
       return;
     } else {
       user_sql = " WHERE (email = '" + username + "')";
       print_data_chart();
       cross_linking();
       extruder();
       layer_height();
       wellpate();
       document.getElementById("admin_dashboard").style.display = "block";
       document.getElementById("admin_search").style.display = "none";
       document.getElementById("display_type").innerHTML = "User: " +
         username;
       document.getElementById("user_history").style.display = "block";
       current_user = username;
       print_history();
     }
   }).fail(function() {
     alert("Posting failed.");
   });
 }

 function print_history() {
   $.ajax({
     type: 'POST',
     url: 'assets/php/admin_dashboard.php',
     data: {
       'action': 'print_history',
       'user_sql': current_user
     },
   }).done(function(data) {
     var JSONString = data;
     var JSONObject = JSON.parse(JSONString);
     document.getElementById('history_data').innerHTML = JSONObject[
       "HISTORY"];
     $('.collapsible').collapsible({
       accordion: false 
     });
   }).fail(function() {
     alert("Posting failed.");
   });
 }

 function login() {
   if (((document.getElementById('email').value).localeCompare(
     "admin@admin.com")) == 0) {
     display_dashboard();
     document.getElementById('log_in').style.display = "none";
     document.getElementById('dashboard_link').style.display = "block";
     document.getElementById('search_link').style.display = "block";
     document.getElementById('logout_link').style.display = "block";
   } else {
     $.ajax({
       type: 'POST',
       url: 'assets/php/admin_dashboard.php',
       data: {
         'action': 'user_exists',
         'user_sql': document.getElementById('email').value
       },
     }).done(function(data) {
       var JSONString = data;
       var JSONObject = JSON.parse(JSONString);
       var FOUND = JSONObject["FOUND"];
       if (!(FOUND)) {
         $('#modal1').openModal();
         return;
       } else {
         document.getElementById('log_in').style.display = "none";
         document.getElementById("user_search_box").value = document.getElementById(
           'email').value;
         document.getElementById('logout_link').style.display = "block";
         document.getElementById("dashboard_stats").style.display =
           "none";
         validate_user();
       }
     }).fail(function() {
       alert("Posting failed.");
     });
   }
 }

 function logout() {
   document.getElementById('dashboard_link').style.display = "none";
   document.getElementById('search_link').style.display = "none";
   document.getElementById('logout_link').style.display = "none";
   document.getElementById('log_in').style.display = "block";
   document.getElementById("admin_dashboard").style.display = "none";
   document.getElementById("admin_search").style.display = "none";
   document.getElementById("dashboard_stats").style.display = "none";
   document.getElementById("user_history").style.display = "none";
   document.getElementById('email').value = "";
 }