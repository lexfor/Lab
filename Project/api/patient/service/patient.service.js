import ApiError from '../../helpers/ApiError';

import { STATUSES } from '../../../constants';

class PatientService {
  constructor(patientRepository) {
    this.patientRepository = patientRepository;
  }

  /**
   * Add new patient
   * @param {object} userInfo
   * @param {object} createdUser
   * @returns {object} patient Data
   */
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

  /**
   * Find patient by user ID
   * @param {string} userID
   * @returns {object} patient Data
   */
  async findPatientByUser(userID) {
    const patient = await this.patientRepository.getByUserID(userID);
    return patient;
  }

  /**
   * Find patient by name
   * @param {string} patientName
   * @returns {object} patient Data
   */
  async findPatientByName(patientName) {
    const patient = await this.patientRepository.getByName(patientName);
    return patient;
  }

  /**
   * Find patient by ID
   * @param {string} patientID
   * @returns {object} patient Data
   */
  async findPatientByID(patientID) {
    const patient = await this.patientRepository.getByID(patientID);
    return patient;
  }

  /**
   * Find patient by name or by ID
   * @param {object} user name or ID
   * @returns {object} patient ID
   */
  async findPatient(user) {
    let patientID;
    if (user.name) {
      const patientInfo = await this.findPatientByName(user.name);
      patientID = patientInfo.id;
    } else {
      const patient = await this.findPatientByUser(user.userID);
      patientID = patient.id;
    }
    return patientID;
  }

  /**
   * Check is exist patient by name, user ID, ID
   * @param {object} patient name or ID or user ID
   */
  async isExist(patient) {
    if (patient.name) {
      const values = await this.patientRepository.getAllNames();
      if (values.indexOf(patient.name) === -1) {
        throw new ApiError('no such patient', STATUSES.NOT_FOUND);
      }
      return;
    }
    if (patient.userID) {
      const patientInfo = await this.findPatientByUser(patient.userID);
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

  /**
   * Get all patients by part of data
   * @param {string} patientInfo
   * @returns {array} founded patients
   */
  async getAllPatients(patientInfo) {
    const allPatient = await this.patientRepository.getAllPatients(patientInfo);

    return allPatient || null;
  }
}

export { PatientService };
