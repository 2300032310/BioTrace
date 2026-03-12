package com.biotrace.repository;

import com.biotrace.model.CollectionRequest;
import com.biotrace.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionRequestRepository extends JpaRepository<CollectionRequest, Long> {

    List<CollectionRequest> findByStatus(RequestStatus status);

    List<CollectionRequest> findByAssignedTo(Long assignedTo);

    List<CollectionRequest> findByHospitalId(Long hospitalId);

    Optional<CollectionRequest> findByWasteRecordId(Long wasteRecordId);

    List<CollectionRequest> findByHospitalIdAndStatus(Long hospitalId, RequestStatus status);
}
