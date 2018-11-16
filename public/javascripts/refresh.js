
function reload() {
  console.log('RELOAD');
  $('#score-table').load(`/score-table`, ''); // eslint-disable-line
  $('#progress-section').load(`/update`, ''); // eslint-disable-line
}

setInterval(reload, 3000);
console.log('STARTING');
