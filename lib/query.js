const DataTypes = {
  STRING: (number) => `VARCHAR(${number})`,
  INTEGER: 'INT',
  DATE: 'DATE',
  BOOLEAN: 'TINYINT(1)',
};

const create = (tableName, data) => {
  const keys = Object.keys(data).join();
  const values = Object.values(data)
    .map((value) => (typeof value === 'string' ? `'${value}'` : value))
    .join(',');
  return `INSERT INTO ${tableName} (${keys}) VALUES (${values})`;
};

const filter = (tableName, options) => {
  let query = '';
  let conditions = '';

  if (options) {
    const { attributes, where, order, include, groupBy } = options;

    if (where) {
      const conditionKeys = Object.keys(where);
      const conditionValues = Object.values(where).map((value) => (typeof value === 'string' ? `'${value}'` : value));

      conditionKeys.forEach((key, index) => {
        conditions += `${key} = ${conditionValues[index]}${index === conditionKeys.length - 1 ? '' : ' AND '}`;
      });
    }

    if (include) {
      const { pk, joinPk, model } = include;
      query = innerJoin(tableName, pk, model, joinPk, attributes);
    } else {
      query = `SELECT ${attributes ? attributes.join() : '*'} FROM ${tableName}`;
    }

    if (conditions) query += ` WHERE ${conditions}`;

    if (order) query += ` ORDER BY ${order[0]} ${order[1] ?? ''}`;

    if (groupBy) {
      query += ` GROUP BY ${groupBy}`;
    }
  } else {
    query = `SELECT * FROM ${tableName}`;
  }

  return query;
};

const update = (tableName, data, where) => {
  let conditions = '';
  let updater = '';

  if (where) {
    const conditionKeys = Object.keys(where);
    const conditionValues = Object.values(where).map((value) => (typeof value === 'string' ? `'${value}'` : value));

    conditionKeys.forEach((key, index) => {
      conditions += `${key} = ${conditionValues[index]}${index === conditionKeys.length - 1 ? '' : ' AND '}`;
    });
  }

  if (data) {
    Object.entries(data).forEach(
      ([key, value]) => (updater += `${key} = ${typeof value === 'string' ? `'${value}'` : value}`),
    );
  }

  let query = `UPDATE ${tableName} SET ${updater} `;
  if (conditions) query += ` WHERE ${conditions}`;
  return query;
};

const deleteOne = (tableName, where) => {
  let conditions = '';
  Object.entries(where).forEach(([key, value]) => (conditions += `${key} = ${value}`));

  const query = `DELETE FROM ${tableName} WHERE ${conditions}`;

  return query;
};

const innerJoin = (tableName, pk, joinTableName, joinPk, attributes = []) => {
  const selection = attributes.length ? attributes.map((s) => `s.${s}`).join() : '*';

  return `SELECT ${selection}
      FROM ${tableName}
      INNER JOIN ${joinTableName}
      ON ${tableName}.${pk}=${joinTableName}.${joinPk}
      `;
};

const createTable = (tableName, columnDatas) => {
  if (!columnDatas) throw Error('데이터가 없어서 테이블 못만들어요..');

  const columnList = Object.values(columnDatas).map((data) => {
    if (!data.field) throw Error('필드명이 꼭 있어야해요..');
    if (!data.type) throw Error('타입이 꼭 있어야해요..');

    const isUnique = data.unique ?? false;
    const isNotNull = data.notNull ?? true;
    const isAutoIncrement = data.autoIncrement ?? false;
    const isPrimaryKey = data.primaryKey ?? false;

    return `${data.field} ${data.type} ${isUnique ? 'UNIQUE' : ''} ${isNotNull ? 'NOT NULL' : ''} ${
      isAutoIncrement ? 'AUTO_INCREMENT' : ''
    } ${isPrimaryKey ? 'PRIMARY KEY' : ''}`;
  });
  const columns = columnList.join();

  const query = `CREATE TABLE ${tableName}(${columns});`;

  return query;
};

const queryUtil = {
  create,
  filter,
  update,
  deleteOne,
  innerJoin,
  createTable,
};

exports.DataTypes = DataTypes;
exports.queryUtil = queryUtil;
