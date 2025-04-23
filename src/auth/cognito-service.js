const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports = {
  async signUp(userPoolId, clientId, username, password, email) {
    try {
      await cognito.adminCreateUser({
        UserPoolId: userPoolId,
        Username: username,
        TemporaryPassword: password,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' }
        ]
      }).promise();

      await cognito.adminSetUserPassword({
        UserPoolId: userPoolId,
        Username: username,
        Password: password,
        Permanent: true
      }).promise();

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  async login(userPoolId, clientId, username, password) {
    try {
      const result = await cognito.adminInitiateAuth({
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password
        }
      }).promise();

      return {
        accessToken: result.AuthenticationResult.AccessToken,
        idToken: result.AuthenticationResult.IdToken,
        refreshToken: result.AuthenticationResult.RefreshToken
      };
    } catch (error) {
      throw error;
    }
  }
};