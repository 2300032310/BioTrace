package com.biotrace.controller;

import com.biotrace.dto.request.DisposalRequest;
import com.biotrace.dto.response.MessageResponse;
import com.biotrace.model.DisposalRecord;
import com.biotrace.model.User;
import com.biotrace.repository.UserRepository;
import com.biotrace.service.DisposalRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disposals")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DisposalRecordController {

    @Autowired
    private DisposalRecordService disposalRecordService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('COLLECTION_AGENCY')")
    public ResponseEntity<?> createDisposalRecord(
            @Valid @RequestBody DisposalRequest request,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            DisposalRecord record = disposalRecordService.createDisposalRecord(request, currentUser);
            return ResponseEntity.ok().body(record);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllDisposalRecords() {
        try {
            List<DisposalRecord> records = disposalRecordService.getAllDisposalRecords();
            return ResponseEntity.ok().body(records);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDisposalRecordById(@PathVariable Long id) {
        try {
            DisposalRecord record = disposalRecordService.getDisposalRecordById(id);
            return ResponseEntity.ok().body(record);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/waste/{wasteRecordId}")
    public ResponseEntity<?> getDisposalByWasteRecordId(@PathVariable Long wasteRecordId) {
        try {
            DisposalRecord record = disposalRecordService.getDisposalByWasteRecordId(wasteRecordId);
            return ResponseEntity.ok().body(record);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}