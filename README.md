# Node.js RESTful API, meant to act as the backend for this [single page application](https://github.com/alessandrov/ngrx-poc).

Based on Express.js, it supports OAuth 2 authentication via [oauth2orize](https://www.npmjs.com/package/oauth2orize).

A brief description of the model:

* Path: an entity with two properties, title and author, both required.
* Goal: an entity with two properties, title and author, both required.
* User: the application user
* Client: a client application
* Access Token: requested by the Client, its expiration can be configured through the config.json file
* Refresh Token: used to obtain a new Access Token without providing credentials a second time

The auth module presents also two useful features, i.e.

* username and password can be returned given a valid access token
* a new access token can be returned given a valid refresh token (this feature is used by the frontend to obtain a new token when the old one expires)

### Prerequisites

Make sure you have Node.js installed (at least 6.10.0) and a local instance of MongoDB up and running.

### Install the dependencies

Navigate to the project folder and run:
```
npm i
```

### Populate the database

Navigate to the project folder and run:
```
node populate-database.js
```

### Start the service

Navigate to the project folder and run:
```
node server.js
```


Mocha tests included.

Swagger infrastructure included.


### Author

[alessandrov](https://github.com/alessandrov)


## License

[GPL-3.0](https://github.com/alessandrov/ngrx-poc-nodejs-backend/master/LICENSE)
