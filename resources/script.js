//settings
var url = "http://127.0.0.1:8080"; //"http://collect4792jmprb.deltadna.net/collect/api/22079697190426055695055037414340";
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
  var el = {
    "eventList": eventList
  };
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
    console.log('existing userId found');
    userID = localStorage.getItem('userID');
  } else {
    console.log('new user generated');
    userID = generateUUID();
    localStorage.setItem('userID', userID);
    sendNewPlayerFlag = 1;
    //todo send newplayer event
  }
  console.log('UserID : ' + userID);
  if (sessionStorage.getItem('sessionID') != null) {
    console.log('existing sessionID found');
    sessionID = sessionStorage.getItem('sessionID');
  } else {
    console.log('new session generated');
    sessionID = generateUUID();
    sessionStorage.setItem('sessionID', sessionID);
    sendGameStartedFlag = 1;
    sendClientDeviceFlag = 1;
    //todo send clientDevice and gameStarted event
  }
  console.log('sessionID :' + sessionID);
  jsonString = '{"userID":"' + userID + '",' +
    '"sessionID":"' + sessionID + '",' +
    '"eventParams":{' +
    '"platform":"WEB"}}';
  baseEventObject = JSON.parse(jsonString);
  if (sendNewPlayerFlag) {
    var newPlayerEvent = $.extend(true, {}, baseEventObject);
    console.log("sendNewplayer");
    newPlayerEvent["eventName"] = 'newPlayer';
    eventList.push(newPlayerEvent);
  };

  if (sendClientDeviceFlag) {
    var clientDeviceEvent = $.extend(true, {
      "eventName": "clientDevice"
    }, baseEventObject);
    console.log("clientDeviceEvent");
    eventList.push(clientDeviceEvent);
  };
  if (sendGameStartedFlag) {
    var gameStartedEvent = $.extend(true, {}, baseEventObject);
    console.log("gameStartedEvent");
    gameStartedEvent["eventName"] = 'gameStarted';
    eventList.push(gameStartedEvent);
  };
  console.log(eventList);
  console.log(JSON.stringify(eventList));

  sendEventList();
};

$(document).ready(function() {
  //localStorage.setItem('userID', userID);
  //sessionStorage.setItem('sessionID', sessionID);
  $("#StopSDK").click(function() {
    sessionStorage.clear();
  });

  $("#newUser").click(function() {
    localStorage.clear();
  });


  $("#StartSDK").click(function() {
    startDDNA();
  });

  $("#SendSimpleEvent").click(function() {
    var Event = $.extend(true, {}, baseEventObject);
    Event['eventName'] = 'options';
    Event['eventParams']['action'] = 'open';
    Event['eventParams']['option'] = 'menu';
    eventList.push(Event);
    sendEventList();
  });

});
