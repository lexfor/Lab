import ResolutionService from '../api/resolutions/resolution.service';
import ResolutionRepository from '../api/resolutions/resolution.repository';

jest.mock('../api/resolutions/resolution.repository');

describe('resolution service unit tests', () => {
  const resolutionRepository = new ResolutionRepository();
  const resolutionService = new ResolutionService(
    resolutionRepository,
  );

  test('get resolution', async () => {
    resolutionRepository.get.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: '2222', value: 'Good' };
    });
    const result = await resolutionService.getResolution('1111');
    expect(result.patient_id).toEqual('1111');
    expect(result.value).toEqual('Good');
  });

  test('added new resolution for patient', async () => {
    resolutionRepository.create.mockImplementation((patientID, resolution, time) => {
      expect(patientID).toEqual('1111');
      expect(resolution).toEqual('aaaaaa');
      expect(time).toEqual(process.env.TTL_DELAY);
      return { id: '234', value: 'Good' };
    });
    const result = await resolutionService.addResolution('aaaaaa', '1111', process.env.TTL_DELAY);
    expect(result.id).toEqual('234');
    expect(result.value).toEqual('Good');
  });

  test('deleted all resolutions for that patients', async () => {
    resolutionRepository.delete.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: patientID };
    });
    const result = await resolutionService.deleteResolution('1111');
    expect(result.id).toEqual('1111');
  });
});
