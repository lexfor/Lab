import { DoctorService, DoctorRepository } from '../index';

jest.mock('../repository/doctor.repository');

describe('doctor service unit tests', () => {
  const doctorRepository = new DoctorRepository();
  const doctorService = new DoctorService(doctorRepository);

  test('get all specializations', async () => {
    doctorRepository.getAllSpecializations.mockResolvedValue(['surgeon', 'therapist']);
    const res = await doctorService.getAllSpecializations();
    expect(res[0]).toEqual('surgeon');
    expect(res[1]).toEqual('therapist');
  });

  test('get all doctors with that specialization', async () => {
    doctorRepository.getAllDoctorsBySpecializations.mockResolvedValue([
      { id: '2222', name: 'Tim' },
      { id: '3333', name: 'Oleg' },
    ]);
    const res = await doctorService.getAllDoctorsBySpecializations('1111');
    expect(res[0].id).toEqual('2222');
    expect(res[0].name).toEqual('Tim');
    expect(res[1].id).toEqual('3333');
    expect(res[1].name).toEqual('Oleg');
  });

  test('get doctor by id', async () => {
    doctorRepository.getDoctorByID.mockResolvedValue({ id: '2222', name: 'Tim' });
    const res = await doctorService.getDoctorByID('1111');
    expect(res.id).toEqual('2222');
    expect(res.name).toEqual('Tim');
  });
});
