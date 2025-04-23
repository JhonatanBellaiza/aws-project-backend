const { successResponse, errorResponse } = require('../../shared/utils');
const orderService = require('./order-service');
const notificationService = require('./notification-service');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    
    if (event.httpMethod === 'POST') {
      const { products, total } = JSON.parse(event.body);
      const order = await orderService.createOrder(userId, products, total);
      
      // Send to SQS for async processing
      await sqs.sendMessage({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: JSON.stringify(order)
      }).promise();
      
      // Send notification
      await notificationService.notifyOrderReceived(order);
      
      return successResponse(order);
    }
    else if (event.httpMethod === 'GET') {
      if (event.pathParameters?.orderId) {
        const order = await orderService.getOrder(event.pathParameters.orderId);
        return successResponse(order.Item);
      } else {
        const orders = await orderService.getUserOrders(userId);
        return successResponse(orders.Items);
      }
    }

    return errorResponse(new Error('Method not allowed'), 405);
  } catch (error) {
    return errorResponse(error);
  }
};