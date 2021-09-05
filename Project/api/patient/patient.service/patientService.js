export default class PatientService {
  constructor(patientRepository) {
    this.patientRepository = patientRepository;
  }

  async addPatient(userID, name, birthday, gender, email) {
    const patient = await this.patientRepository.create(
      userID,
      name,
      birthday,
      gender,
      email,
    );
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
      return values.indexOf(patient.name) !== -1;
    }
    if (patient.user_id) {
      const patientInfo = await this.findPatientByUser(patient.user_id);
      const values = await this.patientRepository.getAllIDs();
      return values.indexOf(patientInfo.id) !== -1;
    }
    const values = await this.patientRepository.getAllIDs();
    return values.indexOf(patient.id) !== -1;
  }

  async isEmpty() {
    const result = await this.patientRepository.getAllNames();
    return result.length === 0;
  }
}
