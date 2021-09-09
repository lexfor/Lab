import ApiError from '../../helpers/ApiError';

import { STATUSES } from '../../../constants';

class PatientService {
  constructor(patientRepository) {
    this.patientRepository = patientRepository;
  }

  async addPatient(userInfo, createdUser) {
    const patientData = {
      user_id: createdUser.id,
      mail: userInfo.login,
      name: userInfo.name,
      birthday: userInfo.birthday,
      gender: userInfo.gender,
    };
    const patient = await this.patientRepository.create(patientData);
    return patient;
  }

  async findPatientByUser(userID) {
    const patient = await this.patientRepository.getByUserID(userID);
    return patient;
  }

  async findPatientByName(patientName) {
    const patient = await this.patientRepository.getByName(patientName);
    return patient;
  }

  async findPatientByID(patientID) {
    const patient = await this.patientRepository.getByID(patientID);
    return patient;
  }

  async findPatient(user) {
    let patientID;
    if (user.name) {
      const patientInfo = await this.findPatientByName(user.name);
      patientID = patientInfo.id;
    } else {
      const patient = await this.findPatientByUser(user.user_id);
      patientID = patient.id;
    }
    return patientID;
  }

  async isExist(patient) {
    if (patient.name) {
      const values = await this.patientRepository.getAllNames();
      if (values.indexOf(patient.name) === -1) {
        throw new ApiError('no such patient', STATUSES.NOT_FOUND);
      }
      return;
    }
    if (patient.user_id) {
      const patientInfo = await this.findPatientByUser(patient.user_id);
      const values = await this.patientRepository.getAllIDs();
      if (values.indexOf(patientInfo.id) === -1) {
        throw new ApiError('no such patient', STATUSES.NOT_FOUND);
      }
      return;
    }
    const values = await this.patientRepository.getAllIDs();
    if (values.indexOf(patient.id) === -1) {
      throw new ApiError('no such patient', STATUSES.NOT_FOUND);
    }
  }
}

export { PatientService };
