# DeltaDNA_REST_js
A javascript example of an implementation of the DeltaDNA REST API

## Configuration
collectURL: the URL used as collect endpoint
envKey: the environmentKey of the account the data is sent to.

##  Operation
This example uses the localStorage to store the userID, when a userID is not known in there it will create a new user and record the newPlayer event. For the session the sessionStorage is used. When reloading the page the session does not end, this makes a multi page client a possibility.

Events are stored in memory until they are sent to the

Make sure to call the sendEvents function before switching to a new page.
