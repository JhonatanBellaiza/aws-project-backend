module.exports = {
    successResponse(data) {
      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    },
  
    errorResponse(error, statusCode = 500) {
      return {
        statusCode,
        body: JSON.stringify({ error: error.message }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
  };