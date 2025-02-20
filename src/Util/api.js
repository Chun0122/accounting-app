export const fetchTransactions = (token) =>
  fetch("/api/Transactions/GetTransactions", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok)
      throw new Error(`API request failed with status ${res.status}`);
    return res.json();
  });

export const fetchOptions = (endpoint, token) =>
  fetch(`/api/DropdownOptions/${endpoint}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  });
