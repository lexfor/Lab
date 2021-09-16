import { DoctorService, DoctorController } from '../api/doctor';

jest.mock('../api/doctor/service/doctor.service');

describe('doctor controller unit tests', () => {
  const doctorService = new DoctorService();
  const doctorController = new DoctorController(doctorService);

  test('get all specializations', async () => {
    doctorService.getAllSpecializations.mockResolvedValue(['surgeon', 'therapist']);
    const res = await doctorController.getAllSpecialization();
    expect(res.getValue[0]).toEqual('surgeon');
    expect(res.getValue[1]).toEqual('therapist');
  });

  test('get all doctors with that specialization', async () => {
    doctorService.allDoctorsBySpecializations.mockResolvedValue([
      { id: '2222', name: 'Tim' },
      { id: '3333', name: 'Oleg' },
    ]);
    const res = await doctorController.allDoctorsBySpecializations('1111');
    expect(res.getValue[0].id).toEqual('2222');
    expect(res.getValue[0].name).toEqual('Tim');
    expect(res.getValue[1].id).toEqual('3333');
    expect(res.getValue[1].name).toEqual('Oleg');
  });
});
