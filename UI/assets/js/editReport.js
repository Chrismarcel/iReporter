
function updateReport(endpoint, type, id, reportObj) {
  const token = window.localStorage.getItem('token');

  return fetch(`http://localhost:3000/api/v1/${endpoint}/${id}/${type}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reportObj),
  })
    .then(response => response.json())
    .then(responseObj => responseObj)
    .catch(error => console.log(error));
}

function parseUrl(queryString) {
  const matches = queryString.substr(1).match(/=(\w+)-?(\w+)?/gm);
  return matches.map(match => match.substr(1));
}

document.querySelector('.form-card').addEventListener('submit', (evt) => {
  evt.preventDefault();
  const comment = document.getElementById('comment').value;
  const location = document.getElementById('location').value.split(',');
  const latitude = location[0].trim();
  const longitude = location[1].trim();
  const commentObj = { comment };
  const locationObj = { latitude, longitude };
  const endpoint = parseUrl(window.location.search);

  Promise.all(
    [updateReport(endpoint[0], 'location', endpoint[1], locationObj),
      updateReport(endpoint[0], 'comment', endpoint[1], commentObj)],
  ).then((response) => {
    const locationResponse = response[0];
    const commentResponse = response[1];
    if (locationResponse.status === 200 && commentResponse.status === 200) {
      window.location.href = './dashboard.html';
    }
  });
});
