function createReport(body, endpoint, method) {
  const url = `http://localhost:3000/api/v1/${endpoint}`;
  const token = window.localStorage.getItem('token');

  fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => response.json())
    .then((responseObj) => {
      console.log(responseObj);
      if (method !== 'GET') {
        window.location.href = './view-reports.html';
      }
    })
    .catch(error => console.log(error));
}


document.querySelector('.form-card').addEventListener('submit', (evt) => {
  evt.preventDefault();
  const comment = document.getElementById('comment').value;
  const reportType = document.getElementById('issue-type').value;
  const location = document.getElementById('location').value.split(',');
  const latitude = location[0].trim();
  const longitude = location[1].trim();

  const reportObj = {
    latitude, longitude, comment,
  };

  createReport(reportObj, reportType, 'POST');
});
