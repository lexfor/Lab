import { ResolutionService, ResolutionRepository } from '../index';

jest.mock('../repository/resolution.repository');

describe('resolution service unit tests', () => {
  const resolutionRepository = new ResolutionRepository();
  const resolutionService = new ResolutionService(
    resolutionRepository,
  );

  test('get all resolutions', async () => {
    resolutionRepository.getAllResolutions.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return [
        {
          id: '2222',
          value: 'Good',
          doctorName: 'Oleg',
          doctorSpecialization: 'surgeon',
        },
        {
          id: '3333',
          value: 'Bad',
          doctorName: 'Oleg',
          doctorSpecialization: 'surgeon',
        },
      ];
    });
    const result = await resolutionService.getAllResolutions('1111');
    expect(result[0].id).toEqual('2222');
    expect(result[0].value).toEqual('Good');
    expect(result[0].doctorName).toEqual('Oleg');
    expect(result[0].doctorSpecialization).toEqual('surgeon');
    expect(result[1].id).toEqual('3333');
    expect(result[1].value).toEqual('Bad');
    expect(result[1].doctorName).toEqual('Oleg');
    expect(result[1].doctorSpecialization).toEqual('surgeon');
  });

  test('added new resolution for patient', async () => {
    resolutionRepository.createResolution.mockImplementation((data) => {
      expect(data.patient_id).toEqual('1111');
      expect(data.value).toEqual('aaaaaa');
      expect(data.delay).toEqual(process.env.TTL_DELAY);
      return { id: '234', value: 'Good' };
    });
    const result = await resolutionService.addResolution({
      value: 'aaaaaa',
      patient_id: '1111',
      delay: process.env.TTL_DELAY,
    });
    expect(result.id).toEqual('234');
    expect(result.value).toEqual('Good');
  });

  test('deleted all resolutions for that patients', async () => {
    resolutionRepository.deleteResolution.mockImplementation((resolutionID) => {
      expect(resolutionID).toEqual('1111');
      return { id: resolutionID };
    });
    const result = await resolutionService.deleteResolution('1111');
    expect(result.id).toEqual('1111');
  });
});
