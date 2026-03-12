package com.biotrace.controller;

import com.biotrace.dto.request.CollectionAssignRequest;
import com.biotrace.dto.response.MessageResponse;
import com.biotrace.model.CollectionRequest;
import com.biotrace.model.User;
import com.biotrace.repository.CollectionRequestRepository;
import com.biotrace.service.CollectionRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.biotrace.enums.RequestStatus;

@RestController
@RequestMapping("/api/collections")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CollectionRequestController {

    @Autowired
    private CollectionRequestService collectionRequestService;

    @Autowired
    private CollectionRequestRepository collectionRequestRepository;

    @GetMapping
    public ResponseEntity<List<CollectionRequest>> getAllCollectionRequests(Authentication authentication) {
        try {
            List<CollectionRequest> requests = collectionRequestService.getAllCollectionRequests(null);
            return ResponseEntity.ok().body(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionRequest> getCollectionRequestById(@PathVariable Long id) {
        try {
            CollectionRequest request = collectionRequestService.getCollectionRequestById(id);
            return ResponseEntity.ok().body(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('COLLECTION_AGENCY')")
    public ResponseEntity<CollectionRequest> assignCollection(
            @PathVariable Long id,
            @RequestBody CollectionAssignRequest assignRequest,
            Authentication authentication) {
        try {
            CollectionRequest request = collectionRequestService.assignCollection(
                id,
                assignRequest.getAssignedToUserId()
            );
            return ResponseEntity.ok().body(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('COLLECTION_AGENCY')")
    public ResponseEntity<CollectionRequest> markCollectionComplete(@PathVariable Long id) {
        try {
            CollectionRequest request = collectionRequestService.markCollected(id);
            return ResponseEntity.ok().body(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
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