package com.biotrace.controller;

import com.biotrace.dto.request.CollectionAssignRequest;
import com.biotrace.dto.response.CollectionRequestResponse;
import com.biotrace.dto.response.MessageResponse;
import com.biotrace.model.CollectionRequest;
import com.biotrace.model.Hospital;
import com.biotrace.model.User;
import com.biotrace.model.WasteRecord;
import com.biotrace.repository.CollectionRequestRepository;
import com.biotrace.repository.HospitalRepository;
import com.biotrace.repository.WasteRecordRepository;
import com.biotrace.service.CollectionRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.biotrace.enums.RequestStatus;

@RestController
@RequestMapping("/api/collections")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CollectionRequestController {

    @Autowired
    private CollectionRequestService collectionRequestService;

    @Autowired
    private CollectionRequestRepository collectionRequestRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private WasteRecordRepository wasteRecordRepository;

    @GetMapping
    public ResponseEntity<List<CollectionRequestResponse>> getAllCollectionRequests(Authentication authentication) {
        try {
            List<CollectionRequest> requests = collectionRequestService.getAllCollectionRequests(null);
            
            // Map to response with joined data
            List<CollectionRequestResponse> responseList = requests.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok().body(responseList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionRequestResponse> getCollectionRequestById(@PathVariable Long id) {
        try {
            CollectionRequest request = collectionRequestService.getCollectionRequestById(id);
            return ResponseEntity.ok().body(mapToResponse(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('COLLECTION_AGENCY')")
    public ResponseEntity<CollectionRequestResponse> assignCollection(
            @PathVariable Long id,
            @RequestBody CollectionAssignRequest assignRequest,
            Authentication authentication) {
        try {
            CollectionRequest request = collectionRequestService.assignCollection(
                id,
                assignRequest.getAssignedToUserId()
            );
            return ResponseEntity.ok().body(mapToResponse(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('COLLECTION_AGENCY')")
    public ResponseEntity<CollectionRequestResponse> markCollectionComplete(@PathVariable Long id) {
        try {
            CollectionRequest request = collectionRequestService.markCollected(id);
            return ResponseEntity.ok().body(mapToResponse(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Helper method to map CollectionRequest to CollectionRequestResponse
    private CollectionRequestResponse mapToResponse(CollectionRequest request) {
        CollectionRequestResponse response = new CollectionRequestResponse();
        response.setId(request.getId());
        response.setWasteRecordId(request.getWasteRecordId());
        response.setHospitalId(request.getHospitalId());
        response.setRequestedDate(request.getRequestedDate());
        response.setScheduledPickupDate(request.getScheduledPickupDate());
        response.setAssignedTo(request.getAssignedTo());
        response.setStatus(request.getStatus());
        response.setPriority(request.getPriority());
        response.setCreatedAt(request.getCreatedAt());
        
        // Fetch hospital name
        if (request.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(request.getHospitalId()).orElse(null);
            if (hospital != null) {
                response.setHospitalName(hospital.getName());
            }
        }
        
        // Fetch waste type and quantity from waste record
        if (request.getWasteRecordId() != null) {
            WasteRecord wasteRecord = wasteRecordRepository.findById(request.getWasteRecordId()).orElse(null);
            if (wasteRecord != null) {
                response.setWasteType(wasteRecord.getWasteType());
                response.setQuantityKg(wasteRecord.getQuantityKg());
            }
        }
        
        return response;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getCollectionStats(Authentication authentication) {
        try {
            Map<String, Object> stats = new HashMap<>();
            List<CollectionRequest> allRequests = collectionRequestRepository.findAll();
            
            stats.put("pendingPickupsToday", allRequests.stream()
                .filter(r -> r.getStatus() == RequestStatus.PENDING).count());
            stats.put("completedThisWeek", allRequests.stream()
                .filter(r -> r.getStatus() == RequestStatus.COMPLETED).count());
            stats.put("totalWasteCollected", allRequests.size());
            
            return ResponseEntity.ok().body(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}