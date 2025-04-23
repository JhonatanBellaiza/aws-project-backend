const AWS = require('aws-sdk');
const crypto = require('crypto');
const cognito = new AWS.CognitoIdentityServiceProvider();

function calculateSecretHash(username, clientId, clientSecret) {
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

module.exports = {
  async signUp(userPoolId, clientId, username, password, email, clientSecret) {
    try {
      // adminCreateUser does NOT need SecretHash
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

      // adminSetUserPassword does NOT need SecretHash
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

  async login(userPoolId, clientId, username, password, clientSecret) {
    try {
      const authParams = {
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password
        }
      };

      // Only adminInitiateAuth (login) needs SECRET_HASH if clientSecret exists
      if (clientSecret) {
        authParams.AuthParameters.SECRET_HASH = calculateSecretHash(username, clientId, clientSecret);
      }

      const result = await cognito.adminInitiateAuth(authParams).promise();

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