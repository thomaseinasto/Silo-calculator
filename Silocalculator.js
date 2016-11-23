// Silo temperature assigner
// © Evikontroll Systems Ltd. 2016
function SilotemperatureCalcuator(descriptionutf,temperatureutf,silocabletemperatures){
  var i = 0;
  var q = 0;
  var z = 0;
  var y = 0;
  var t = 0;
  var allinfo,singleinfo,tempinfo,singletempinfo, splitinfo=[], id=[], sensornum=[],temperature=[],appendID,sensor1,hex,g,r;

if (silocabletemperatures.value===0){ // If no cables detected 
   eval('nosensors.set(true)'); // Declare that no sensors were gathered 
}
else if(silocabletemperatures.value == 3072){ // If cable has overcurrent    --Should be replaced with errorbits!!
	eval('mLanline.set(true)'); // Declare that mLan line is on overcurrent
	}
else{
  	// UTF-16 TO HEX Description
      var hexeddescription = "";
      for (g=0; g<descriptionutf.value.length; g++) {
          hexdescription = descriptionutf.value.charCodeAt(g).toString(16);
          hexeddescription += ("000"+hexdescription).slice(-4);
      }
  	
  	// UTF-16 TO HEX temperature
  	var hexedtemperature = "";
      for (r=0; r<temperatureutf.value.length; r++) {
          hextemperature = temperatureutf.value.charCodeAt(r).toString(16);
          hexedtemperature += ("000"+hextemperature).slice(-4);
      }


  allinfo = hexeddescription; //CableData
  tempinfo = hexedtemperature; // Temperatures

  singleinfo = allinfo.match(/.{1,4}/g); // Split Cable data
  singletempinfo = tempinfo.match(/.{1,4}/g); // Split Temperatures

  // Change description data to DEC and put description data to arrays 
  do {

  var j = 0;

  splitinfo[i] = singleinfo[i].match(/.{1,2}/g); // Split ID and Sensors

  id[i] = parseInt(splitinfo[i][j], 16); // ID to DEC
  j++;
  
  sensornum[i] = parseInt(splitinfo[i][j], 16); // SensorNo to DEC
  if (sensornum[i] == 69) { // If overcurrent on silo cable and sensorNo = 5
   sensornum[i] = 5; //Sensor No = 5 and known that temperatures are FFFF
   eval('Error.set(true)'); // Rise error point
   eval('Errorcable.set('id[i]' is broken)'); //Declare what ID is broken
  q += sensornum[i]; // Add x No to sensor No 
}else{               // If no problems
  q += sensornum[i]; // Add sensor No to sensors
  i++;
  }while(i<silocabletemperatures.value); // Until Recognized temperature cables


  // Change temperature data to DEC and put temperature data to arrays 
  do {
	
      temperature[z] = parseInt(singletempinfo[z], 16); // Temp to DEC
      if (temperature[z] > 32000 ) { // If temperature is < 0
	  if (singletempinfo[z] == 65535) { // If RAW Temperature is FFFF
	  temperature[z] = 99;           // Error code is 99
	  }else{						 // If temperature is < 0
     temperature[z] = temperature[z] - 65535; //Signed value of HEX
      }                                               
	  }
  	z++;
  } while (z<q); //Until sensor number

  // Start assigning metapoints
  do { 
  do {
  x = 1;

  do {
  
if (id[y]<10){
  eval('ID0'+id[y]+'S'+x+'.set(temperature[t]*0.0625)'); // Variable name assigned set point value
}
else{
  eval('ID'+id[y]+'S'+x+'.set(temperature[t]*0.0625)'); // Variable name assigned set point value
}
  x++;
  t++;
  }while (x<6); //Known that 4 sensors on cables 
  y++;
  }while (y<silocabletemperatures.value); // Until points
  }while (t<q);
}
}    