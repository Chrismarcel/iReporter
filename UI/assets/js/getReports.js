function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.substr(1);
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

function renderReportCard(reportObj) {
  const {
    status, latitude, longitude, comment, createdat,
  } = reportObj;
  const reportsGrid = document.querySelector('.cards-list');
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card', 'report-card');
  const reportStatus = document.createElement('div');
  reportStatus.classList.add('report-status', status);
  reportStatus.textContent = capitalizeFirstLetter(status);
  const reportTime = document.createElement('p');
  reportTime.classList.add('report-time');
  const clockIcon = document.createElement('i');
  clockIcon.classList.add('icon', 'fas', 'fa-clock');
  reportTime.textContent = convertUTCTOLocalTime(createdat);
  const reportComment = document.createElement('p');
  reportComment.classList.add('report-comment');
  reportComment.textContent = comment;
  const reportLocation = document.createElement('p');
  reportLocation.classList.add('report-location');
  reportLocation.textContent = `${latitude}, ${longitude}`;
  const locationIcon = document.createElement('i');
  locationIcon.classList.add('icon', 'fas', 'fa-map-marker-alt');

  reportTime.prepend(clockIcon);
  const reportMedia = document.createElement('div');
  reportMedia.classList.add('report-media');
  const reportImage = document.createElement('div');
  reportImage.classList.add('report-image');
  const imageIcon = document.createElement('i');
  imageIcon.classList.add('icon', 'fas', 'fa-images');
  reportImage.textContent = '2 Photos';
  const reportVideo = document.createElement('div');
  reportVideo.classList.add('report-video');
  const videoIcon = document.createElement('i');
  videoIcon.classList.add('icon', 'fas', 'fa-video');
  reportVideo.textContent = '2 Videos';

  reportImage.prepend(imageIcon);
  reportVideo.prepend(videoIcon);
  reportLocation.prepend(locationIcon);
  reportMedia.append(reportImage);
  reportMedia.append(reportVideo);

  cardDiv.append(reportTime);
  cardDiv.append(reportStatus);
  cardDiv.append(reportComment);
  cardDiv.append(reportMedia);
  cardDiv.append(reportLocation);

  return reportsGrid.append(cardDiv);
}

function renderReportForm(reportObj) {
  const { latitude, longitude, comment } = reportObj;
  const commentField = document.getElementById('comment');
  const locationField = document.getElementById('location');

  commentField.value = comment;
  locationField.value = `${latitude}, ${longitude}`;
}

function getReports(id = null) {
  let url = 'http://localhost:3000/api/v1/red-flags';
  const token = window.localStorage.getItem('token');

  if (id) {
    url = `${url}/${id}`;
  }

  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then((responseObj) => {
      const report = responseObj.data;
      if (!id) {
        report.map((reportDetails) => {
          renderReportCard(reportDetails);
        });
      }

      if (window.location.href.includes('edit-report')) {
        renderReportForm(responseObj.data);
      } else {
        console.log(window.location);
      }
    })
    .catch(error => console.log(error));
}

if (window.location.href.includes('edit-report')) {
  getReports(3);
} else {
  getReports();
}
