import mysql from 'mysql2/promise'
import { config } from '../config.js'

export const db = {
    pool: undefined,
    host: '',
    user: '',
    password: '',
    database: '',
    dbDropCreate: true,

    connect() {
        this.host = config.getItem('host')
        this.user = config.getItem('user')
        this.password = config.getItem('password')
        this.database = config.getItem('database')
        this.dbDropCreate = config.getItem('dbDropCreate')

        this.pool = mysql.createPool({
            host: this.host,
            user: this.user,
            password: this.password
        })
    },

    disconnect() {
        this.pool.end()
    },

    async initializeDB() {

        if (this.dbDropCreate) {
            await this.pool.execute(`DROP DATABASE IF EXISTS ${this.database}`)
            await this.pool.execute(`CREATE DATABASE ${this.database}`)    
        } else {
            await this.pool.execute(`DROP TABLE IF EXISTS ${this.database}.tokens`)
            await this.pool.execute(`DROP TABLE IF EXISTS ${this.database}.users`)
        }

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
        
    },

    async addUser( user = {}) {
        const [rows] = await this.pool.execute(`
            INSERT INTO ${this.database}.users (username, password, email, highscore)
            VALUES ('${user.username}', '${user.password}', '${user.email}', '${user.highscore}')
        `)

        return rows.insertId
    },

    async findUserByUsername(username) {

        const [rows] = await this.pool.execute(`
            SELECT * 
            FROM ${this.database}.users
            WHERE username = '${username}'
        `)

        if (rows.length > 0) return rows[0]
        else return undefined
    },

    async findUserById(id) {

        const [rows] = await this.pool.execute(`
            SELECT * 
            FROM ${this.database}.users
            WHERE id = '${id}'
        `)

        if (rows.length > 0) return rows[0]
        else return undefined
    },

    async updateUser( user = {}) {
        const [rows] = await this.pool.execute(`
            UPDATE ${this.database}.users 
            SET username = '${user.username}', password = '${user.password}', email = '${user.email}', highscore = '${user.highscore}'
            WHERE id = ${user.id}
        `)

        return rows
    },

    async deleteUserById(id) {
        await this.pool.execute(`
            DELETE
            FROM ${this.database}.users
            WHERE id = '${id}'
        `)
    },

    async addToken(userId, token) {
        await this.pool.execute(`
            INSERT INTO ${this.database}.tokens (userid, token)
            VALUES ('${userId}', '${token}')
        `)
    },

    async findToken(userId, token) {
        const [rows] = await this.pool.execute(`
            SELECT * 
            FROM ${this.database}.tokens
            WHERE userid = '${userId}' AND token = '${token}'
        `)

        if (rows.length > 0) return rows[0]
        else return undefined
    },

    async deleteTokenById(id) {
        await this.pool.execute(`
            DELETE
            FROM ${this.database}.tokens
            WHERE id = '${id}'
        `)
    },

    async deleteTokensByUserId(userId) {
        await this.pool.execute(`
            DELETE
            FROM ${this.database}.tokens
            WHERE userid = '${userId}'
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