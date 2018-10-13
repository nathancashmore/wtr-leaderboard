
function reload() {
  console.log("RELOAD");
  $('#score-table').load(`${location.href}score-table`, ''); // eslint-disable-line
  $('#progress-section').load(`${location.href}/update`, ''); // eslint-disable-line
}

setInterval(reload, 3000);
console.log("STARTING");
