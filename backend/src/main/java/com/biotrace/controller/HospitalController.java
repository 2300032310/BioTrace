package com.biotrace.controller;

import com.biotrace.dto.response.MessageResponse;
import com.biotrace.enums.WasteStatus;
import com.biotrace.model.Hospital;
import com.biotrace.model.WasteRecord;
import com.biotrace.repository.HospitalRepository;
import com.biotrace.repository.WasteRecordRepository;
import com.biotrace.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
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

            // Calculate total waste this month (in kg)
            LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            double totalWasteThisMonth = allWaste.stream()
                .filter(w -> w.getCreatedAt() != null && w.getCreatedAt().isAfter(startOfMonth))
                .filter(w -> w.getQuantityKg() != null)
                .mapToDouble(w -> w.getQuantityKg().doubleValue())
                .sum();

            // Calculate violations (pending waste > 48 hours from generation)
            LocalDateTime now = LocalDateTime.now();
            long violations = allWaste.stream()
                .filter(w -> w.getStatus() == WasteStatus.PENDING)
                .filter(w -> w.getGenerationDate() != null)
                .filter(w -> {
                    // Combine generation date and time into a single LocalDateTime
                    LocalTime time = w.getGenerationTime() != null ? w.getGenerationTime() : LocalTime.of(0, 0);
                    LocalDateTime generatedDateTime = w.getGenerationDate().atTime(time);
                    long hoursSinceGeneration = ChronoUnit.HOURS.between(generatedDateTime, now);
                    return hoursSinceGeneration > 48;
                })
                .count();

            // Calculate compliance rate
            long disposedCount = allWaste.stream()
                .filter(w -> w.getStatus() == WasteStatus.DISPOSED)
                .count();
            long pendingCount = allWaste.stream()
                .filter(w -> w.getStatus() == WasteStatus.PENDING)
                .count();
            
            // Debug: print status counts
            System.out.println("DEBUG - Disposed count: " + disposedCount);
            System.out.println("DEBUG - Pending count: " + pendingCount);
            System.out.println("DEBUG - Total waste size: " + allWaste.size());
            
            // Debug: print all waste statuses
            System.out.println("DEBUG - All waste statuses:");
            for (WasteRecord w : allWaste) {
                System.out.println("  ID: " + w.getId() + ", Status: " + w.getStatus() + ", GenerationDate: " + w.getGenerationDate() + ", GenerationTime: " + w.getGenerationTime());
            }
            
            int complianceRate = allWaste.size() > 0 
                ? (int) ((disposedCount * 100) / allWaste.size()) 
                : 100;

            stats.put("totalHospitals", allHospitals.size());
            stats.put("totalWasteThisMonth", Math.round(totalWasteThisMonth * 100.0) / 100.0);
            stats.put("complianceRate", complianceRate);
            stats.put("violations", violations);

            // Debug logging
            System.out.println("========== HOSPITAL STATS ==========");
            System.out.println("Total Hospitals: " + allHospitals.size());
            System.out.println("All Waste Count: " + allWaste.size());
            System.out.println("Total Waste This Month: " + totalWasteThisMonth);
            System.out.println("Violations: " + violations);
            System.out.println("Compliance Rate: " + complianceRate);
            System.out.println("Stats Map: " + stats);
            System.out.println("====================================");

            return ResponseEntity.ok().body(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}