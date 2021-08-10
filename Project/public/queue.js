async function getAllValue() {
  let response = await fetch('/all-value');
  response = await response.json();

  const select = document.getElementById('valueSelect');
  select.options.length = 0;
  select.append(new Option('Выберите', 'Выберите'));
  response.forEach((item) => {
    const option = new Option(item, item);
    select.append(option);
  });
}

async function Add() {
  const inputValue = document.getElementById('inputValue');
  await fetch('/add-patient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(inputValue.value),
  });
  await getAllValue();
}

async function getCurrent() {
  const response = await fetch('/current');
  document.getElementById('currentNumber').innerHTML = await response.json();
}

async function getSelectedResolution() {
  const select = document.getElementById('valueSelect');
  let url = new URL('/resolution', document.location.origin);
  let params = new URLSearchParams();
  params.append("value", select.value);
  url.search = params.toString();
  let response = await fetch(url.href);
  let json = await response.json();
  const textarea = document.getElementById('resolution');
  textarea.value = json;
}

getAllValue();
setInterval(getCurrent, 3000);
