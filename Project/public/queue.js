async function Add() {
  const inputValue = document.getElementById('inputValue');
  const response = await fetch('/add_patient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(inputValue.value),
  });
  await response.json();
  await getAllValue();
}

async function getCurrent() {
  const response = await fetch('/get_current');
  document.getElementById('currentNumber').innerHTML = await response.json();
}

async function getAllValue() {
  let response = await fetch('/get_all_value');
  response = await response.json();
  response.forEach((item) => {
    const option = new Option(item, item);
    document.getElementById('valueSelect').append(option);
  });
}

async function getSelectedResolution() {
  const select = document.getElementById('valueSelect');
  let response = await fetch('/get_resolution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(select.value),
  });
  response = await response.json();
  const textarea = document.getElementById('resolution');
  textarea.value = response;
}

getAllValue();
setInterval(getCurrent, 3000);
