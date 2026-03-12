package com.biotrace.repository;

import com.biotrace.model.WasteRecord;
import com.biotrace.enums.WasteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WasteRecordRepository extends JpaRepository<WasteRecord, Long> {

    List<WasteRecord> findByHospitalId(Long hospitalId);

    List<WasteRecord> findByStatus(WasteStatus status);

    List<WasteRecord> findByGeneratedBy(Long generatedBy);

    List<WasteRecord> findByHospitalIdAndStatus(Long hospitalId, WasteStatus status);
}
