<?php
	$mysqli = new mysqli('mysql.freehostia.com','rahfak9_biobots', 'Aa!0118021289', 'rahfak9_biobots');
	
	if ($mysqli->connect_error) {
		die('Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
	}

	$output = NULL;
	$action = $_POST['action'];
	$user_sql = $_POST['user_sql'];
	switch ($action) {
		case "load_dashboard_stats":
			load_dashboard_stats();
			break;
		case "load_print_data":
			load_print_data();
			break;
		case "load_cross_linking":
			load_cross_linking();
			break;
		case "load_cross_linking_bar_graph":
			load_cross_linking_bar_graph();
			break;
		case "load_extruder_data":
			load_extruder_data();
			break;
		case "load_extruder_scatter_graph":
			load_extruder_scatter_graph();
			break;
		case "load_layer_height":
			load_layer_height();
			break;
		case "load_layer_num_avg":
			load_layer_num_avg();
			break;
		case "load_wellpate":
			load_wellpate();
			break;
		case "load_wellpate_totals":
			load_wellpate_totals();
			break;
		case "user_exists":
			validate_user();
			break;
		case "print_history":
			print_history();
			break;
		default:
			echo "Your favorite color is neither red, blue, nor green!";
	}

	$mysqli->close();
	echo json_encode($output);
	function load_dashboard_stats() {
		GLOBAL $output, $mysqli, $user_sql;
		$user_sql = " ";
		$results = $mysqli->query("SELECT COUNT(DISTINCT email) as USER_COUNT, COUNT(DISTINCT serial) as 
	SERIAL_COUNT, COUNT(email) as TOTAL_PRINTS FROM USER_DATA" . $user_sql );
		$row = $results->fetch_array();
		$output = array('USER_COUNT' => $row["USER_COUNT"], 'SERIAL_COUNT' => $row['SERIAL_COUNT'], 'TOTAL_PRINTS' => $row['TOTAL_PRINTS'], "P_P_USER" => $row['TOTAL_PRINTS']/$row['USER_COUNT']);
		$results->free();
	}

	
	function load_print_data() {
		GLOBAL $output, $mysqli, $user_sql;
		$results = $mysqli->query("SELECT 
	MAX(dead_percent) as MAX_DP, 
	MIN(dead_percent) as MIN_DP, 
	FORMAT(AVG(dead_percent),2) as AVG_DP, 
	COUNT(dead_percent) as TOTAL,
	FORMAT(STDDEV(dead_percent),2) as STD_DP,
	MAX(live_percent) as MAX_LP, 
	MIN(live_percent) as MIN_LP, 
	FORMAT(AVG(live_percent),2) as AVG_LP, 
	FORMAT(STDDEV(live_percent),2) as STD_LP,
	MAX(elasticity) as MAX_EP, 
	MIN(elasticity) as MIN_EP, 
	FORMAT(AVG(elasticity),2) as AVG_EP, 
	FORMAT(STDDEV(elasticity),2) as STD_EP
	FROM USER_DATA" . $user_sql);
		$row = $results->fetch_array();
		$output = array('MAX_DP' => $row["MAX_DP"], 'MIN_DP' => $row['MIN_DP'], 'AVG_DP' => $row['AVG_DP'], "TOTAL" => $row['TOTAL'], "STD_DP" => $row["STD_DP"], 'MAX_LP' => $row["MAX_LP"], 'MIN_LP' => $row['MIN_LP'], 'AVG_LP' => $row['AVG_LP'], "STD_LP" => $row["STD_LP"],'MAX_EP' => $row["MAX_EP"], 'MIN_EP' => $row['MIN_EP'], 'AVG_EP' => $row['AVG_EP'], "STD_EP" => $row["STD_EP"], );
		$results->free();
	}

	
	function load_cross_linking() {
		GLOBAL $output, $mysqli, $user_sql;
		$results = $mysqli->query("SELECT 
	MAX(cl_duration) as MAX_DURATION, 
	MIN(cl_duration) as MIN_DURATION, 
	FORMAT(AVG(cl_duration),2) as AVG_DURATION, 
	COUNT(cl_duration) as TOTAL,
	FORMAT(STDDEV(cl_duration),2) as STD_DURATION,
	MAX(cl_intensity) as MAX_INTENSITY, 
	MIN(cl_intensity) as MIN_INTENSITY, 
	FORMAT(AVG(cl_intensity),2) as AVG_INTENSITY, 
	FORMAT(STDDEV(cl_intensity),2) as STD_INTENSITY,
	SUM(cl_enabled) AS COUNT_EN
	FROM USER_DATA" . $user_sql);
		$row = $results->fetch_array();
		$output = array('MAX_DURATION' => $row["MAX_DURATION"], 'MIN_DURATION' => $row['MIN_DURATION'], 'AVG_DURATION' => $row['AVG_DURATION'], "TOTAL" => $row['TOTAL'], "STD_DURATION" => $row["STD_DURATION"], 'MAX_INTENSITY' => $row["MAX_INTENSITY"], 'MIN_INTENSITY' => $row['MIN_INTENSITY'], 'AVG_INTENSITY' => $row['AVG_INTENSITY'], "STD_INTENSITY" => $row["STD_INTENSITY"], "COUNT_EN" => $row["COUNT_EN"]);
	}

	
	function load_cross_linking_bar_graph(){
		GLOBAL $output, $mysqli, $user_sql;
		$additional_constraint = str_replace("WHERE","AND",$user_sql);
		$temp_array = array(0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0);
		for ($x = 0; $x <= 10; $x++) {
			$results = $mysqli->query("SELECT FORMAT(AVG(cl_duration),2) as AVG_DURATION FROM USER_DATA WHERE 
			(cl_intensity >= ($x*10) ) AND (cl_intensity <  (($x + 1)*10)) AND (cl_enabled = 1)" . $additional_constraint);
			$row = $results->fetch_array();
			$temp_array[$x] = $row["AVG_DURATION"];
			$results->free();
		}

		$output = array('0_10' => strval($temp_array[0]), '10_20' => strval($temp_array[1]), '20_30' => strval($temp_array[2]), '30_40' => strval($temp_array[3]), '40_50' => strval($temp_array[4]), '50_60' => strval($temp_array[5]), '60_70' => strval($temp_array[6]), '70_80' => strval($temp_array[7]), '80_90' => strval($temp_array[8]), '90_100' => strval($temp_array[9]));
	}

	
	function load_extruder_data() {
		GLOBAL $output, $mysqli, $user_sql;
		$results = $mysqli->query("SELECT 
	MAX(extruder1) as MAX_E1, 
	MIN(extruder1) as MIN_E1, 
	FORMAT(AVG(extruder1),2) as AVG_E1, 
	COUNT(extruder1) as TOTAL,
	FORMAT(STDDEV(extruder1),2) as STD_E1,
	MAX(extruder2) as MAX_E2, 
	MIN(extruder2) as MIN_E2, 
	FORMAT(AVG(extruder2),2) as AVG_E2, 
	FORMAT(STDDEV(extruder2),2) as STD_E2
	FROM USER_DATA" . $user_sql);
		$row = $results->fetch_array();
		$output = array('MAX_E1' => $row["MAX_E1"], 'MIN_E1' => $row['MIN_E1'], 'AVG_E1' => $row['AVG_E1'], "TOTAL" => $row['TOTAL'], "STD_E1" => $row["STD_E1"], 'MAX_E2' => $row["MAX_E2"], 'MIN_E2' => $row['MIN_E2'], 'AVG_E2' => $row['AVG_E2'], "STD_E2" => $row["STD_E2"]);
	}

	
	function load_extruder_scatter_graph() {
		GLOBAL $output, $mysqli, $user_sql;
		$e1 = [];
		$e2 = [];
		$results = $mysqli->query("SELECT extruder1, extruder2 FROM USER_DATA" . $user_sql);
		while($row = $results->fetch_array()) {
			array_push($e1, $row["extruder1"]);
			array_push($e2, $row["extruder2"]);
		}

		$output = array('E1_DATA' => $e1, 'E2_DATA' => $e2);
	}

	
	function load_layer_height() {
		GLOBAL $output, $mysqli, $user_sql;
		$results = $mysqli->query("SELECT 
	MAX(layerheight) as MAX_LH, 
	MIN(layerheight) as MIN_LH, 
	FORMAT(AVG(layerheight),2) as AVG_LH, 
	COUNT(layerheight) as TOTAL,
	FORMAT(STDDEV(layerheight),2) as STD_LH
	FROM USER_DATA" . $user_sql);
		$row = $results->fetch_array();
		$output = array('MAX_LH' => $row["MAX_LH"], 'MIN_LH' => $row['MIN_LH'], 'AVG_LH' => $row['AVG_LH'], "TOTAL" => $row['TOTAL'], "STD_LH" => $row["STD_LH"]);
	}

	
	function load_layer_num_avg(){
		GLOBAL $output, $mysqli, $user_sql;
		$additional_constraint = str_replace("WHERE","AND",$user_sql);
		$temp_array = [];
		for ($counter = 0; $counter < 49; $counter++) {
			$results = $mysqli->query("SELECT FORMAT(AVG(layerheight),2) as AVG_LH FROM USER_DATA WHERE (layernum = ($counter + 1))" . $additional_constraint );
			$row = $results->fetch_array();
			array_push($temp_array, $row["AVG_LH"]);
			$results->free();
		}

		$output = array('avg_LH' => $temp_array);
	}

	
	function load_wellpate() {
		GLOBAL $output, $mysqli, $user_sql;
		$results = $mysqli->query("SELECT 
	MAX(wellpate) as MAX_WELLPATE, 
	MIN(wellpate) as MIN_WELLPATE, 
	FORMAT(AVG(wellpate),2) as AVG_WELLPATE, 
	COUNT(wellpate) as TOTAL,
	FORMAT(STDDEV(wellpate),2) as STD_WELLPATE
	FROM USER_DATA" . $user_sql);
		$row = $results->fetch_array();
		$output = array('MAX_WELLPATE' => $row["MAX_WELLPATE"], 'MIN_WELLPATE' => $row['MIN_WELLPATE'], 'AVG_WELLPATE' => $row['AVG_WELLPATE'], "TOTAL" => $row['TOTAL'], "STD_WELLPATE" => $row["STD_WELLPATE"]);
	}

	
	function load_wellpate_totals() {
		GLOBAL $output, $mysqli, $user_sql;
		$temp_array = array(0,0,0,0,0);
		$results = $mysqli->query("SELECT wellpate FROM USER_DATA" . $user_sql);
		while($row = $results->fetch_array()) {
			switch ($row['wellpate']) {
				case 1:
					$temp_array[0] = $temp_array[0] + 1;
					break;
				case 6:
					$temp_array[1] = $temp_array[1] + 1;
					break;
				case 12:
					$temp_array[2] = $temp_array[2] + 1;
					break;
				case 24:
					$temp_array[3] = $temp_array[3] + 1;
					break;
				case 96:
					$temp_array[4] = $temp_array[4] + 1;
					break;
				default:
					break;
		}

	}

	$output = array('WELLPATE_TOTALS' => $temp_array);
}


function validate_user() {
	GLOBAL $output, $mysqli, $user_sql;
	$results = $mysqli->query("SELECT COUNT(DISTINCT email) as USER_COUNT FROM USER_DATA WHERE email = '" . $user_sql . "'");
	// WHERE (email = 'user0@gmail.com'");
	$row = $results->fetch_array();
	
	if ($row['USER_COUNT'] != 1) {
		$output = array('FOUND' => false);
	} else {
		$output = array('FOUND' => true);
	}

}


function print_history(){
	GLOBAL $output, $mysqli, $user_sql;
	$history_html = '<ul class="collapsible " data-collapsible="accordion">';
	$counter = 0;
	$results = $mysqli->query("SELECT * FROM USER_DATA WHERE (email ='" . $user_sql . "')" );
	while($row = $results->fetch_array()) {
		$history_html = $history_html . '
    <li>
      <div class="collapsible-header"><i class="material-icons">event_note</i>Print Number: ' . $counter .'</div>
      <div class="collapsible-body">
	  <div style="margin: 2em 2em 2em 2em">
   <table >
        <thead>
          <tr style="background-color: #BDBDBD">
              <th data-field="id">Data Type</th>
              <th data-field="name">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr >
            <td><b>Serial Number</b></td>
            <td>' . $row['serial'] . '</td>
          </tr>
          <tr style="background-color: #E0E0E0">
            <td><b>Print Data</b></td>
			<td></td>
          </tr>
          <tr style="background-color: #E0E0E0">
            <td>Live Percent</td>
            <td>' . $row['live_percent'] . '%</td>
          </tr>
          <tr style="background-color: #E0E0E0">
            <td>Dead Percent</td>
            <td>' . $row['dead_percent'] . '%</td>
          </tr>
		   <tr style="background-color: #E0E0E0">
            <td>Elasticity</td>
            <td>' . $row['elasticity'] . '%</td>
          </tr>
		     <tr>
            <td><b>Print Info</b></td>
          </tr>
          <tr>
            <td>cl_Enabled</td>
            <td>' . $row['cl_enabled'] . '</td>
          </tr>
          <tr>
            <td>cl_Duration</td>
            <td>' . $row['cl_duration'] . '</td>
          </tr>
		   <tr>
            <td>cl_Intensity</td>
            <td>' . $row['cl_intensity'] . '%</td>
          </tr>
		  <tr style="background-color: #E0E0E0">
            <td><b>I/O Files</b></td>
			<td></td>
          </tr>
          <tr style="background-color: #E0E0E0">
            <td>Input</td>
            <td>' . $row['input'] . '</td>
          </tr>
          <tr style="background-color: #E0E0E0">
            <td>Output</td>
            <td>' . $row['output'] . '</td>
          </tr>
		  		  <tr>
            <td><b>Pressure</b></td>
          </tr>
          <tr>
            <td>Extruder 1</td>
            <td>' . $row['extruder1'] . '%</td>
          </tr>
          <tr>
            <td>Extruder 2</td>
            <td>'. $row['extruder2'] .'%</td>
          </tr>
		  <tr style="background-color: #E0E0E0">
		       <td><b>Resolution</b></td>
			   <td></td>
          </tr>
          <tr style="background-color: #E0E0E0">
            <td>Layer Number</td>
            <td>'. $row['layernum'] .'</td>
          </tr >
          <tr style="background-color: #E0E0E0">
            <td>Layer Height</td>
            <td>'. $row['layerheight'] .'</td>
          </tr>
		            <tr>
            <td><b>WellPlate</b></td>
            <td>'. $row['wellpate'] .'</td>
          </tr>
        </tbody>
      </table>
		</div>
	  </div>
    </li>';
		$counter += 1;
	}

	$history_html = $history_html . '  </ul>';
	$output = array('HISTORY' => $history_html);
}

?>