// Setting the URL
var envKey = '22079697190426055695055037414340'
var collectURL = 'http://collect4792jmprb.deltadna.net/collect/api/'
//var collectURL = 'http://127.0.0.1:8080/';
var url = collectURL + envKey + '/bulk';
console.log('URL used: ' + url);
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

function getTimestamp() {
  //return a timestamp in the format 2016-03-01 20:26:50.148 and in UTC
  var d = new Date();
  return d.getUTCFullYear() +
    '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate() +
    ' ' + d.getUTCHours() + ':' + d.getUTCMinutes() +
    ':' + d.getUTCSeconds() + '.' + d.getUTCMilliseconds();
}

//set the var sendEventList to represent the debounce function
//the debounce underscore function makes the fnction only to be executed every 500 ms, this prevents bashing the send event button to be a problem.
var sendEventList = _.debounce(function() {
  if (eventList.length == 0) {
    console.log('No events to send');
    return;
  }
  //When there are events to send we copy the eventlist to the recordedevents parameter and clear the eventList
  var recordedEvents = $.extend([], eventList);
  eventList = [];

  console.log('Sending events: ', recordedEvents);
  //actually send the events
  $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify({
      eventList: recordedEvents
    }),
    success: function() {
      console.log('Events successfully sent');
    },
    error: function() {
      //there was an error sending the events, so we add the events back to the eventList (at the beginning).
      eventList = $.extend(recordedEvents, eventList )
      console.log('Error sending events, will retry on next sendEvents()', arguments)
    }
  });
}, 500)

//The defaults for the event
function getDefaults() {
  return {
    userID: getUser(),
    sessionID: getSession(),
    eventTimestamp: getTimestamp(),
    eventUUID: generateUUID(),
    eventParams: {
      platform: 'WEB'
    }
  };
}

//Record an event and place it in the list of events to send
function recordEvent(event) {
  //fetch the default event parameters and copy this to the event to record
  event = $.extend(true, getDefaults(), event);
  eventList.push(event);

  console.log('Recording event ' + event.eventName);
  //The following line is for debugging purposes, the console output can be input directly into the interactive event validator.
  console.log(JSON.stringify(event));
}

function getUser() {
  //use a local var that retrieves from the localStorage to not have the variable living in two places
  var userID = localStorage.getItem('userID');

  if (userID === null) {
    //Since the userID was null this must be the first time the game is started so we create a new userID:
    console.log('New user generated');
    userID = generateUUID();
    localStorage.setItem('userID', userID);
    //Record the newPlayer event since there was no playerId known yet
    recordEvent({
      eventName: 'newPlayer'
    });
  }
  return userID;
}

function getSession() {

  var sessionID = sessionStorage.getItem('sessionID');

  if (sessionID === null) {
    //if the sessionID was equal to null we need to create a new session
    console.log('New session generated');
    sessionID = generateUUID();
    sessionStorage.setItem('sessionID', sessionID);

    // Record clientDevice and gameStarted event since we start a new session
    recordEvent({
      eventName: 'gameStarted',
      eventParams: {
        clientVersion: 'v0.1'
      }
    });
    recordEvent({
      eventName: 'clientDevice',
      eventParams: {
        operatingSystemVersion: navigator.platform
      }
    });

  }

  return sessionID;
}

function startDDNA() {

  var userID = getUser();
  console.log('UserID: ' + userID);

  var sessionID = getSession();
  console.log('sessionID: ' + sessionID);
  sendEventList();
}

$(document).ready(function() {
  //Some jQuery to add listerners to the click function on the buttons.
  $('#StartDDNA').click(function() {
    startDDNA();
  });

  $('#StopSession').click(function() {
    sessionStorage.clear();
    console.log('sessionStorage cleared - sessionID deleted');
  });

  $('#newUser').click(function() {
    localStorage.clear();
    console.log('localStorage cleared - userID deleted');
  });

  $('#sendEvents').click(function() {
    sendEventList();
  });

  $('#RecordSimpleEvent').click(function() {
    var event = {
      eventName: 'options',
      eventParams: {
        action: 'open',
        option: 'menu'
      }
    };
    recordEvent(event);
  });

  $('#RecordComplexEvent').click(function() {
    var event = {
      eventName: 'transaction',
      eventParams: {
        action: "purchase",
        transactionName: "IAP - Large Treasure Chest",
        transactionType: "PURCHASE",
        productID: "4019",
        productsReceived: {
          virtualCurrencies: [{
            virtualCurrency: {
              virtualCurrencyName: "Gold",
              virtualCurrencyType: "PREMIUM",
              virtualCurrencyAmount: 100
            }
          }],
          items: [{
            item: {
              itemName: "Golden Battle Axe",
              itemType: "Weapon",
              itemAmount: 1
            }
          }, {
            item: {
              itemName: "Mighty Flaming Sword of the First Age",
              itemType: "Legendary Weapon",
              itemAmount: 1
            }
          }, {
            item: {
              itemName: "Jewel Encrusted Shield",
              itemType: "Armour",
              itemAmount: 1
            }
          }]
        },
        productsSpent: {
          realCurrency: {
            realCurrencyType: "USD",
            realCurrencyAmount: 499
          }
        }
      }
    };
    recordEvent(event);
  });

});
