const socket = new WebSocket('ws://localhost:8080');

const doctorsType = document.getElementById('doctorsType');
const doctorsNames = document.getElementById('doctorsNames');
const doctorTypesInput = document.getElementById('doctorTypesInput');
const doctorNamesInput = document.getElementById('doctorNamesInput');

// doctorsType.addEventListener('change', async () => await getAllDoctorsBySpecializations());

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
  const response = await fetch(`/queue/current?doctorTypeValue=${doctorTypeValue}&doctorNameValue=${doctorNameValue}`);
  const result = await response.json();

  if (response.ok) {
    document.getElementById('currentNumber').innerHTML = result.name;
  } else {
    document.getElementById('currentNumber').innerHTML = 'N/A';
  }
  await getSelectedResolution();
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
  // if (!window.sessionStorage.getItem('patient')) {
  //   document.location.href = '/login';
  // }
};

getCurrent();

socket.addEventListener('message', () => {
  getCurrent();
});
