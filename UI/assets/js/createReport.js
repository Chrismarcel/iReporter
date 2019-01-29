function toggleSpinner(selector, text, showSpinner = true) {
  let spinner = '';
  if (showSpinner) {
    spinner = '<i class="fas fa-circle-notch fa-spin"></i>';
  }
  selector.innerHTML = `${spinner} ${text}`;
}

function createReport(body, endpoint) {
  const url = `https://ireporter-api.herokuapp.com/api/v1/${endpoint}`;
  const token = window.localStorage.getItem('token');
  const element = document.querySelector('button[type="submit"]');
  const defaultText = element.textContent;
  toggleSpinner(element, 'Creating Record');

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
      if (responseObj.status === 201) {
        window.location.href = './view-reports.html';
      } else {
        toggleSpinner(element, defaultText, false);
      }
    })
    .catch((error) => {
      toggleSpinner(element, defaultText, false);
      console.log(error);
    });
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

document.querySelector('.form-card').addEventListener('submit', (evt) => {
  evt.preventDefault();
  const comment = document.getElementById('comment').value;
  const reportType = document.getElementById('issue-type').value;
  const locationElement = document.getElementById('coordinates');
  const location = locationElement.getAttribute('data-coordinates').split(',');
  const latitude = location[0].trim();
  const longitude = location[1].trim();
  const images = JSON.parse(document.getElementById('report-media').value);

  const reportObj = {
    latitude, longitude, comment, images,
  };

  createReport(reportObj, reportType);
});

function positionSuccess(position) {
  const { latitude, longitude } = position.coords;
  const locationText = document.getElementById('coordinates');
  const locationField = document.getElementById('location');
  locationText.setAttribute('data-coordinates', `${latitude}, ${longitude}`);
  locationField.removeAttribute('required');
  toggleSpinner(locationText, 'Getting current position');
  locationText.textContent = `Selected location coordinates are ${latitude}, ${longitude}`;
}

function positionFails() {
  const locationText = document.getElementById('coordinates');
  const text = 'Sorry, could not retrieve location, try again later';
  toggleSpinner(locationText, text, false);
}

document.querySelector('.current-location').addEventListener('click', (evt) => {
  evt.preventDefault();
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(positionSuccess, positionFails);
  } else {
    const locationText = document.getElementById('coordinates');
    const text = 'Sorry, your browser does not support this feature';
    toggleSpinner(locationText, text, false);
  }
});

const uploadWidget = cloudinary.createUploadWidget({
  cloudName: 'myopinion-ng',
  uploadPreset: 'nkztoivt',
  maxFiles: 3,
  clientAllowedFormats: ['png', 'jpg', 'jpeg'],
  maxFileSize: 2000000,
  maxImageWidth: 245,
  fieldName: '.form-card',
}, (error, result) => {
  if (error) {
    alert('Sorry, media file cannot be uploaded at this time.');
  } else {
    const mediaNames = document.getElementById('report-media');
    const mediaList = JSON.parse(mediaNames.value);
    if (result && result.event === 'success') {
      const { path, original_filename } = result.info;
      const fileList = document.getElementById('file-list');
      const fileListItem = document.createElement('li');
      const fileListIcon = document.createElement('i');
      fileListItem.textContent = original_filename;
      fileListIcon.classList.add('fas', 'fa-check');
      fileListItem.append(fileListIcon);
      fileList.append(fileListItem);
      const mediaName = path.split('/')[2];
      mediaList.push(mediaName);
      mediaNames.value = JSON.stringify(mediaList);
    }
  }
});

document.getElementById('attachment').addEventListener('click', (evt) => {
  evt.preventDefault();
  uploadWidget.open();
});

autoCompleteAddress();
