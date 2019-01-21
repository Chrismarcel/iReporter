function authenticateUser(userObj, method) {
  const endpoint = 'http://localhost:3000/api/v1/auth/register';
  fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userObj),
  })
    .then(apiResponse => apiResponse.json())
    .then((user) => {
      const { token } = user.data[0];
      localStorage.setItem('token', token);
      window.location.href = './profile.html';
    })
    .catch(error => console.log(error));
}

document.querySelector('.form-card').addEventListener('submit', (evt) => {
  evt.preventDefault();


  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const userDetails = {
    email, password,
  };

  if (window.location.href.includes('signup')) {
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const othername = document.getElementById('othername').value;
    const username = document.getElementById('username').value;
    const phonenumber = document.getElementById('phonenumber').value;

    Object.assign(userDetails, {
      firstname, lastname, othername, username, phonenumber,
    });
  }

  authenticateUser(userDetails, 'POST');
});
