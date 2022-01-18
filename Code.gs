function getCOVID() {

  //Proviso ZIPs, as per https://en.wikipedia.org/wiki/Proviso_Township,_Cook_County,_Illinois
  provisoZIP = ["60104","60126","60130","60141","60153","60154","60155","60160","60161","60162","60163","60164","60165","60513","60521","60526","60546","60558","60682"];
 
  //for all the ZIPs in Proviso, for all the dates over last 90 days, call this API and store results in array
  //https://idph.illinois.gov/DPHPublicInformation/api/COVIDExport/GetZipByDay?zipCode=60130

  // loop the ZIPs array and call the IDPH API
  // store all results in temp array
  // ...and then push each object array to 2D array
  var provisoData = [];
  var covidAPIurl = "https://idph.illinois.gov/DPHPublicInformation/api/COVIDExport/GetZipByDay?zipCode=";

  for(i=0;i<provisoZIP.length;i++){
    // execute the API
   var idphResponse = UrlFetchApp.fetch(covidAPIurl + provisoZIP[i]);
   var idphJson = JSON.parse(idphResponse.getContentText());

    // loop the JSON array to get all values for this ZIP code
    //Logger.log(idphJson.length);
    for(j=0;j<idphJson.length;j++){
      
      //Logger.log(idphJson[j].ReportDate);
      
      // store in temp array
      var tempArr = {
        ReportDate: idphJson[j].ReportDate,
        ZipCode: idphJson[j].ZipCode,
        TotalCases: idphJson[j].TotalCases,
        TotalCaseChange: idphJson[j].TotalCaseChange,
        Tested: idphJson[j].Tested

      };

      // push to all-data array
      provisoData.push(tempArr);
    }

  }

  // and now, write to sheet
  var sheetUrl = "https://docs.google.com/spreadsheets/d/1rLYtwL46KtDQ-QYkKjiLF_JP_IZhBQiiB25A6qBDUWw/";
  var sheetId = sheetUrl.match(/[-\w]{25,}/);
  var covidSheet = SpreadsheetApp.openByUrl(sheetUrl);

  var today = (Utilities.formatDate(new Date(), 'America/Chicago', 'yyyy-MM-dd'));

  // activate the raw data tab
  var covidSheetTab = covidSheet.getSheetByName("Full List");


  // backup this tab before you overwrite it with new data
  // ...IF it doesn't already exist
  // first, check to see if it exists - if it does, delete the backup
  var allSheets = covidSheet.getSheets();
  for (var i=0 ; i<allSheets.length ; i++) {
      // define the current sheet
      var curSheetName = allSheets[i].getName();
      // determine if matches criteria
      if(curSheetName.includes("BACKUP")) { 
        covidSheet.deleteSheet(allSheets[i]);
      }
  }

  // ... and then write the new backup
  var destination = SpreadsheetApp.openById(sheetId);
  covidSheetTab.copyTo(destination).setName("Full List BACKUP - " + today);
  
  // prep the 2D array to push into Sheets
  var insertArr = [];
  insertArr = prepArray(provisoData);

  // insert all rows starting on row 2
  // this overwrites the previous day's call
  // admittedly, this is inefficient, but IDPH API does not contain an endpoint to simply get today's stats by ZIP - you have to pull full history
  if(insertArr.length > 0){
    covidSheetTab.getRange(2,1,insertArr.length,insertArr[0].length).setValues(insertArr);
  }
  
}

function prepArray(provisoData){

  var tempArr = [];

  for(i=0;i<provisoData.length;i++){
    tempArr.push([provisoData[i].ReportDate,
    provisoData[i].ZipCode,
    provisoData[i].TotalCases,
    provisoData[i].TotalCaseChange,
    provisoData[i].Tested
    ]);
  }

  return tempArr;

}
