export async function apiCall(url, method, body = null) {
  const headers = { "Content-Type": "application/json" };
  const config = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };
  try {
    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
  }
}
