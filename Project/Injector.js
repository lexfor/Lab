import AuthenticationController from './api/authentication/authentication.controller/authenticationController.js';
import QueueController from './api/queue/queue.controller/queueController.js';
import PatientController from './api/patient/patient.controller/patientController.js';
import AuthenticationService from './api/authentication/authentication.service/authenticationService.js';
import PatientService from './api/patient/patient.service/patientService.js';
import QueueService from './api/queue/queue.service/queueService.js';
import AuthenticationSQL from './api/authentication/authentication.repository/authenticationSQL.js';
import QueueRedis from './api/queue/queue.repository/queueRedis.js';
import PatientSQL from './api/patient/patient.repository/patientSQL.js';
import ResolutionSQL from './api/patient/patient.repository/resolutionSQL.js';
import { connection } from './api/helpers/DBconnection.js';
import { initializeDB } from './api/helpers/DBInitializator.js';
import { client } from './api/helpers/RedisConnection.js';

class Injector {
  constructor() {
    console.log('using SQL');
    initializeDB(connection).then(console.log('Database initialized'));
    this.patientRepository = new PatientSQL(connection);
    this.resolutionRepository = new ResolutionSQL(connection);

    console.log('using redis for queue');
    client.flushdb();
    this.queueRepository = new QueueRedis(client);
    this.authenticationRepository = new AuthenticationSQL(connection);

    this.patientService = new PatientService(this.patientRepository, this.resolutionRepository);
    this.queueService = new QueueService(this.queueRepository, this.patientRepository);
    this.authenticationService = new AuthenticationService(
      this.authenticationRepository,
      this.patientRepository,
    );

    this.authenticationController = new AuthenticationController(this.authenticationService);
    this.queueController = new QueueController(this.queueService);
    this.patientController = new PatientController(this.queueService, this.patientService);
  }

  get getQueueController() {
    return this.queueController;
  }

  get getResolutionController() {
    return this.patientController;
  }

  get getAuthenticationController() {
    return this.authenticationController;
  }
}

const injector = new Injector();
export { injector };
