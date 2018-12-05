// Event handler for toggling menu of mobile devices
const hamburgerBtn = document.querySelector('.hamburger-menu');
hamburgerBtn.addEventListener('click', function toggleMenu() {
  const menu = document.querySelector('.navbar-menu');
  this.classList.toggle('menu-open');
  menu.classList.toggle('menu-open');
});

// Handle modal toggle events for report deletion
const toggleModal = () => {
  const modalToggle = document.querySelector('.modal-toggle');
  const modal = document.querySelector('.modal');
  document.body.classList.toggle('modal-open');
  modalToggle.classList.toggle('modal-open');
  modal.classList.toggle('modal-open');
};

const deleteReportBtns = Array.from(document.querySelectorAll('.delete-report'));
deleteReportBtns.forEach(deleteReportBtn => deleteReportBtn.addEventListener('click', () => {
  toggleModal();
}));

const modalActionBtns = Array.from(document.querySelectorAll('.modal-btn'));
modalActionBtns.forEach(modalActionBtn => modalActionBtn.addEventListener('click', (evt) => {
  if (evt.target.id === 'delete') {
    const modalMessage = document.querySelector('.modal-message');
    modalMessage.textContent = 'Report Deleted Successfully';
    document.querySelector('.modal-group').remove();
  } else {
    toggleModal();
  }
}));

const closeModal = document.querySelector('.modal-close');
if (closeModal) {
  closeModal.addEventListener('click', () => {
    toggleModal();
  });
}

const submitBtns = Array.from(document.querySelectorAll('.update'));
submitBtns.forEach(submitBtn => submitBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  let message = 'Profile Updated Successfully';

  if (evt.target.id === 'record') {
    message = 'Record Updated Successfully';
  }

  document.querySelector('.message-box').textContent = message;
}));
