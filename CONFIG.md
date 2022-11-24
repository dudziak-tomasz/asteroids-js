# DOCUMENTATION OF config/config.json FILE

    {
        "development": {
            "host": "localhost",
            "user": "root",
            "password": "",
            "database": "asteroids",
            "dbDropCreate": true,
            "tokenKey": "secret_key",
            "https": false
        },
        "production": {
            "host": "",
            "user": "",
            "password": "",
            "database": "",
            "dbDropCreate": false,
            "tokenKey": "secret_key",
            "https": true
        }
    }

---

## DEVELOPMENT / PRODUCTION

Project startup scripts can be run with or without --dev parameter. If they are started with the --dev parameter, data from the "development" section will be used. If without a parameter, then from the "production".

---

## DATABASE CONNECTION

"host" - MySQL database host

"user" - username for database connection

"password" - password of user "user"

"database" - database name

---

## DATABASE INITIALIZATION

"dbDropCreate" - if set to "true", the init script will first try to delete the database and create an empty one and then create the tables; if set to false, the init script will only delete the tables and create empty ones

---

## SECURITY TOKENS

"tokenKey" - a string for signing security tokens; a complex string should be set. Tokens are used for user authorization.

"https" - if set to true then server queries will require https