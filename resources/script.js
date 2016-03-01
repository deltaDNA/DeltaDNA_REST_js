// Setting the URL
var envKey = '22079697190426055695055037414340'
var collectURL = 'http://collect4792jmprb.deltadna.net/collect/api/'
var url = 'http://127.0.0.1:8080'+''; collectURL+envKey+'/bulk'
var eventList = [];

// Helper functions
function generateUUID() {
  var d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

var sendEventList = _.debounce (function() {
  if (eventList.length ==0){
    console.log('No events to send');
    return;
  }
  var recordedEvents = $.extend([], eventList);
  eventList = [];

  console.log('Sending events: ', recordedEvents);

  $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify({ eventList: recordedEvents}),
    success: function() {
      console.log('success');
    },
    error: function() {
      console.log('error', arguments)
    }
  });
}, 500);

function getDefaults () {
  return {
    userID: getUser(),
    sessionID: getSession(),
    eventParams: {
      platform: 'web'
    }
  };
}

function recordEvent (event) {
  event = $.extend(true, getDefaults(), event);
  eventList.push(event);

  console.log('Recording event ' + event.eventName);
  console.log(event);
}

function getUser () {
  //use a local var that retrieves from the localStorage to not have the variable living in two places
  var userID = localStorage.getItem('userID');

  if (userID === null) {
    console.log('New user generated');
    userID = generateUUID();
    localStorage.setItem('userID', userID);
    recordEvent({
      eventName: 'newPlayer'
    });
  }
  return userID;
}

function getSession () {
  var sessionID = sessionStorage.getItem('sessionID');

  if (sessionID === null) {
    console.log('New session generated');
    sessionID = generateUUID();
    sessionStorage.setItem('sessionID', sessionID);

    // Send clientDevice and gameStarted event since we start a new session
    recordEvent({
      eventName: 'clientDevice'
    });
    recordEvent({
      eventName: 'gameStarted'
    });
  }

  return sessionID;
}

function startDDNA () {

  var userID = getUser();
  console.log('UserID: ' + userID);

  var sessionID = getSession();
  console.log('sessionID: ' + sessionID);
  sendEventList();
}

$(document).ready(function() {

  $('#StartDDNA').click(function() {
    startDDNA();
  });

  $('#StopSDK').click(function() {
    sessionStorage.clear();
    console.log('sessionStorage cleared - sessionID deleted');
  });

  $('#newUser').click(function() {
    localStorage.clear();
    console.log('localStorage cleared - userID deleted');
  });



  $('#SendSimpleEvent').click(function() {
    var event = {
      eventName: 'simpleEvent',
      eventParams: {
        action: 'open',
        option: 'menu'
      }
    };
    recordEvent(event);
  });
});
