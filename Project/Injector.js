import AuthenticationController from './api/authentication/authentication.controller/authenticationController.js';
import QueueController from './api/queue/queue.controller/queueController.js';
import ResolutionController from './api/resolutions/resolution.controller/resolutionController.js';
import AuthenticationService from './api/authentication/authentication.service/authenticationService.js';
import ResolutionService from './api/resolutions/resolution.service/resolutionService.js';
import PatientService from './api/patient/patient.service/patientService.js';
import QueueService from './api/queue/queue.service/queueService.js';
import JwtService from './api/authentication/authentication.service/jwtService.js';
import AuthenticationSQL from './api/authentication/authentication.repository/authenticationSQL.js';
import QueueRedis from './api/queue/queue.repository/queueRedis.js';
import PatientSQL from './api/patient/patient.repository/patientSQL.js';
import ResolutionSQL from './api/resolutions/resolution.repository/resolutionSQL.js';
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

    this.patientService = new PatientService(this.patientRepository);
    this.queueService = new QueueService(this.queueRepository);
    this.jwtService = new JwtService();
    this.authenticationService = new AuthenticationService(this.authenticationRepository);
    this.resolutionService = new ResolutionService(this.resolutionRepository);

    this.authenticationController = new AuthenticationController(
      this.authenticationService,
      this.patientService,
      this.jwtService,
    );
    this.queueController = new QueueController(this.queueService, this.patientService);
    this.resolutionController = new ResolutionController(
      this.resolutionService,
      this.queueService,
      this.patientService,
    );
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
