package com.biotrace.service;

import com.biotrace.enums.Priority;
import com.biotrace.enums.RequestStatus;
import com.biotrace.enums.WasteStatus;
import com.biotrace.exception.ResourceNotFoundException;
import com.biotrace.model.CollectionRequest;
import com.biotrace.model.User;
import com.biotrace.model.WasteRecord;
import com.biotrace.repository.CollectionRequestRepository;
import com.biotrace.repository.WasteRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CollectionRequestService {

    @Autowired
    private CollectionRequestRepository collectionRequestRepository;

    @Autowired
    private WasteRecordRepository wasteRecordRepository;

    public List<CollectionRequest> getAllCollectionRequests(User currentUser) {
        return collectionRequestRepository.findAll();
    }

    public CollectionRequest getCollectionRequestById(Long id) {
        return collectionRequestRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Collection request not found"));
    }

    @Transactional
    public CollectionRequest assignCollection(Long requestId, Long userId) {
        CollectionRequest request = getCollectionRequestById(requestId);
        request.setAssignedTo(userId);
        request.setStatus(RequestStatus.SCHEDULED);
        request.setScheduledPickupDate(LocalDateTime.now().plusHours(24));
        return collectionRequestRepository.save(request);
    }

    @Transactional
    public CollectionRequest markCollected(Long requestId) {
        CollectionRequest request = getCollectionRequestById(requestId);
        request.setStatus(RequestStatus.COMPLETED);

        WasteRecord wasteRecord = wasteRecordRepository.findById(request.getWasteRecordId())
            .orElseThrow(() -> new ResourceNotFoundException("Waste record not found"));
        wasteRecord.setStatus(WasteStatus.COLLECTED);
        wasteRecordRepository.save(wasteRecord);

        return collectionRequestRepository.save(request);
    }

    public Priority calculatePriority(WasteRecord wasteRecord) {
        return Priority.NORMAL;
    }
}