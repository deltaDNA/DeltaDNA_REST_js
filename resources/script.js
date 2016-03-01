// Settings
var url = 'http://127.0.0.1:8080'; //"http://collect4792jmprb.deltadna.net/collect/api/22079697190426055695055037414340";
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
  var trackingEvents = $.extend([], eventList);
  eventList = [];

  console.log('Sending events: ', trackingEvents);

  $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify({ eventList: trackingEvents}),
    success: function() {
      console.log('success');
    },
    error: function() {
      console.log('error', arguments)
    }
  });
}, 300);

function getDefaults () {
  return {
    userID: getUser(),
    sessionID: getSession(),
    eventParams: {
      platform: 'web'
    }
  };
}

function trackEvent (event) {
  event = $.extend(true, getDefaults(), event);
  eventList.push(event);

  console.log('Tracking event ' + event.eventName);
  console.log(event);
  sendEventList();
}

function getUser () {
  var userID = localStorage.getItem('userID');

  if (userID === null) {
    console.log('new user generated');
    userID = generateUUID();
    localStorage.setItem('userID', userID);
    trackEvent({
      eventName: 'newPlayer'
    });
  }

  return userID;
}

function getSession () {
  var sessionID = sessionStorage.getItem('sessionID');

  if (sessionID === null) {
    console.log('new session generated');
    sessionID = generateUUID();
    sessionStorage.setItem('sessionID', sessionID);

    // Send clientDevice and gameStarted event
    trackEvent({
      eventName: 'clientDevice'
    });
    trackEvent({
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
}

$(document).ready(function() {
  //localStorage.setItem('userID', userID);
  //sessionStorage.setItem('sessionID', sessionID);
  $('#StopSDK').click(function() {
    sessionStorage.clear();
    console.log('sessionStorage cleared');
  });

  $('#newUser').click(function() {
    localStorage.clear();
    console.log('localStorage cleared');
  });


  $('#StartSDK').click(function() {
    startDDNA();
  });

  $('#SendSimpleEvent').click(function() {
    var event = {
      eventName: 'simpleEvent',
      eventsParams: {
        action: 'open',
        option: 'menu'
      }
    };
    trackEvent(event);
  });
});
