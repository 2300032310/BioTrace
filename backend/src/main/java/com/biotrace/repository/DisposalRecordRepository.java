package com.biotrace.repository;

import com.biotrace.model.DisposalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DisposalRecordRepository extends JpaRepository<DisposalRecord, Long> {

    Optional<DisposalRecord> findByWasteRecordId(Long wasteRecordId);

    List<DisposalRecord> findByDisposedBy(Long disposedBy);

    boolean existsByWasteRecordId(Long wasteRecordId);
}
