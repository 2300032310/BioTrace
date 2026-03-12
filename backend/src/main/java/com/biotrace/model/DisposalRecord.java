package com.biotrace.model;

import com.biotrace.enums.DisposalMethod;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "disposal_records")
public class DisposalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "waste_record_id", unique = true, nullable = false)
    private Long wasteRecordId;

    @Column(name = "disposal_date", nullable = false)
    private LocalDateTime disposalDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "disposal_method", nullable = false)
    private DisposalMethod disposalMethod;

    @Column(name = "disposal_facility", nullable = false)
    private String disposalFacility;

    @Column(name = "certificate_url")
    private String certificateUrl;

    @Column(name = "disposed_by")
    private Long disposedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public DisposalRecord() {
    }

    public DisposalRecord(Long id, Long wasteRecordId, LocalDateTime disposalDate, DisposalMethod disposalMethod,
                         String disposalFacility, String certificateUrl, Long disposedBy, LocalDateTime createdAt) {
        this.id = id;
        this.wasteRecordId = wasteRecordId;
        this.disposalDate = disposalDate;
        this.disposalMethod = disposalMethod;
        this.disposalFacility = disposalFacility;
        this.certificateUrl = certificateUrl;
        this.disposedBy = disposedBy;
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

    public LocalDateTime getDisposalDate() {
        return disposalDate;
    }

    public void setDisposalDate(LocalDateTime disposalDate) {
        this.disposalDate = disposalDate;
    }

    public DisposalMethod getDisposalMethod() {
        return disposalMethod;
    }

    public void setDisposalMethod(DisposalMethod disposalMethod) {
        this.disposalMethod = disposalMethod;
    }

    public String getDisposalFacility() {
        return disposalFacility;
    }

    public void setDisposalFacility(String disposalFacility) {
        this.disposalFacility = disposalFacility;
    }

    public String getCertificateUrl() {
        return certificateUrl;
    }

    public void setCertificateUrl(String certificateUrl) {
        this.certificateUrl = certificateUrl;
    }

    public Long getDisposedBy() {
        return disposedBy;
    }

    public void setDisposedBy(Long disposedBy) {
        this.disposedBy = disposedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}