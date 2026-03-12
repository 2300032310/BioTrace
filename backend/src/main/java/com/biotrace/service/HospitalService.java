package com.biotrace.service;

import com.biotrace.exception.ResourceNotFoundException;
import com.biotrace.model.Hospital;
import com.biotrace.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Hospital getHospitalById(Long id) {
        return hospitalRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));
    }

    public Hospital createHospital(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    public Hospital updateHospital(Long id, Hospital hospitalDetails) {
        Hospital hospital = getHospitalById(id);
        hospital.setName(hospitalDetails.getName());
        hospital.setAddress(hospitalDetails.getAddress());
        hospital.setContactPerson(hospitalDetails.getContactPerson());
        hospital.setPhone(hospitalDetails.getPhone());
        hospital.setEmail(hospitalDetails.getEmail());
        hospital.setRegistrationNumber(hospitalDetails.getRegistrationNumber());
        return hospitalRepository.save(hospital);
    }

    public void deleteHospital(Long id) {
        Hospital hospital = getHospitalById(id);
        hospitalRepository.delete(hospital);
    }
}