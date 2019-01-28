function toggleSpinner(selector, text, showSpinner = true) {
  let spinner = '';
  if (showSpinner) {
    spinner = '<i class="fas fa-circle-notch fa-spin"></i>';
  }
  selector.innerHTML = `${spinner} ${text}`;
}

function displayToast(message, show = true, className = 'primary') {
  const toast = document.querySelector('.toast');

  if (!show) {
    toast.classList.remove('toast-show', `toast-${className}`);
  } else {
    toast.classList.add(`toast-${className}`);
    const toastMessage = document.querySelector('.toast-message');
    toastMessage.textContent = message;
    toast.classList.toggle('toast-show');
  }
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

function emptyNode(node) {
  while (node.nextElementSibling) {
    node.nextElementSibling.remove();
  }
}

function renderReportTable(reportObj, serial) {
  const {
    id, type, status, comment, createdat,
  } = reportObj;

  const row = document.createElement('tr');
  const serialNumberCell = document.createElement('td');
  serialNumberCell.classList.add('serial');
  serialNumberCell.textContent = serial;
  row.append(serialNumberCell);
  const commentCell = document.createElement('td');
  commentCell.classList.add('comment');
  const commentText = document.createElement('p');
  commentText.setAttribute('data-type', type);
  commentText.setAttribute('data-id', id);
  commentText.textContent = comment;
  const expandReport = document.createElement('a');
  expandReport.classList.add('expand-report');
  expandReport.setAttribute('href', '#');
  expandReport.textContent = 'View Details';
  commentCell.append(commentText);
  commentCell.append(expandReport);
  row.append(commentCell);
  const dateCell = document.createElement('td');
  dateCell.classList.add('time');
  dateCell.textContent = convertUTCTOLocalTime(createdat);
  row.append(dateCell);
  const statusCell = document.createElement('td');
  const form = document.createElement('form');
  const selectStatus = document.createElement('select');
  selectStatus.classList.add('form-element');
  const statusOptions = ['drafted', 'investigating', 'resolved', 'rejected'];
  statusOptions.map((statusOption) => {
    const option = document.createElement('option');
    option.text = capitalizeFirstLetter(statusOption);
    option.value = statusOption;
    if (statusOption === status) {
      option.setAttribute('selected', 'selected');
    }
    return selectStatus.appendChild(option);
  });
  const submitBtn = document.createElement('button');
  submitBtn.setAttribute('type', 'submit');
  submitBtn.classList.add('btn', 'btn-primary', 'update-record');
  submitBtn.setAttribute('data-id', id);
  submitBtn.setAttribute('data-type', type);
  submitBtn.textContent = 'Update';
  form.append(selectStatus);
  form.append(submitBtn);
  statusCell.append(form);
  row.append(statusCell);
  document.querySelector('tbody').append(row);
}

function getAllReports(endpoint = null) {
  const url = `https://ireporter-api.herokuapp.com/api/v1/${endpoint}`;
  const token = window.localStorage.getItem('token');
  const toggleContainer = document.querySelector('.toggle');
  toggleSpinner(toggleContainer, 'Retrieving posts...');

  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then((responseObj) => {
      toggleContainer.firstChild.nextSibling.remove();
      toggleContainer.firstChild.remove();
      const report = responseObj.data;
      if (window.location.href.includes('admin')) {
        report.map((reportDetails, serial) => renderReportTable(reportDetails, serial + 1));
      }
    })
    .catch(error => console.log(error));
}

function updateReportStatus(endpoint, id, status) {
  const url = `https://ireporter-api.herokuapp.com/api/v1/${endpoint}s/${id}/status`;
  const token = window.localStorage.getItem('token');

  fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
    .then(response => response.json())
    .then((responseObj) => {
      if (responseObj.status === 200) {
        displayToast('Record status updated successfully', true);
        setTimeout(() => {
          displayToast('', false);
        }, 3000);
      } else {
        const { error } = responseObj;
        displayToast(error, true, 'warning');
        setTimeout(() => {
          displayToast('', false);
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

document.body.addEventListener('click', (evt) => {
  evt.preventDefault();
  const element = document.querySelector('button[type="submit"]');
  const defaultText = element.textContent;
  const { target } = evt;
  const classNames = Array.from(target.classList);
  if (classNames.includes('update-record')) {
    toggleSpinner(evt.target, 'Updating Record');
    const status = target.previousElementSibling.value;
    const id = target.getAttribute('data-id');
    const type = target.getAttribute('data-type');
    updateReportStatus(type, id, status);
    toggleSpinner(evt.target, defaultText, false);
  }
});

const role = localStorage.getItem('role');
if (role !== 'admin') {
  window.location.href = './index.html';
} else {
  getAllReports('red-flags');
}

const toggleBtns = Array.from(document.querySelectorAll('.toggle-reports button'));
toggleBtns.map((toggleBtn) => {
  toggleBtn.addEventListener('click', function toggle(evt) {
    const reportsList = document.querySelector('tbody tr:first-child');
    emptyNode(reportsList);
    const type = evt.target.id;
    document.querySelector('.report-type h2').textContent = `Displaying ${type} records`;

    if (type === 'red-flags') {
      this.nextElementSibling.classList.remove('toggled');
    } else {
      this.previousElementSibling.classList.remove('toggled');
    }
    this.classList.add('toggled');
    getAllReports(type);
  });
});
