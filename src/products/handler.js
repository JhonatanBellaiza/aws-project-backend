const { successResponse, errorResponse } = require('./utils');
const productService = require('./product-service');
const searchService = require('./search-service');

exports.handler = async (event) => {
  console.log('Incoming event:', JSON.stringify(event, null, 2));
  console.log('Environment variables:', process.env);

  try {
    // Verify required environment variables exist
    if (!process.env.PRODUCTS_TABLE) {
      throw new Error('PRODUCTS_TABLE environment variable is not set');
    }

    if (event.httpMethod === 'GET') {
      if (event.queryStringParameters?.search) {
        console.log('Searching for:', event.queryStringParameters.search);
        try {
          const results = await searchService.searchProducts(event.queryStringParameters.search);
          return successResponse(results);
        } catch (searchError) {
          console.error('Search failed:', searchError);
          return errorResponse(new Error('Search service is currently unavailable. Please try again later.'), 503);
        }
      } 
      else if (event.queryStringParameters?.category) {
        console.log('Filtering by category:', event.queryStringParameters.category);
        const products = await productService.getProductsByCategory(event.queryStringParameters.category);
        return successResponse(products.Items);
      } 
      else {
        console.log('Fetching all products');
        const products = await productService.getAllProducts();
        return successResponse(products.Items);
      }
    }

    return errorResponse(new Error('Method not allowed'), 405);
  } catch (error) {
    console.error('Error:', error);
    
    // Handle specific errors
    if (error.message.includes('ES_ENDPOINT')) {
      return errorResponse(new Error('Search service configuration error'), 500);
    }
    if (error.message.includes('TableName')) {
      return errorResponse(new Error('Database configuration error'), 500);
    }
    if (error.code === 'ResourceNotFoundException') {
      return errorResponse(new Error('Database resource not found'), 500);
    }
    
    return errorResponse(error);
  }
};  