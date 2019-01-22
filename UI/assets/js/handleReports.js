function handleReports(body = {}, endpoint, method, token) {
  const url = `http://localhost:3000/api/v1/${endpoint}`;
  fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => response.json())
    .then(responseObj => {
      console.log(responseObj);
      window.location.href = './view-reports.html';
    })
    .catch(error => console.log(error));
}
