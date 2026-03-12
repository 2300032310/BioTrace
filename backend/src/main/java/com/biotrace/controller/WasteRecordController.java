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
            
            // Simple stats for now
            List<WasteRecord> allRecords = wasteRecordService.getAllWasteRecords(currentUser);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalWaste", allRecords.size());
            stats.put("pendingCollections", allRecords.stream()
                .filter(w -> w.getStatus() == WasteStatus.PENDING).count());
            stats.put("completedCollections", allRecords.stream()
                .filter(w -> w.getStatus() == WasteStatus.DISPOSED).count());
            
            return ResponseEntity.ok().body(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}