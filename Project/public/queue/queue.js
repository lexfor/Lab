const socket = new WebSocket('ws://localhost:8080');

const doctorsType = document.getElementById('doctorsType');
const doctorsNames = document.getElementById('doctorsNames');
const doctorTypesInput = document.getElementById('doctorTypesInput');
const doctorNamesInput = document.getElementById('doctorNamesInput');
const table = document.getElementById('table');

function addTD(key, tr) {
  const td = document.createElement('td');
  if (key) {
    td.innerText = key;
  } else {
    td.innerText = '---';
  }
  tr.appendChild(td);
}

async function refreshTableContent() {
  const getResolutions = await fetch(`/patient/${window.sessionStorage.getItem('patient')}/resolutions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
    },
  });

  if (getResolutions.ok) {
    const tableContent = await getResolutions.json();

    if (tableContent) {
      table.innerHTML = '';
      const id = 1;

      tableContent.forEach((element) => {
        const tr = document.createElement('tr');

        addTD(id++, tr);
        addTD(element.doctor_specialization, tr);
        addTD(element.doctor_name, tr);
        addTD(element.value, tr);
        addTD(new Date(+element.updatedTime).toISOString().substr(0, 10), tr);

        table.appendChild(tr);
      });
    }
  }
}

async function getSelectedResolution() {
  const textarea = document.getElementById('resolution');
  const response = await fetch(`/patient/${window.sessionStorage.getItem('patient')}/resolution`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
    },
  });
  if (response.ok) {
    const json = await response.json();
    textarea.value = json.value;
  } else {
    textarea.value = 'N/A';
  }
}

async function getCurrent(doctorTypeValue, doctorNameValue) {
  if (doctorTypeValue && doctorNameValue) {
    const response = await fetch(`/queue/current?doctorTypeValue=${doctorTypeValue}&doctorNameValue=${doctorNameValue}`);
    const result = await response.json();

    if (response.ok) {
      document.getElementById('currentNumber').innerHTML = result.name;
    } else {
      document.getElementById('currentNumber').innerHTML = 'N/A';
    }
    await getSelectedResolution();
  }
}

async function Add() {
  const doctorTypeValue = doctorTypesInput.value;
  const doctorNameValue = doctorNamesInput.value;

  const response = await fetch(`/queue/patient/${window.sessionStorage.getItem('patient')}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
    },
    body: JSON.stringify({
      doctorType: doctorTypeValue,
      doctorName: doctorNameValue,
    }),
  });

  if (response.ok) {
    await getCurrent(doctorTypeValue, doctorNameValue);
  }
}

async function getAllDoctorsBySpecializations() {
  const ID = doctorTypesInput.value;
  const doctorsTypeID = document.getElementById(ID).specializationID;
  const response = await fetch(`/doctor/allDoctorsBySpecializations?typeID=${doctorsTypeID}`);

  if (response.ok) {
    const json = await response.json();

    doctorsNames.innerHTML = '';

    json.forEach((element) => {
      const option = document.createElement('option');
      option.value = element.firstName;
      option.label = element.email;

      doctorsNames.appendChild(option);
    });
  }
  // if (!window.sessionStorage.getItem('patient')) {
  //   document.location.href = '/login';
  // }
}

window.onload = async () => {
  const response = await fetch('/doctor/allSpecializations');

  if (response.ok) {
    const json = await response.json();

    doctorsType.innerHTML = '';

    json.forEach((element) => {
      const option = document.createElement('option');
      option.value = element.specializationName;
      option.id = element.specializationName;
      option.specializationID = element.specializationID;

      doctorsType.appendChild(option);
    });
  }

  refreshTableContent();

  // if (!window.sessionStorage.getItem('patient')) {
  //   document.location.href = '/login';
  // }
};

getCurrent();

socket.addEventListener('message', () => {
  getCurrent();
});
