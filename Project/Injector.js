import AuthenticationController from './api/controllers/authenticationController.js';
import QueueController from './api/controllers/queueController.js';
import PatientController from './api/controllers/patientController.js';
import AuthenticationService from './api/service/authenticationService.js';
import PatientService from './api/service/PatientService.js';
import QueueService from './api/service/QueueService.js';
import AuthenticationSQL from './api/repositories/authentication.repositories/authenticationSQL.js';
import QueueRedis from './api/repositories/queue.repositories/queueRedis.js';
import PatientSQL from './api/repositories/patient.repositories/patientSQL.js';
import ResolutionSQL from './api/repositories/resolution.repositories/resolutionSQL.js';
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

    this.patientService = new PatientService(
      this.patientRepository,
      this.resolutionRepository,
      this.queueRepository,
    );
    this.queueService = new QueueService(this.queueRepository, this.patientRepository);
    this.authenticationService = new AuthenticationService(
      this.authenticationRepository,
      this.patientRepository,
    );

    this.authenticationController = new AuthenticationController(this.authenticationService);
    this.queueController = new QueueController(this.queueService);
    this.resolutionController = new PatientController(this.queueService, this.patientService);
  }

  get getQueueController() {
    return this.queueController;
  }

  get getResolutionController() {
    return this.resolutionController;
  }

  get getAuthenticationController() {
    return this.authenticationController;
  }
}

const injector = new Injector();
export { injector };
