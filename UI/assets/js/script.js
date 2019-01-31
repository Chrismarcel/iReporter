const isHomePage = window.location.pathname === '/' || window.location.href.includes('index');
const noAuthPages = ['login.html', 'signup.html', '', 'index.html'];

// Check if page is being served locally or from github pages
const baseUrlLength = window.location.pathname.includes('iReporter') ? 14 : 1;
const pageName = window.location.pathname.substr(baseUrlLength);

if (!localStorage.getItem('token') && !noAuthPages.includes(pageName)) {
  window.location.href = './login.html';
}

if (localStorage.getItem('token') && isHomePage) {
  document.getElementById('login').remove();
  document.getElementById('signup').remove();
}

if (localStorage.getItem('role') !== 'admin') {
  document.getElementById('admin').remove();
}

if (localStorage.getItem('role') !== 'user') {
  document.getElementById('dashboard').remove();
  document.getElementById('my-records').remove();
  document.getElementById('create-record').remove();
}

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
