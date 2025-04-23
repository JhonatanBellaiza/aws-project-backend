const db = require('../../shared/db-client');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async createOrder(userId, products, total) {
    const order = {
      orderId: `ORD-${uuidv4()}`,
      userId,
      orderDate: new Date().toISOString(),
      products,
      total,
      status: 'pending'
    };

    await db.putItem(process.env.ORDERS_TABLE, order);
    return order;
  },

  async getOrder(orderId) {
    return db.getItem(process.env.ORDERS_TABLE, { orderId });
  },

  async getUserOrders(userId) {
    return db.queryItems(process.env.ORDERS_TABLE, {
      IndexName: 'UserIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    });
  }
};