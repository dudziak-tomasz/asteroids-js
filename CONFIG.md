# DOCUMENTATION OF config/config.json FILE

    {
        "development": {
            "host": "localhost",
            "user": "root",
            "password": "",
            "database": "asteroids",
            "dbDropCreate": true,
            "tokenKey": "secret_key",
            "publicDirectory": true,
            "httpPort": 3000,
            "httpsPort": 3443,
            "sslKey": "config/asteroids.key",
            "sslCert": "config/asteroids.crt",
            "corsOrigin": "*",
            "emailSender": "",
            "emailHost": "",
            "emailPort": 465,
            "emailSSL": true,
            "emailUser": "",
            "emailPassword": ""
        },
        "test": {
            "host": "localhost",
            "user": "root",
            "password": "",
            "database": "asteroids_test",
            "dbDropCreate": true,
            "tokenKey": "secret_key",
            "publicDirectory": true,
            "httpPort": 3000,
            "httpsPort": 3443,
            "sslKey": "config/asteroids.key",
            "sslCert": "config/asteroids.crt",
            "corsOrigin": "*",
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
            "publicDirectory": true,
            "httpPort": false,
            "httpsPort": 443,
            "sslKey": "config/asteroids.key",
            "sslCert": "config/asteroids.crt",
            "corsOrigin": ["http://asteroids.doitjs.eu","https://asteroids.doitjs.eu"],
            "emailSender": "",
            "emailHost": "",
            "emailPort": 465,
            "emailSSL": true,
            "emailUser": "",
            "emailPassword": ""
        }
    }

---

## DEVELOPMENT / TEST / PRODUCTION

Project startup scripts can be run with --dev, --test, or no parameters. If they are run with the --dev parameter, the data from the "development" section will be used, if with the --test parameter, the data from the "test" section will be used. If without a parameter, data from the "production" section will be used.

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

---

## PUBLIC DIRECTORY

"publicDirectory" - if set to true, express serve static files from asteroids-js/public as "/". You can disable the public directory when the front-end is running on another server. Then change the request path in public/js/api.js.

---

## EXPRESS PORTS

"httpPort", "httpsPort" - ports on which express provides API endpoints

---

## SSL CERTIFICATE

If "httpsPort" is enabled, copy the SSL certificate and private key files to the config directory and set the paths in the following parameters:

"sslKey" - SSL private key

"sslCert" - SSL certifikate

---

## CORS

"corsOrigin" - list of clients that have access to endpoints

---

## SENDING EMAILS

The application sends an e-mail when the user loses access to the account and tries to change the password using his e-mail address.

"emailSender" - email address from which the email will be sent

"emailHost" - SMTP server address

"emailPort" - SMTP server port

"emailSSL" - set to true if the connection uses SSL

"emailUser" - SMTP server username

"emailPassword" - SMTP server password