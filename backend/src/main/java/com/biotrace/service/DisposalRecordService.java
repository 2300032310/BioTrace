package com.biotrace.service;

import com.biotrace.dto.request.DisposalRequest;
import com.biotrace.enums.WasteStatus;
import com.biotrace.exception.ResourceNotFoundException;
import com.biotrace.model.DisposalRecord;
import com.biotrace.model.User;
import com.biotrace.model.WasteRecord;
import com.biotrace.repository.DisposalRecordRepository;
import com.biotrace.repository.WasteRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DisposalRecordService {

    @Autowired
    private DisposalRecordRepository disposalRecordRepository;

    @Autowired
    private WasteRecordRepository wasteRecordRepository;

    @Transactional
    public DisposalRecord createDisposalRecord(DisposalRequest request, User currentUser) {
        DisposalRecord disposal = new DisposalRecord();
        disposal.setWasteRecordId(request.getWasteRecordId());
        disposal.setDisposalDate(request.getDisposalDate());
        disposal.setDisposalMethod(request.getDisposalMethod());
        disposal.setDisposalFacility(request.getDisposalFacility());
        disposal.setCertificateUrl(request.getCertificateUrl());
        disposal.setDisposedBy(currentUser.getId());

        WasteRecord wasteRecord = wasteRecordRepository.findById(request.getWasteRecordId())
            .orElseThrow(() -> new ResourceNotFoundException("Waste record not found"));
        wasteRecord.setStatus(WasteStatus.DISPOSED);
        wasteRecordRepository.save(wasteRecord);

        return disposalRecordRepository.save(disposal);
    }

    public List<DisposalRecord> getAllDisposalRecords() {
        return disposalRecordRepository.findAll();
    }

    public DisposalRecord getDisposalRecordById(Long id) {
        return disposalRecordRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Disposal record not found"));
    }

    public DisposalRecord getDisposalByWasteRecordId(Long wasteRecordId) {
        return disposalRecordRepository.findByWasteRecordId(wasteRecordId)
            .orElseThrow(() -> new ResourceNotFoundException("Disposal record not found"));
    }
}