const AWS = require('aws-sdk');
const sns = new AWS.SNS();

module.exports = {
  async notifyOrderReceived(order) {
    const params = {
      TopicArn: process.env.TOPIC_ARN,
      Message: JSON.stringify({
        default: `New order received: ${order.orderId}`,
        email: `New Order #${order.orderId}\nTotal: $${order.total}`,
        sms: `New order #${order.orderId} for $${order.total}`
      }),
      MessageStructure: 'json'
    };

    return sns.publish(params).promise();
  }
};