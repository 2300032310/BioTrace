package com.biotrace.model;

import com.biotrace.enums.Priority;
import com.biotrace.enums.RequestStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "collection_requests")
public class CollectionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "waste_record_id", unique = true, nullable = false)
    private Long wasteRecordId;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "requested_date", nullable = false)
    private LocalDateTime requestedDate;

    @Column(name = "scheduled_pickup_date")
    private LocalDateTime scheduledPickupDate;

    @Column(name = "assigned_to")
    private Long assignedTo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public CollectionRequest() {
    }

    public CollectionRequest(Long id, Long wasteRecordId, Long hospitalId, LocalDateTime requestedDate,
                           LocalDateTime scheduledPickupDate, Long assignedTo, RequestStatus status,
                           Priority priority, LocalDateTime createdAt) {
        this.id = id;
        this.wasteRecordId = wasteRecordId;
        this.hospitalId = hospitalId;
        this.requestedDate = requestedDate;
        this.scheduledPickupDate = scheduledPickupDate;
        this.assignedTo = assignedTo;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getWasteRecordId() {
        return wasteRecordId;
    }

    public void setWasteRecordId(Long wasteRecordId) {
        this.wasteRecordId = wasteRecordId;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public LocalDateTime getRequestedDate() {
        return requestedDate;
    }

    public void setRequestedDate(LocalDateTime requestedDate) {
        this.requestedDate = requestedDate;
    }

    public LocalDateTime getScheduledPickupDate() {
        return scheduledPickupDate;
    }

    public void setScheduledPickupDate(LocalDateTime scheduledPickupDate) {
        this.scheduledPickupDate = scheduledPickupDate;
    }

    public Long getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(Long assignedTo) {
        this.assignedTo = assignedTo;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}