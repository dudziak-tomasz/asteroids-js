# DOCUMENTATION OF config/config.json FILE

    {
        "development": {
            "host": "localhost",
            "user": "root",
            "password": "",
            "database": "asteroids",
            "dbDropCreate": true,
            "tokenKey": "secret_key",
            "https": false,
            "publicDirectory": true,
            "httpPort": 3000,
            "httpsPort": 3443,
            "emailSender": "",
            "emailHost": "",
            "emailPort": 465,
            "emailSSL": true,
            "emailUser": "",
            "emailPassword": ""
        },
        "production": {
            "host": "",
            "user": "",
            "password": "",
            "database": "",
            "dbDropCreate": false,
            "tokenKey": "secret_key",
            "https": true,
            "publicDirectory": true,
            "httpPort": 80,
            "httpsPort": 443,
            "emailSender": "",
            "emailHost": "",
            "emailPort": 465,
            "emailSSL": true,
            "emailUser": "",
            "emailPassword": ""
        }
    }

---

## DEVELOPMENT / PRODUCTION

Project startup scripts can be run with or without --dev parameter. If they are started with the --dev parameter, data from the "development" section will be used. If without --dev parameter, then from the "production".

---

## DATABASE CONNECTION

"host" - MySQL database host

"user" - username for database connection

"password" - password of user

"database" - database name

---

## DATABASE INITIALIZATION

"dbDropCreate" - if set to "true", the init script will first try to delete the database and create an empty one and then create the tables; if set to false, the init script will only delete the tables and create empty ones

---

## SECURITY TOKENS

"tokenKey" - a string for signing security tokens; a complex string should be set. Tokens are used for user authorization.

"https" - if set to true, requests to the server will require https

---

## PUBLIC DIRECTORY

"publicDirectory" - if set to true, express serve static files from asteroids-js/public as "/". You can disable the public directory when the front-end is running on another server. Then change the request path in public/js/api.js.

## EXPRESS PORTS

"httpPort", "httpsPort" - ports on which express provides API endpoints

## SENDING EMAILS

The application sends an e-mail when the user loses access to the account and tries to change the password using his e-mail address.

"emailSender" - email address from which the email will be sent

"emailHost" - SMTP server address

"emailPort" - SMTP server port

"emailSSL" - set to true if the connection uses SSL

"emailUser" - SMTP server username

"emailPassword" - SMTP server password