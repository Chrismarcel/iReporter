document.querySelector('.form-card').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const comment = document.getElementById('comment').value;
    const reportType = document.getElementById('issue-type').value;
    const location = document.getElementById('location').value.split(',');
    const latitude = location[0].trim();
    const longitude = location[1].trim();
    const token = window.localStorage.getItem('token');

    const reportObj = {
        latitude, longitude, comment
    }

    handleReports(reportObj, reportType, 'POST', token);
});