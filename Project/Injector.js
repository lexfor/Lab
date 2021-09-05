import AuthenticationController from './api/authentication/authentication.controller';
import QueueController from './api/queue/queue.controller';
import ResolutionController from './api/resolutions/resolution.controller';
import AuthenticationService from './api/authentication/authentication.service';
import ResolutionService from './api/resolutions/resolution.service';
import PatientService from './api/patient/patient.service';
import QueueService from './api/queue/queue.service';
import JwtService from './api/authentication/authentication.service/jwtService';
import AuthenticationRepository from './api/authentication/authentication.repository';
import QueueRepository from './api/queue/queue.repository';
import PatientRepository from './api/patient/patient.repository';
import ResolutionRepository from './api/resolutions/resolution.repository';
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
    client.flushdb();
    this.queueRepository = new QueueRepository(client);
    this.authenticationRepository = new AuthenticationRepository(connection);

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
