async function apiRequest(url, method, body = null) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
  
    const requestOptions = {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : null,
    };
  
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error making API request:', error);
      throw error;
    }
  }
  
  export default apiRequest;
  