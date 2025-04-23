const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = {
  async getItem(tableName, key) {
    const params = {
      TableName: tableName,
      Key: key
    };
    return dynamodb.get(params).promise();
  },

  async putItem(tableName, item) {
    const params = {
      TableName: tableName,
      Item: item
    };
    return dynamodb.put(params).promise();
  },

  async queryItems(tableName, query) {
    const params = {
      TableName: tableName,
      ...query
    };
    return dynamodb.query(params).promise();
  },

  async scanItems(tableName, scanParams = {}) {
    const params = {
      TableName: tableName,
      ...scanParams
    };
    return dynamodb.scan(params).promise();
  }
};