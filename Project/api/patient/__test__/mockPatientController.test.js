import { PatientService, PatientController } from '../index';
import { QueueService } from '../../queue';
import { STATUSES } from '../../../constants';

jest.mock('../service/patient.service');
jest.mock('../../queue/service/queue.service');

describe('queue controller unit tests', () => {
  const patientService = new PatientService();
  const patientController = new PatientController(patientService);

  test('find all patients', async () => {
    patientService.getAllPatients.mockImplementation((patientInfo) => {
      expect(patientInfo).toEqual('T');
      return { id: '2222', name: 'Tim' };
    });
    const res = await patientController.getAllPatients('T');
    expect(res.getValue.id).toEqual('2222');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });
});
