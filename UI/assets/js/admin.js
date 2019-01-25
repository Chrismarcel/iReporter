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
  commentCell.textContent = comment;
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
  submitBtn.textContent = 'Submit';
  form.append(selectStatus);
  form.append(submitBtn);
  statusCell.append(form);
  row.append(statusCell);
  document.querySelector('tbody').append(row);
}

function getAllReports(endpoint = null) {
  const url = `http://localhost:3000/api/v1/${endpoint}`;
  const token = window.localStorage.getItem('token');

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
      if (window.location.href.includes('admin')) {
        report.map((reportDetails, serial) => renderReportTable(reportDetails, serial + 1));
      }
    })
    .catch(error => console.log(error));
}

function updateReportStatus(endpoint, id, status) {
  const url = `http://localhost:3000/api/v1/${endpoint}s/${id}/status`;
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
      console.log(responseObj);
      if (responseObj.status === 200) {
        console.log('Report updated');
      }
    })
    .catch(error => console.log(error));
}

document.body.addEventListener('click', (evt) => {
  evt.preventDefault();
  const { target } = evt;
  const classNames = Array.from(target.classList);
  if (classNames.includes('update-record')) {
    const status = target.previousElementSibling.value;
    console.log(status);
    const id = target.getAttribute('data-id');
    const type = target.getAttribute('data-type');
    updateReportStatus(type, id, status);
    console.log({ type, id, status });
  }
});

const role = localStorage.getItem('role');
if (role !== 'admin') {
  window.location.href = './index.html';
} else {
  getAllReports('red-flags');
}
