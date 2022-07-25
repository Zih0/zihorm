const mysql = require('mysql2/promise');
const DatabaseModel = require('./model.js');

module.exports = class Zihorm {
  #host;
  #database;
  #username;
  #password;
  pool;
  constructor(host, database, username, password) {
    this.#host = host;
    this.#database = database;
    this.#username = username;
    this.#password = password;

    this.createPool();
  }

  createPool() {
    this.pool = mysql.createPool({
      host: this.#host,
      user: this.#username,
      password: this.#password,
      database: this.#database,
      dateStrings: true,
    });
  }

  define(tableName, columnDatas) {
    return new DatabaseModel(this.pool, tableName, columnDatas);
  }

  async query(sql) {
    const conn = await this.pool.getConnection();
    const response = await conn.query(sql);
    conn.release();

    return response;
  }
};
