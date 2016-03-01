// Setting the URL
var envKey = '22079697190426055695055037414340'
var collectURL = 'http://collect4792jmprb.deltadna.net/collect/api/'
var url = collectURL + envKey + '/bulk';
//var url = 'http://127.0.0.1:8080';
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

var sendEventList = _.debounce(function() {
  if (eventList.length == 0) {
    console.log('No events to send');
    return;
  }
  var recordedEvents = $.extend([], eventList);
  eventList = [];

  console.log('Sending events: ', recordedEvents);

  $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify({
      eventList: recordedEvents
    }),
    success: function() {
      console.log('success');
    },
    error: function() {
      //there was an error sending the events, so we add the events back to the eventList.
      eventList = $.extend(eventList, recordedEvents)
      console.log('error', arguments)
    }
  });
}, 500);

function getDefaults() {
  return {
    userID: getUser(),
    sessionID: getSession(),
    eventParams: {
      platform: 'web'
    }
  };
}

function recordEvent(event) {
  event = $.extend(true, getDefaults(), event);
  eventList.push(event);

  console.log('Recording event ' + event.eventName);
}

function getUser() {
  //use a local var that retrieves from the localStorage to not have the variable living in two places
  var userID = localStorage.getItem('userID');

  if (userID === null) {
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
    console.log('New session generated');
    sessionID = generateUUID();
    sessionStorage.setItem('sessionID', sessionID);

    // Record clientDevice and gameStarted event since we start a new session
    recordEvent({
      eventName: 'clientDevice'
    });
    recordEvent({
      eventName: 'gameStarted'
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
      eventName: 'option',
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
          transactionName: "IAP - Large Treasure Chest",
          transactionID: "47891208312996456524019-178.149.115.237:51787",
          transactorID: "62.212.91.84:15116",
          productID: "4019",
          transactionServer: "APPLE",
          transactionReceipt: "ewok9Ja81............991KS==",
          transactionType: "PURCHASE",
          productsReceived: {
              virtualCurrencies: [
                  {
                      virtualCurrency: {
                          virtualCurrencyName: "Gold",
                          virtualCurrencyType: "PREMIUM",
                          virtualCurrencyAmount: 100
                      }
                  }
              ],
              items: [
                  {
                      item: {
                          itemName: "Golden Battle Axe",
                          itemType: "Weapon",
                          itemAmount: 1
                      }
                  },
                  {
                      item: {
                          itemName: "Mighty Flaming Sword of the First Age",
                          itemType: "Legendary Weapon",
                          itemAmount: 1
                      }
                  },
                  {
                      item: {
                          itemName: "Jewel Encrusted Shield",
                          itemType: "Armour",
                          itemAmount: 1
                      }
                  }
              ]
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
