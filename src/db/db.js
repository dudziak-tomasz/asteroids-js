import mysql from 'mysql2/promise'
import { config } from '../config.js'

export const db = {
    pool: undefined,
    host: '',
    user: '',
    password: '',
    database: '',

    connect() {
        this.host = config.getItem('host')
        this.user = config.getItem('user')
        this.password = config.getItem('password')
        this.database = config.getItem('database')

        this.pool = mysql.createPool({
            host: this.host,
            user: this.user,
            password: this.password
        })
    },

    async initializeDB() {
        await this.pool.execute(`DROP DATABASE IF EXISTS ${this.database}`)
        await this.pool.execute(`CREATE DATABASE ${this.database}`)

        await this.pool.execute(`
            CREATE TABLE ${this.database}.users (
                id int NOT NULL AUTO_INCREMENT,
                username varchar(255) NOT NULL UNIQUE,
                password varchar(255) NOT NULL,
                email varchar(255),
                highscore int DEFAULT 0,
                PRIMARY KEY (id)
            )
        `)
        
        await this.pool.execute(`
            CREATE INDEX idx_highscore
                ON ${this.database}.users (highscore)
        `)
        
        await this.pool.execute(`
            CREATE TABLE ${this.database}.tokens (
                id int NOT NULL AUTO_INCREMENT,
                userid int NOT NULL,
                token varchar(255) NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (userid) REFERENCES users(id)
            )
        `)
        
        await this.pool.end()
    },

    async addUser( user = {}) {
        if (!user.highscore) user.highscore = 0
        if (!user.email) user.email = ''
        await this.pool.execute(`
            INSERT INTO ${this.database}.users (username, password, email, highscore)
            VALUES ('${user.username}', '${user.password}', '${user.email}', '${user.highscore}')
        `)
    },

    async getLeaderboard() {

        const [rows] = await this.pool.execute(`
            SELECT username, highscore 
            FROM ${this.database}.users
            ORDER BY highscore DESC
            LIMIT 10
        `)

        return rows
    }
}