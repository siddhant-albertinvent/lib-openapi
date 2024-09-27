const axios = require('axios');

// Retry function to make GET request with retries
async function axiosGetWithRetry({url, params, headers, retries = 3, delay = 1000}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {
        params,
        headers // Pass headers along with the params
      });
      console.log('Response received:', response.data);
      return response.data; // Return the data if the request is successful
    } catch (error) {
      if (attempt < retries) {
        console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay)); // Delay before retry
      } else {
        console.error('All retry attempts failed.');
        throw error; // Throw error after all retries fail
      }
    }
  }
}

module.exports = { axiosGetWithRetry };