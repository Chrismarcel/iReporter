
function toggleDeleteModal(evt, id = null, type = null) {
  evt.preventDefault();
  const modalToggle = document.querySelector('.modal-toggle');
  const modal = document.querySelector('.modal');
  document.body.classList.toggle('modal-open');
  modalToggle.classList.toggle('modal-open');
  modal.classList.toggle('modal-open');

  if (id) {
    document.getElementById('delete').setAttribute('data-id', id);
    document.getElementById('delete').setAttribute('data-report', type);
  }
}

function deleteReport(id, endpoint) {
  const url = `https://ireporter-api.herokuapp.com/api/v1/${endpoint}s/${id}`;
  const token = window.localStorage.getItem('token');
  fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then((responseObj) => {
      if (responseObj.status === 200) {
        const modalMessage = document.querySelector('.modal-message');
        modalMessage.textContent = 'Report Deleted Successfully';
        document.getElementById(`delete-${id}`).parentElement.remove();
      }
    });
}

document.body.addEventListener('click', (evt) => {
  if (evt.target.id.includes('delete-')) {
    const postID = evt.target.id.split('-')[1];
    const reportType = evt.target.dataset.type;
    toggleDeleteModal(evt, postID, reportType);
  }

  if (evt.target.id === 'delete') {
    const reportID = evt.target.dataset.id;
    const reportType = evt.target.dataset.report;
    deleteReport(reportID, reportType);
    document.querySelector('.modal-group').remove();
  } else if (evt.target.id === 'cancel') {
    toggleDeleteModal(evt);
  }
});

document.querySelector('.delete-modal .modal-close')
  .addEventListener('click', (evt) => {
    toggleDeleteModal(evt);
  });
