function createReport(body, endpoint) {
  const url = `https://ireporter-api.herokuapp.com/api/v1/${endpoint}`;
  const token = window.localStorage.getItem('token');

  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => response.json())
    .then((responseObj) => {
      if (responseObj.status === 200) {
        window.location.href = './view-reports.html';
      }
    })
    .catch(error => console.log(error));
}

function autoCompleteAddress() {
  const locationField = document.getElementById('location');
  const autoComplete = new google.maps.places.Autocomplete(locationField, ['geocode']);
  autoComplete.addListener('place_changed', () => {
    const place = autoComplete.getPlace();
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    document.getElementById('coordinates').value = `${latitude}, ${longitude}`;
  });
}

document.querySelector('.form-card').addEventListener('submit', (evt) => {
  evt.preventDefault();
  const comment = document.getElementById('comment').value;
  const reportType = document.getElementById('issue-type').value;
  const location = document.getElementById('coordinates').value.split(',');
  const latitude = location[0].trim();
  const longitude = location[1].trim();

  const reportObj = {
    latitude, longitude, comment,
  };

  createReport(reportObj, reportType);
});

function positionSuccess(position) {
  const { latitude, longitude } = position.coords;
  document.getElementById('coordinates').value = `${latitude}, ${longitude}`;
}

function positionFails() {
  alert('Sorry, could not retrieve location, try again later');
}

document.querySelector('.current-location').addEventListener('click', (evt) => {
  evt.preventDefault();
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(positionSuccess, positionFails);
  } else {
    alert('Sorry, your browser does not support this feature');
  }
});

autoCompleteAddress();
