package com.biotrace.controller;

import com.biotrace.dto.response.MessageResponse;
import com.biotrace.exception.ResourceNotFoundException;
import com.biotrace.model.Hospital;
import com.biotrace.model.WasteRecord;
import com.biotrace.repository.HospitalRepository;
import com.biotrace.repository.WasteRecordRepository;
import com.biotrace.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private WasteRecordRepository wasteRecordRepository;

    @GetMapping
    public ResponseEntity<?> getAllHospitals() {
        try {
            List<Hospital> hospitals = hospitalService.getAllHospitals();
            return ResponseEntity.ok().body(hospitals);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createHospital(@RequestBody Hospital hospital) {
        try {
            Hospital created = hospitalService.createHospital(hospital);
            return ResponseEntity.ok().body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHospitalById(@PathVariable Long id) {
        try {
            Hospital hospital = hospitalService.getHospitalById(id);
            return ResponseEntity.ok().body(hospital);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateHospital(@PathVariable Long id, @RequestBody Hospital hospitalDetails) {
        try {
            Hospital updated = hospitalService.updateHospital(id, hospitalDetails);
            return ResponseEntity.ok().body(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteHospital(@PathVariable Long id) {
        try {
            hospitalService.deleteHospital(id);
            return ResponseEntity.ok().body(new MessageResponse("Hospital deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getHospitalStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            List<Hospital> allHospitals = hospitalRepository.findAll();
            List<WasteRecord> allWaste = wasteRecordRepository.findAll();
            
            stats.put("totalHospitals", allHospitals.size());
            stats.put("totalWasteThisMonth", allWaste.size());
            stats.put("complianceRate", 95.0);
            stats.put("violations", 0);
            
            return ResponseEntity.ok().body(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}