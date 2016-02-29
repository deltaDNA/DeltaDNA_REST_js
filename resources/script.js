//settings
var url = "http://127.0.0.1:8080";
var userID;
var sessionID;
var baseEventObject;
var eventList = [];
//helper functions
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

function sendEventList() {
  var el = {};
  el["eventList"]=eventList
  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify(el),
    success: function() {
      console.log('success');
      eventList = [];
    },
    error: function() {
      console.log('error', arguments)
    }
  });
};


function startDDNA() {
  var sendNewPlayerFlag = 0;
  var sendClientDeviceFlag = 0;
  var sendGameStartedFlag = 0;
  if (localStorage.getItem('userID') != null) {
    userID = localStorage.getItem('userID');
  } else {
    userID = generateUUID();
    localStorage.setItem('userID', userID);
    sendNewPlayerFlag = 1;
    //todo send newplayer event
  }
  if (sessionStorage.getItem('sessionID') != null) {
    sessionID = localStorage.getItem('sessionID');
  } else {
    sessionID = generateUUID();
    localStorage.setItem('sessionID', sessionID);
    sendGameStartedFlag = 1;
    sendClientDeviceFlag = 1;
    //todo send clientDevice and gameStarted event
  }
  console.log('UserID : ' + userID);
  console.log('sessionID :' + sessionID);
  jsonString = '{"userID":"' + userID + '",' +
    '"sessionID":"' + sessionID + '",' +
    '"eventParams":{' +
    '"platform":"WEB"}}';
  baseEventObject = JSON.parse(jsonString);
  var newPlayerEvent = $.extend(true, {}, baseEventObject);
  var clientDeviceEvent = $.extend(true, {}, baseEventObject);
  var gameStartedEvent = $.extend(true, {}, baseEventObject);
  if (sendNewPlayerFlag){
    console.log("sendNewplayer");
      newPlayerEvent["eventName"]='newPlayer';
      eventList.push(newPlayerEvent);
  };
  if (clientDeviceEvent){
    console.log("clientDeviceEvent");

      clientDeviceEvent["eventName"]='clientDevice';
      eventList.push(clientDeviceEvent);
  };
  if (gameStartedEvent){
    console.log("gameStartedEvent");

      gameStartedEvent["eventName"]='gameStarted';
      eventList.push(gameStartedEvent);
  };
  console.log(eventList);
  console.log(eventList);
  console.log(JSON.stringify(eventList));

  sendEventList();
};




$(document).ready(function() {
  startDDNA();
  //localStorage.setItem('userID', userID);
  //sessionStorage.setItem('sessionID', sessionID);

  $("#button1").click(function() {
    alert("Hello, world!");
  });

  $("#button2").click(function() {
    console.log(baseObject);
    console.log(JSON.parse(baseEventObject));
    sendEventList(baseObject);
  });

});
