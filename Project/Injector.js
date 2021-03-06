import {
  AuthenticationRepository,
  AuthenticationService,
  AuthenticationController,
  JwtService,
} from './api/authentication';
import { PatientController, PatientRepository, PatientService } from './api/patient';
import { ResolutionService, ResolutionRepository, ResolutionController } from './api/resolutions';
import { DoctorController, DoctorRepository, DoctorService } from './api/doctor';
import { QueueService, QueueRepository, QueueController } from './api/queue';
import { connection } from './api/helpers/DBconnection';
import { initializeDB } from './api/helpers/DBInitializator';
import { client } from './api/helpers/RedisConnection';

class Injector {
  constructor() {
    console.log('using SQL');
    initializeDB(connection).then(console.log('Database initialized'));
    this.patientRepository = new PatientRepository(connection);
    this.resolutionRepository = new ResolutionRepository(connection);
    console.log('using redis for queue');
    // client.flushdb();
    this.queueRepository = new QueueRepository(client);
    this.authenticationRepository = new AuthenticationRepository(connection);
    this.doctorRepository = new DoctorRepository(connection);

    this.patientService = new PatientService(this.patientRepository);
    this.queueService = new QueueService(this.queueRepository);
    this.jwtService = new JwtService();
    this.authenticationService = new AuthenticationService(this.authenticationRepository);
    this.resolutionService = new ResolutionService(this.resolutionRepository);
    this.doctorService = new DoctorService(this.doctorRepository);

    this.authenticationController = new AuthenticationController(
      this.authenticationService,
      this.patientService,
      this.jwtService,
    );
    this.patientController = new PatientController(
      this.patientService,
    );
    this.resolutionController = new ResolutionController(
      this.resolutionService,
      this.queueService,
      this.patientService,
      this.doctorService,
    );
    this.doctorController = new DoctorController(
      this.doctorService,
    );
    this.queueController = new QueueController(
      this.queueService,
      this.patientService,
      this.doctorService,
    );
  }

  get getPatientController() {
    return this.patientController;
  }

  get getResolutionController() {
    return this.resolutionController;
  }

  get getAuthenticationController() {
    return this.authenticationController;
  }

  get getDoctorController() {
    return this.doctorController;
  }

  get getQueueController() {
    return this.queueController;
  }
}

const injector = new Injector();
export { injector };
