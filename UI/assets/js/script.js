// Event handler for toggling menu of mobile devices
const hamburgerBtn = document.querySelector('.hamburger-menu');
hamburgerBtn.addEventListener('click', function toggleMenu() {
  const menu = document.querySelector('.navbar-menu');
  this.classList.toggle('menu-open');
  menu.classList.toggle('menu-open');
});

// Handle modal toggle events for report deletion
const toggleModal = (evt) => {
  evt.preventDefault();
  const modalToggle = document.querySelector('.modal-toggle');
  const modal = document.querySelector('.modal');
  document.body.classList.toggle('modal-open');
  modalToggle.classList.toggle('modal-open');
  modal.classList.toggle('modal-open');
};

const deleteReportBtns = Array.from(document.querySelectorAll('.delete-report'));
deleteReportBtns.forEach(deleteReportBtn => deleteReportBtn.addEventListener('click', (evt) => {
  toggleModal(evt);
}));

const modalActionBtns = Array.from(document.querySelectorAll('.modal-btn'));
modalActionBtns.forEach(modalActionBtn => modalActionBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (evt.target.id === 'delete') {
    const modalMessage = document.querySelector('.modal-message');
    modalMessage.textContent = 'Report Deleted Successfully';
    document.querySelector('.modal-group').remove();
  } else {
    toggleModal(evt);
  }
}));

const updateStatusBtns = Array.from(document.querySelectorAll('.update-record'));
if (updateStatusBtns) {
  const toast = document.querySelector('.toast');
  updateStatusBtns.forEach(updateStatusBtn => updateStatusBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    toast.classList.toggle('toast-show');
    setTimeout(() => {
      toast.classList.toggle('toast-show');
    }, 3000);
  }));
}

const closeModal = document.querySelector('.modal-close');
if (closeModal) {
  closeModal.addEventListener('click', (evt) => {
    toggleModal(evt);
  });
}

const submitBtn = document.querySelector('.update');
if (submitBtn) {
  submitBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    let message = '';

    if (evt.target.id === 'record') {
      message = 'Record Updated Successfully';
    } else if (evt.target.id === 'profile') {
      message = 'Profile Updated Successfully';
    }

    document.querySelector('.message-box').textContent = message;
  });
}

function submitForm() {
  window.location.href = './profile.html';
  return false;
}

// submitForm();
