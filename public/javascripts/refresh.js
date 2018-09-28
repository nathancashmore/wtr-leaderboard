
function reload() {
  console.log("RELOAD");
  $('#score-table').load(`${location.href}score-table`, ''); // eslint-disable-line
}

setInterval(reload, 10000);
console.log("STARTING");
