// Event handler for toggling menu of mobile devices
const hamburgerBtn = document.querySelector('.hamburger-menu');
hamburgerBtn.addEventListener('click', function toggleMenu() {
  const menu = document.querySelector('.navbar-menu');
  this.classList.toggle('menu-open');
  menu.classList.toggle('menu-open');
});

const updateStatusBtns = Array.from(document.querySelectorAll('.update-record'));
if (updateStatusBtns) {
  const toast = document.querySelector('.toast');
  updateStatusBtns.forEach(updateStatusBtn => updateStatusBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    toast.classList.toggle('toast-show');
    setTimeout(() => {
      toast.classList.remove('toast-show');
    }, 3000);
  }));
}

const toastHide = document.querySelector('.toast-hide');
if (toastHide) {
  const toast = document.querySelector('.toast');
  toastHide.addEventListener('click', (evt) => {
    evt.preventDefault();
    toast.classList.toggle('toast-show');
  });
}
