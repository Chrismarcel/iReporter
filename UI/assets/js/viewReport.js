function toggleSpinner(selector, text, showSpinner = true) {
  let spinner = '';
  if (showSpinner) {
    spinner = '<i class="fas fa-circle-notch fa-spin"></i>';
  }
  selector.innerHTML = `${spinner} ${text}`;
}

function convertUTCTOLocalTime(timeString) {
  const dateObj = new Date(timeString);
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: 'numeric',
  }).format(dateObj);

  return formattedDate;
}

function emptyNode(node) {
  while (node.nextElementSibling) {
    node.nextElementSibling.remove();
  }
  node.textContent = '';
}

function renderReportDetails(reportObj) {
  const {
    latitude, longitude, comment, createdat, images,
  } = reportObj;

  const modalBody = document.querySelector('.report-modal .modal-body');

  if (images.length > 0) {
    const baseUrl = 'https://res.cloudinary.com/myopinion-ng/image/upload/v1548601936/iReporter/';
    images.map((image) => {
      const img = document.createElement('img');
      img.setAttribute('src', `${baseUrl}${image}`);
      document.querySelector('.modal-images').append(img);
    });
  }
  const reportComment = document.createElement('p');

  reportComment.textContent = comment;
  document.querySelector('.modal-comment').append(reportComment);
  const reportTime = document.createElement('p');
  reportTime.classList.add('report-time');
  const clockIcon = document.createElement('i');
  clockIcon.classList.add('icon', 'icon-blue', 'fas', 'fa-clock');
  const reportLocation = document.createElement('p');
  reportLocation.classList.add('report-location');
  const locationIcon = document.createElement('i');
  locationIcon.classList.add('icon', 'icon-blue', 'fas', 'fa-map-marker-alt');
  reportTime.textContent = convertUTCTOLocalTime(createdat);
  reportLocation.textContent = `${latitude}, ${longitude}`;
  reportTime.prepend(clockIcon);
  reportLocation.prepend(locationIcon);

  modalBody.insertBefore(reportTime, document.querySelector('.map-container'));
  modalBody.insertBefore(reportLocation, document.querySelector('.map-container'));
  initMap(Number(latitude), Number(longitude));
}

function getSingleReport(endpoint, id) {
  const token = localStorage.getItem('token');
  const url = `https://ireporter-api.herokuapp.com/api/v1/${endpoint}s/${id}`;
  const reportToggle = document.querySelector('.report-toggle');
  toggleSpinner(reportToggle, 'Retrieving posts...');

  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(report => report.json())
    .then((reportObj) => {
      reportToggle.firstChild.nextSibling.remove();
      reportToggle.firstChild.remove();
      renderReportDetails(reportObj.data);
    });
}

function toggleReportModal(evt) {
  evt.preventDefault();
  const modalToggle = document.querySelector('.modal-toggle');
  const modal = document.querySelector('.report-modal');
  document.body.classList.toggle('modal-open');
  modalToggle.classList.toggle('modal-open');
  modal.classList.toggle('modal-open');
}

function initMap(lat, lng) {
  const coordinates = {
    lat, lng,
  };
  // The map, centered at Uluru
  const map = new google.maps.Map(
    document.getElementById('map'), { zoom: 17, center: coordinates },
  );
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({ position: coordinates, map });
}

document.body.addEventListener('click', (evt) => {
  const classNames = Array.from(evt.target.classList);
  if (classNames.includes('expand-report')) {
    toggleReportModal(evt);
    const previousElement = evt.target.previousElementSibling;
    const type = previousElement.getAttribute('data-type');
    const id = previousElement.getAttribute('data-id');
    getSingleReport(type, id);
  }
});

document.querySelector('.report-modal .modal-close')
  .addEventListener('click', (evt) => {
    document.querySelector('.modal-comment').innerHTML = '';
    document.querySelector('.modal-images').innerHTML = '';
    const reportTime = document.querySelector('.modal-body .report-time');
    reportTime.parentNode.removeChild(reportTime);
    const reportLocation = document.querySelector('.modal-body .report-location');
    reportLocation.parentNode.removeChild(reportLocation);

    toggleReportModal(evt);
  });
