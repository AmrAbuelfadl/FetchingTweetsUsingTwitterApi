function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var tool = ui.createMenu('Options').addItem('Search', 'searchFunc').addToUi();
  
}


function tSearcher(){ // 
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var sinceId = sheet.getRange(sheet.getLastRow(), 1).getValue();
  Logger.log(sinceId);
  var newcontent = search('#مدن_السودان_تنتفض',sinceId); // Pass to search method any hashtag you want to retrieve tweets relevant to it
  for(var t = 0; t< newcontent.length; t++){
    var tweet = newcontent[t];
    sheet.appendRow([tweet.id, JSON.stringify(tweet.user.screen_name), JSON.stringify(tweet.text), tweet.created_at, tweet.user.location]);
  }
}


function searchFunc(){ // Adding search ui component to excel spreadsheet
  var ui  = SpreadsheetApp.getUi();
  var response = ui.prompt("Twitter Search", "What Term do you want to search for?", ui.ButtonSet.OK_CANCEL);
  if(response.getSelectedButton() ==  ui.Button.OK){
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    var sinceId = sheet.getRange(sheet.getLastRow(), 1).getValue();
    var newcontent = search(response.getResponseText(), sinceId);
    for(var t = 0; t< newcontent.length; t++){
      var tweet = newcontent[t];
      sheet.appendRow([tweet.id, tweet.user.screen_name, tweet.text.replace(/\n/g, " "), tweet.created_at, tweet.user.location, tweet.retweet_count]);
      
    }
  } 
}


function setupTwitter() {
  var encodedBT = Utilities.base64Encode(encodeURIComponent("API Key")+":"+encodeURIComponent("API secret key")); // fill the encodeURIComponent with your Api key and secret key

  var params = {
    "method" : "POST",
    "headers" : {
      "Authorization" : "Basic " +encodedBT ,
      "Content-Type" : "application/x-www-form-urlencoded;charset=UTF-8",
      "Accept-Encoding" : "gzip"
    },
    "payload" : {
      "grant_type" : "client_credentials"
    }
  };
  var response = UrlFetchApp.fetch('https://api.twitter.com/oauth2/token', params);
  var data = JSON.parse(response.getContentText());
  if(data.access_token){
    PropertiesService.getScriptProperties().setProperty("TATOKEN", data.access_token);
  }
  
  return data.access_token;
}


function search(q) { //search query method
  var token =  PropertiesService.getScriptProperties().getProperty("TATOKEN");
  if(token === null){
    token = setupTwitter();
  }
  //var sinceID = (s != '') ? '&since_id='+s : '';  
  //var maxID = (s != '') ? '&max_id='+s : '';
  //var url = 'https://api.twitter.com/1.1/search/tweets.json?q=AND -filter:retweets AND -is:reply '+encodeURIComponent(q) + '&count=100' + '&until=2019-04-18' + '&lang=en' ;
 //var url = 'https://api.twitter.com/1.1/tweets/search/fullarchive/development.json?query= lang:en -is:reply -is:retweet '+encodeURIComponent(q)  +'&maxResults=500'+ '&fromDate=201102110000' + '&toDate=201102120000'+'&next=eyJhdXRoZW50aWNpdHkiOiI4MzEwN2ExYjAyNmU4NWJlNGJlNTVmMTk4YTAyMzM3Mzk0ZDdkYWQ3NTg4NGZiYzA5NTgzMzc0ZjFjMGJmMmMwIiwiZnJvbURhdGUiOiIyMDExMDIxMTAwMDAiLCJ0b0RhdGUiOiIyMDExMDIxMjAwMDAiLCJuZXh0IjoiMjAxMTAyMTIwMDAwMDAtMzYxNjY3NzQ4MDIwOTYxMjktMCJ9';
 var url =  'https://api.twitter.com/1.1/tweets/search/fullarchive/development/counts.json?query= '+encodeURIComponent(q)  + '&fromDate=201101280000' + '&toDate=201102120000' + '&bucket=day';
   // var url = 'https://api.twitter.com/1.1/tweets/search/30day/dev.json?query= lang:ar -has:mentions '+encodeURIComponent(q)  +'&maxResults=100'+ '&fromDate=201904120000' + '&toDate=201904130000';

  var params = {
    "method" : "GET",
    "headers" : {
      "Authorization" : "Bearer " +token  ,
      "Content-Type" : "application/x-www-form-urlencoded;charset=UTF-8",
      "Accept-Encoding" : "gzip"
    },
    "followRedirects" : true,
    "muteHttpExceptions" : true
  };
  var response = UrlFetchApp.fetch(url, params);
  Logger.log(response);
  var data = JSON.parse(response.getContentText());
  //Logger.log(data.next);
  var tweetO = data.results;
  return tweetO;
  
}

function checkAr(){ // looking for certain Arabic words
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet110");
  var data = sheet.getDataRange().getValues();
  var one = 1;
  for(i in data){ 
    if(data[i][2].indexOf("شارك ") > -one  || data[i][2].indexOf("انزل ") > -one || data[i][2].indexOf("انضم ") > -one || data[i][2].indexOf("الشارع ") > -one || data[i][2].indexOf("هيا ") > -one || data[i][2].indexOf("ابقي ") > -one || data[i][2].indexOf("ادعم ") > -one || data[i][2].indexOf("اطلع ") > -one  || data[i][2].indexOf("اخرج ") > -one || data[i][2].indexOf("استمر ") > -one || data[i][2].indexOf("مارقين ") > -one || data[i][2].indexOf("امرق ") > -one || data[i][2].indexOf("تظاهر ") > -one ){


      ss.appendRow([data[i][0],data[i][1],data[i][2], data[i][3], data[i][4], data[i][5]]);
    }
   }
  }

function find(){ // looking for certain English words
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet75");
  var data = sheet.getDataRange().getValues();
  var one = 1;
  for(i in data){ 
    if(data[i][2].indexOf("bread ") > -one ){
      ss.appendRow([data[i][2]]);
    }
   }
  }
function translate(){ // Translating tweets
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet120");
  var data = sheet.getDataRange().getValues();
  var translation

  for(i in data){ 
      var translation = LanguageApp.translate(data[i][2], 'ar', 'en')
      ss.appendRow([translation, data[i][3]]);
    
   }
  }