# zihorm

zihorm is a tiny promise-based Node.js ORM tool for MySQL.
This is an extremely experimental project, so expect things to break!

<a href="https://github.com/Zih0/zihorm/blob/main/LICENSE">
    <img alt="NPM" src="https://img.shields.io/npm/l/zihorm">
  </a>
  <a href="https://github.com/Zih0/zihorm">
    <img alt="npm" src="https://img.shields.io/npm/v/zihorm">
</a>

## Installation

```shell
npm install zihorm
```

then

```js
const { Zihorm } = require('zihorm');
```

## Usage

### Connect Database

```js
const zihorm = new Zihorm('host', 'database', 'user', 'password');
```

### Define Models

```js
const { DataTypes } = require('zihorm');

const User = zihorm.define('user', {
  id: {
    field: 'id',
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    field: 'name',
    type: DataTypes.STRING(10),
  },
  phone: {
    field: 'phone',
    type: DataTypes.STRING(13),
  },
});
```

### Persist And Query

```js
const result = await User.create({
  name: 'jiho',
  phone: '01012345678',
});

const createUser = async () => {
  await User.create({
    name: 'jiho',
  });
};

const getUser = async () => {
  const users = await User.findAll({
    where: {
      name: 'jiho',
    },
    order: ['id', 'DESC'],
  });
};

const updateUser = async () => {
  await User.update(
    { name: 'jiho2' },
    {
      where: {
        id: 2,
      },
    },
  );
};

const deleteUser = async () => {
  const response = await User.deleteOne({
    where: {
      id: 4,
    },
  });
};
```

### Raw Query (Recommend)

```js
const [data, field] = await zihorm.query('select * from user');
```

## DataTypes

```js
DataTypes.STRING(Number);
DataTypes.INTEGER;
DataTypes.DATE;
DataTypes.BOOLEAN;
```

## options

### define Model option

|              option | type        | required | description                            |
| ------------------: | :---------- | :------- | :------------------------------------- |
|         **`field`** | `string`    | `true`   | field name (column name)               |
|          **`type`** | `DataTypes` | `true`   | field's type                           |
|        **`unique`** | `boolean`   | `false`  | (Optional)field unique option          |
|       **`notNull`** | `boolean`   | `false`  | (Optional) field not null option       |
| **`autoIncrement`** | `boolean`   | `false`  | (Optional) field auto_increment option |
|    **`primaryKey`** | `boolean`   | `false`  | (Optional) field primary key option    |

### find option

|           option | type                                          | default           | description                       |
| ---------------: | :-------------------------------------------- | :---------------- | :-------------------------------- |
| **`attributes`** | `array`                                       | `*`               | select fields' name (column name) |
|      **`where`** | `Object`                                      | `null`            | filter record option              |
|      **`order`** | `[string] or [string, 'ASC' or 'DESC]`        | `[string , 'ASC]` | order records                     |
|    **`include`** | `{pk: string, joinPk: string, model: string}` | `null`            | inner join                        |
