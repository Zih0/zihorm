const { queryUtil } = require('./query.js');

const ERROR_CODE = {
  ALREADY_EXIST: 1050,
};

module.exports = class DatabaseModel {
  #table;
  #columnDatas;
  constructor(pool, table, columnDatas) {
    this.pool = pool;
    this.#table = table;
    this.#columnDatas = columnDatas;

    (async () => await this.#createTable())();
  }

  async query(sql) {
    const conn = await this.pool.getConnection();
    const response = await conn.query(sql);
    conn.release();

    return response;
  }

  async #createTable() {
    const sql = queryUtil.createTable(this.#table, this.#columnDatas);
    try {
      await this.query(sql);

      console.log(`CREATE TABLE SUCCESS : ${sql}`);
    } catch (err) {
      if (err.errno === ERROR_CODE.ALREADY_EXIST) return;
      console.log(err);
    }
  }

  async create(data) {
    const sql = queryUtil.create(this.#table, data);
    const [response] = await this.query(sql);

    return response;
  }

  async findAll(data) {
    const sql = queryUtil.filter(this.#table, data);
    const [response] = await this.query(sql);

    return response;
  }

  async update(data, { where }) {
    const sql = queryUtil.update(this.#table, data, where);
    const [response] = await this.query(sql);

    return response;
  }

  async deleteOne({ where }) {
    const sql = queryUtil.delete(this.#table, where);
    const [response] = await this.query(sql);

    return response;
  }
};
