
function toggleSpinner(selector, text, showSpinner = true) {
  let spinner = '';
  if (showSpinner) {
    spinner = '<i class="fas fa-circle-notch fa-spin"></i>';
  }
  selector.innerHTML = `${spinner} ${text}`;
}

function authenticateUser(userObj, endpoint) {
  const url = `https://ireporter-api.herokuapp.com/api/v1/auth/${endpoint}`;
  const element = document.querySelector('button[type="submit"]');
  const defaultText = element.textContent;
  let defaultRole = 'user';
  let defaultPage = './index.html';
  toggleSpinner(element, 'Loading');

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userObj),
  })
    .then(apiResponse => apiResponse.json())
    .then((responseObj) => {
      if (responseObj.status === 200 || responseObj.status === 201) {
        const { token, user } = responseObj.data[0];
        localStorage.setItem('token', token);
        if (user.isadmin === 'true') {
          defaultRole = 'admin';
          defaultPage = './admin.html';
        }
        localStorage.setItem('role', defaultRole);
        window.location.href = defaultPage;
      } else {
        toggleSpinner(element, defaultText, false);
      }
    })
    .catch((error) => {
      toggleSpinner(element, defaultText, false);
      console.log(error);
    });
}

document.querySelector('.form-card').addEventListener('submit', (evt) => {
  evt.preventDefault();

  let endpoint = 'login';
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const userDetails = {
    email, password,
  };

  if (window.location.href.includes('signup')) {
    endpoint = 'register';

    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const othername = document.getElementById('othername').value;
    const username = document.getElementById('username').value;
    const phonenumber = document.getElementById('phonenumber').value;

    Object.assign(userDetails, {
      firstname, lastname, othername, username, phonenumber,
    });
  }

  authenticateUser(userDetails, endpoint);
});
