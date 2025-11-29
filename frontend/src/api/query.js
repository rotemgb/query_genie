export async function fetchQuery(question) {
  const API_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error fetching query");
  }

  return response.json();
}
