import {
  AuthenticationRepository,
  AuthenticationService,
  AuthenticationController,
  JwtService,
} from './api/authentication';
import { PatientController, PatientRepository, PatientService } from './api/patient';
import { ResolutionService, ResolutionRepository, ResolutionController } from './api/resolutions';
import { QueueService, QueueRepository } from './api/queue';
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
    this.patientController = new PatientController(this.queueService, this.patientService);
    this.resolutionController = new ResolutionController(
      this.resolutionService,
      this.queueService,
      this.patientService,
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
}

const injector = new Injector();
export { injector };
