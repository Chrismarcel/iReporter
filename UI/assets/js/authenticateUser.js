function authenticateUser(userObj, endpoint) {
  const url = `http://localhost:3000/api/v1/auth/${endpoint}`;
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
          localStorage.setItem('role', 'user');
          window.location.href = './admin.html';
        } else {
          localStorage.setItem('role', 'admin');
          window.location.href = './profile.html';
        }
      }
    })
    .catch(error => console.log(error));
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
