export const fetchWithCredentials = async (url, options) => {
  const response = await fetch(url, {
    ...options,
    cors: "no-cors",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      `Network response was not ok, status code: ${response.status}`
    );
  }

  return response.json();
};
