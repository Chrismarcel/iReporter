if (!localStorage.getItem('token')) {
  window.location.href = './';
}

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

function renderEmptyReportsCard(selector) {
  const messageCard = document.createElement('div');
  const message = document.createElement('p');
  messageCard.classList.add('card', 'report-card', 'no-reports');
  message.textContent = 'You have not created any records';
  messageCard.append(message);
  return document.querySelector(selector).append(messageCard);
}

function emptyNode(node) {
  while (node.firstChild) {
    node.firstChild.remove();
  }
}

function renderReportCard(reportObj) {
  const {
    id, type, status, latitude, longitude, comment, createdat,
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
  clockIcon.classList.add('icon', 'icon-blue', 'fas', 'fa-clock');
  reportTime.textContent = convertUTCTOLocalTime(createdat);
  const reportComment = document.createElement('p');
  reportComment.classList.add('report-comment');
  reportComment.textContent = comment;
  const reportLocation = document.createElement('p');
  reportLocation.classList.add('report-location');
  reportLocation.textContent = `${latitude}, ${longitude}`;
  const locationIcon = document.createElement('i');
  locationIcon.classList.add('icon', 'icon-blue', 'fas', 'fa-map-marker-alt');

  reportTime.prepend(clockIcon);
  const reportMedia = document.createElement('div');
  reportMedia.classList.add('report-media');
  const reportImage = document.createElement('div');
  reportImage.classList.add('report-image');
  const imageIcon = document.createElement('i');
  imageIcon.classList.add('icon', 'icon-blue', 'fas', 'fa-images');
  reportImage.textContent = '2 Photos';
  const reportVideo = document.createElement('div');
  reportVideo.classList.add('report-video');
  const videoIcon = document.createElement('i');
  videoIcon.classList.add('icon', 'icon-blue', 'fas', 'fa-video');
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

  if (window.location.href.includes('dashboard') && status === 'drafted') {
    const editBtn = document.createElement('a');
    const deleteBtn = document.createElement('button');
    const editIcon = document.createElement('i');
    const deleteIcon = document.createElement('i');
    editBtn.setAttribute('href', `./edit-report.html?type=${type}s&id=${id}`);
    editBtn.classList.add('btn', 'btn-primary', 'edit-report');
    editIcon.classList.add('icon', 'icon-white', 'fas', 'fa-pen');
    deleteBtn.classList.add('btn', 'btn-warning', 'delete-report');
    deleteBtn.setAttribute('id', `delete-${id}`);
    deleteBtn.setAttribute('data-type', `${type}`);
    deleteIcon.classList.add('icon', 'icon-white', 'fas', 'fa-trash-alt');
    editBtn.textContent = 'Edit Report';
    editBtn.prepend(editIcon);
    deleteBtn.textContent = 'Delete Report';
    deleteBtn.prepend(deleteIcon);
    cardDiv.append(editBtn);
    cardDiv.append(deleteBtn);
  }

  return reportsGrid.append(cardDiv);
}

function renderReportForm(reportObj) {
  const { latitude, longitude, comment } = reportObj;
  const commentField = document.getElementById('comment');
  const locationField = document.getElementById('location');

  commentField.value = comment;
  locationField.value = `${latitude}, ${longitude}`;
}

function getReports(endpoint = null, id = null) {
  let url = `http://localhost:3000/api/v1/${endpoint}`;
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
      if (report.length < 1) {
        return renderEmptyReportsCard('.cards-list');
      }
      if (window.location.href.includes('edit-report')) {
        renderReportForm(report);
      } else {
        return report.map(reportDetails => renderReportCard(reportDetails));
      }
    })
    .catch(error => console.log(error));
}

function getReportParams(queryString) {
  const matches = queryString.substr(1).match(/=(\w+)-?(\w+)?/gm);
  return matches.map(match => match.substr(1));
}

if (window.location.href.includes('edit-report')) {
  const endpoint = getReportParams(window.location.search)[0];
  const id = getReportParams(window.location.search)[1];
  getReports(endpoint, id);
} else {
  getReports('red-flags');
}

const toggleBtns = Array.from(document.querySelectorAll('.toggle-reports button'));
toggleBtns.map((toggleBtn) => {
  toggleBtn.addEventListener('click', function toggle(evt) {
    const reportsList = document.querySelector('.cards-list');
    emptyNode(reportsList);
    const type = evt.target.id;
    if (type === 'red-flags') {
      this.nextElementSibling.classList.remove('toggled');
    } else {
      this.previousElementSibling.classList.remove('toggled');
    }
    this.classList.add('toggled');
    getReports(type);
  });
});
