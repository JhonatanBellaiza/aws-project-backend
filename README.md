# Backend for E-Commerce Project

## Overview

This project implements the backend of an e-commerce system using **serverless architecture** on AWS. It includes user authentication, product browsing, shopping cart management, and order placement.

## Lambda Functions

Key AWS Lambda functions:

- **Product Search**: Handles product search with filters.
- **Order Placement**: Processes the order and stores it in DynamoDB.
- **User Authentication**: Manages user registration/login via Amazon Cognito.

## AWS Services

- **AWS Lambda**: Event-driven functions for core business logic.
- **Amazon API Gateway**: Exposes REST APIs for the frontend to interact with Lambda functions.
- **Amazon Cognito**: Manages user authentication and authorization.
- **Amazon DynamoDB**: Stores product data, shopping carts, and orders.
- **AWS SNS**: To send notifications after purchase.
- **Amazon S3 & CloudFront**: Hosts and distributes the frontend.
- **AWS CodePipeline**: Automates CI/CD for frontend and backend.
- **AWS CloudFormation**: Defines infrastructure as code for easy deployment.

## Deployment

1. **Frontend**: Deploys to **S3** and distributes via **CloudFront**.
2. **Backend**: Lambda functions, API Gateway, and DynamoDB are deployed using AWS CodePipeline.
3. **CloudFormation**: Infrastructure resources (Lambda, API Gateway, DynamoDB) are defined in the template for automated deployment.
4. **CI/CD**: AWS CodePipeline automates build and deployment for both frontend and backend.



## License

MIT License - see the [LICENSE](LICENSE) file for details.
