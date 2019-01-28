function toggleSpinner(selector, text, showSpinner = true) {
  let spinner = '';
  if (showSpinner) {
    spinner = '<i class="fas fa-circle-notch fa-spin"></i>';
  }
  selector.innerHTML = `${spinner} ${text}`;
}

function getStatistics(endpoint = null) {
  const url = `https://ireporter-api.herokuapp.com/api/v1/${endpoint}`;
  const token = window.localStorage.getItem('token');
  const element = document.querySelector('.stat-toggle');
  let pending = 0;
  let resolved = 0;
  let rejected = 0;

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then((responseObj) => {
      const reports = responseObj.data;
      return reports.map((report) => {
        const { status } = report;
        if (status === 'drafted' || status === 'investigating') {
          pending += 1;
        } else if (status === 'resolved') {
          resolved += 1;
        } else {
          rejected += 1;
        }

        return { pending, resolved, rejected };
      });
    })
    .catch(error => console.log(error));
}

const isUserDashboard = window.location.href.includes('dashboard') || false;

const element = document.querySelector('.stat-toggle');
toggleSpinner(element, 'Loading Stats');

if (isUserDashboard) {
  const fullname = localStorage.getItem('fullname');
  const username = localStorage.getItem('username');
  document.querySelector('.fullname').textContent = fullname;
  document.querySelector('.username').textContent = `(${username})`;
}

Promise.all([getStatistics('red-flags'), getStatistics('interventions')])
  .then((response) => {
    document.querySelector('.stat-toggle').style.display = 'none';
    const redFlags = response[0][response[0].length - 1];
    const interventions = response[1][response[1].length - 1];
    const totalPending = redFlags.pending + interventions.pending;
    const totalResolved = redFlags.resolved + interventions.resolved;
    const totalRejected = redFlags.rejected + interventions.rejected;
    const totalRecords = totalPending + totalResolved + totalRejected;

    document.getElementById('resolved').textContent = totalResolved;
    document.getElementById('pending').textContent = totalPending;
    document.getElementById('rejected').textContent = totalRejected;
    if (isUserDashboard) {
      document.querySelector('.profile-stats').style.display = 'flex';
    } else {
      document.querySelector('.admin-report').style.display = 'flex';
    }

    if (localStorage.getItem('role') === 'admin') {
      document.getElementById('total').textContent = totalRecords;
    }
  })
  .catch((error) => {
    const toggleElement = document.querySelector('.stat-toggle');
    toggleElement.style.display = 'block';
    toggleElement.textContent = 'Sorry, could not retrieve stats. Refresh the page to try again';

    console.log(error);
  });
