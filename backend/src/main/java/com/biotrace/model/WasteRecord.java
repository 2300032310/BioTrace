package com.biotrace.model;

import com.biotrace.enums.WasteStatus;
import com.biotrace.enums.WasteType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "waste_records")
public class WasteRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Enumerated(EnumType.STRING)
    @Column(name = "waste_type", nullable = false)
    private WasteType wasteType;

    @Column(name = "quantity_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal quantityKg;

    @Column(name = "generation_date", nullable = false)
    private LocalDate generationDate;

    @Column(name = "generation_time", nullable = false)
    private LocalTime generationTime;

    @Column(name = "department")
    private String department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WasteStatus status;

    @Column(name = "generated_by")
    private Long generatedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relationship field for JPA mapping - ignored in JSON to prevent circular references
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", insertable = false, updatable = false)
    private Hospital hospital;

    // Constructors
    public WasteRecord() {
    }

    public WasteRecord(Long id, Long hospitalId, WasteType wasteType, BigDecimal quantityKg,
                      LocalDate generationDate, LocalTime generationTime, String department,
                      WasteStatus status, Long generatedBy, LocalDateTime createdAt) {
        this.id = id;
        this.hospitalId = hospitalId;
        this.wasteType = wasteType;
        this.quantityKg = quantityKg;
        this.generationDate = generationDate;
        this.generationTime = generationTime;
        this.department = department;
        this.status = status;
        this.generatedBy = generatedBy;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public WasteType getWasteType() {
        return wasteType;
    }

    public void setWasteType(WasteType wasteType) {
        this.wasteType = wasteType;
    }

    public BigDecimal getQuantityKg() {
        return quantityKg;
    }

    public void setQuantityKg(BigDecimal quantityKg) {
        this.quantityKg = quantityKg;
    }

    public LocalDate getGenerationDate() {
        return generationDate;
    }

    public void setGenerationDate(LocalDate generationDate) {
        this.generationDate = generationDate;
    }

    public LocalTime getGenerationTime() {
        return generationTime;
    }

    public void setGenerationTime(LocalTime generationTime) {
        this.generationTime = generationTime;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public WasteStatus getStatus() {
        return status;
    }

    public void setStatus(WasteStatus status) {
        this.status = status;
    }

    public Long getGeneratedBy() {
        return generatedBy;
    }

    public void setGeneratedBy(Long generatedBy) {
        this.generatedBy = generatedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }
}
