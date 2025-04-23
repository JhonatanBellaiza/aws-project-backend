const { successResponse, errorResponse } = require('./utils');
const authService = require('./cognito-service');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { action } = body;
    
    if (action === 'signup') {
      const { username, password, email } = body;
      await authService.signUp(
        process.env.USER_POOL_ID,
        process.env.USER_POOL_CLIENT_ID,
        username,
        password,
        email,
        process.env.USER_POOL_CLIENT_SECRET // Add client secret
      );
      return successResponse({ message: 'User created successfully' });
    } 
    else if (action === 'login') {
      const { username, password } = body;
      const tokens = await authService.login(
        process.env.USER_POOL_ID,
        process.env.USER_POOL_CLIENT_ID,
        username,
        password,
        process.env.USER_POOL_CLIENT_SECRET // Add client secret
      );
      return successResponse(tokens);
    }
    
    return errorResponse(new Error('Invalid action'), 400);
  } catch (error) {
    return errorResponse(error);
  }
};