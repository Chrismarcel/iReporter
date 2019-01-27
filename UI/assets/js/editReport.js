function updateReport(endpoint, type, id, reportObj) {
  const token = window.localStorage.getItem('token');
  const url = `https://ireporter-api.herokuapp.com/api/v1/${endpoint}/${id}/${type}`;

  return fetch(url, {
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

function autoCompleteAddress() {
  const locationField = document.getElementById('location');
  const autoComplete = new google.maps.places.Autocomplete(locationField, ['geocode']);
  autoComplete.addListener('place_changed', () => {
    const place = autoComplete.getPlace();
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();
    const locationText = document.getElementById('coordinates');
    locationText.setAttribute('data-coordinates', `${latitude}, ${longitude}`);
    locationText.textContent = `Selected location coordinates are ${latitude}, ${longitude}`;
  });
}

function parseUrl(queryString) {
  const matches = queryString.substr(1).match(/=(\w+)-?(\w+)?/gm);
  return matches.map(match => match.substr(1));
}

document.querySelector('.form-card').addEventListener('submit', (evt) => {
  evt.preventDefault();
  const comment = document.getElementById('comment').value;
  const locationElement = document.getElementById('coordinates');
  const location = locationElement.getAttribute('data-coordinates').split(',');
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

function positionSuccess(position) {
  const { latitude, longitude } = position.coords;
  const locationText = document.getElementById('coordinates');
  locationText.setAttribute('data-coordinates', `${latitude}, ${longitude}`);
  locationText.textContent = `Selected location coordinates are ${latitude}, ${longitude}`;
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

const uploadWidget = cloudinary.createUploadWidget({
  cloudName: 'myopinion-ng',
  uploadPreset: 'nkztoivt',
}, (error, result) => {
  if (error) {
    alert('Sorry, media file cannot be uploaded at this time.');
  } else {
    console.log(result);
  }
});

document.getElementById('attachment').addEventListener('click', (evt) => {
  evt.preventDefault();
  uploadWidget.open();
});

autoCompleteAddress();
