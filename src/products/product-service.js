const db = require('./db-client');

module.exports = {
  async getProduct(productId) {
    if (!process.env.PRODUCTS_TABLE) {
      throw new Error("PRODUCTS_TABLE environment variable is not set");
    }
    return db.getItem(process.env.PRODUCTS_TABLE, { productId });
  },

  async getProductsByCategory(category) {
    if (!process.env.PRODUCTS_TABLE) {
      throw new Error("PRODUCTS_TABLE environment variable is not set");
    }
    return db.queryItems(process.env.PRODUCTS_TABLE, {
      IndexName: 'CategoryIndex',
      KeyConditionExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    });
  },

  async getAllProducts() {
    if (!process.env.PRODUCTS_TABLE) {
      throw new Error("PRODUCTS_TABLE environment variable is not set");
    }
    return db.scanItems(process.env.PRODUCTS_TABLE);
  }
};