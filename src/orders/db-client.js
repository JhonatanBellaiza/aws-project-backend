const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = {
  async getItem(tableName, key) {
    if (!tableName) throw new Error("TableName is required");
    if (!key) throw new Error("Key is required");
    
    const params = {
      TableName: tableName,
      Key: key
    };
    return dynamodb.get(params).promise();
  },

  // Similar checks for other methods
  async queryItems(tableName, query) {
    if (!tableName) throw new Error("TableName is required");
    
    const params = {
      TableName: tableName,
      ...query
    };
    return dynamodb.query(params).promise();
  },

  async scanItems(tableName, scanParams = {}) {
    if (!tableName) throw new Error("TableName is required");
    
    const params = {
      TableName: tableName,
      ...scanParams
    };
    return dynamodb.scan(params).promise();
  }
};