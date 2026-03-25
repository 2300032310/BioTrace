package com.biotrace.service;

import com.biotrace.dto.request.WasteRecordRequest;
import com.biotrace.enums.Priority;
import com.biotrace.enums.RequestStatus;
import com.biotrace.enums.UserRole;
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
public class WasteRecordService {

    @Autowired
    private WasteRecordRepository wasteRecordRepository;

    @Autowired
    private CollectionRequestRepository collectionRequestRepository;

    @Transactional
    public WasteRecord createWasteRecord(WasteRecordRequest request, User currentUser) {
        WasteRecord wasteRecord = new WasteRecord();
        wasteRecord.setHospitalId(request.getHospitalId());
        wasteRecord.setWasteType(request.getWasteType());
        wasteRecord.setQuantityKg(request.getQuantityKg());
        wasteRecord.setGenerationDate(request.getGenerationDate());
        wasteRecord.setGenerationTime(request.getGenerationTime());
        wasteRecord.setDepartment(request.getDepartment());
        wasteRecord.setStatus(WasteStatus.PENDING);
        wasteRecord.setGeneratedBy(currentUser.getId());

        WasteRecord savedWaste = wasteRecordRepository.save(wasteRecord);

        CollectionRequest collectionRequest = new CollectionRequest();
        collectionRequest.setWasteRecordId(savedWaste.getId());
        collectionRequest.setHospitalId(savedWaste.getHospitalId());
        collectionRequest.setRequestedDate(LocalDateTime.now());
        collectionRequest.setStatus(RequestStatus.PENDING);
        collectionRequest.setPriority(Priority.NORMAL);
        collectionRequestRepository.save(collectionRequest);

        return savedWaste;
    }

    public List<WasteRecord> getAllWasteRecords(User currentUser) {
        // If currentUser is null (for admin/agency) or ADMIN role, return all records
        if (currentUser == null || currentUser.getRole() == UserRole.ADMIN || currentUser.getRole() == UserRole.COLLECTION_AGENCY) {
            return wasteRecordRepository.findAll();
        }
        
        // For hospital staff, return only their hospital's records
        if (currentUser.getRole() == UserRole.HOSPITAL_STAFF && currentUser.getHospitalId() != null) {
            return wasteRecordRepository.findByHospitalId(currentUser.getHospitalId());
        }
        
        // Default: return all (shouldn't reach here normally)
        return wasteRecordRepository.findAll();
    }

    public WasteRecord getWasteRecordById(Long id) {
        return wasteRecordRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Waste record not found"));
    }

    public WasteRecord updateWasteStatus(Long id, WasteStatus status) {
        WasteRecord wasteRecord = getWasteRecordById(id);
        wasteRecord.setStatus(status);
        return wasteRecordRepository.save(wasteRecord);
    }

    public List<WasteRecord> getWasteByHospitalId(Long hospitalId) {
        return wasteRecordRepository.findByHospitalId(hospitalId);
    }
}