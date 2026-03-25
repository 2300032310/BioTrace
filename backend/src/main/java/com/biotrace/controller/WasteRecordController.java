package com.biotrace.controller;

import com.biotrace.dto.request.WasteRecordRequest;
import com.biotrace.dto.response.MessageResponse;
import com.biotrace.enums.WasteStatus;
import com.biotrace.model.User;
import com.biotrace.model.WasteRecord;
import com.biotrace.repository.UserRepository;
import com.biotrace.service.WasteRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/waste")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class WasteRecordController {

    @Autowired
    private WasteRecordService wasteRecordService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('HOSPITAL_STAFF')")
    public ResponseEntity<?> createWasteRecord(
            @Valid @RequestBody WasteRecordRequest request,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            WasteRecord wasteRecord = wasteRecordService.createWasteRecord(request, currentUser);
            return ResponseEntity.ok().body(wasteRecord);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllWasteRecords(Authentication authentication) {
        try {
            String email = authentication.getName();
            User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<WasteRecord> records = wasteRecordService.getAllWasteRecords(currentUser);
            return ResponseEntity.ok().body(records);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWasteRecordById(@PathVariable Long id) {
        try {
            WasteRecord record = wasteRecordService.getWasteRecordById(id);
            return ResponseEntity.ok().body(record);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateWasteStatus(
            @PathVariable Long id,
            @RequestParam WasteStatus status) {
        try {
            WasteRecord record = wasteRecordService.updateWasteStatus(id, status);
            return ResponseEntity.ok().body(record);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<?> getWasteByHospitalId(@PathVariable Long hospitalId) {
        try {
            List<WasteRecord> records = wasteRecordService.getWasteByHospitalId(hospitalId);
            return ResponseEntity.ok().body(records);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getWasteStats(Authentication authentication) {
        try {
            String email = authentication.getName();
            User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<WasteRecord> allRecords = wasteRecordService.getAllWasteRecords(currentUser);
            
            long totalRecords = allRecords.size();
            long pendingCount = allRecords.stream()
                .filter(w -> w.getStatus() == WasteStatus.PENDING).count();
            long disposedCount = allRecords.stream()
                .filter(w -> w.getStatus() == WasteStatus.DISPOSED).count();
            
            // Calculate total waste quantity this month (in kg)
            LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            double totalWasteThisMonth = allRecords.stream()
                .filter(w -> w.getCreatedAt() != null && w.getCreatedAt().isAfter(startOfMonth))
                .filter(w -> w.getQuantityKg() != null)
                .mapToDouble(w -> w.getQuantityKg().doubleValue()) // Convert BigDecimal to double
                .sum();
            
            // Calculate compliance rate
            int complianceRate = totalRecords > 0 ? (int) ((disposedCount * 100) / totalRecords) : 100;
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalWasteThisMonth", Math.round(totalWasteThisMonth * 100.0) / 100.0);
            stats.put("pendingCollections", pendingCount);
            stats.put("complianceRate", complianceRate);
            stats.put("totalRecords", totalRecords);
            
            return ResponseEntity.ok().body(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}