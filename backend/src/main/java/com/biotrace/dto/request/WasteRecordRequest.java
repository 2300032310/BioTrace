package com.biotrace.dto.request;

import com.biotrace.enums.WasteType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WasteRecordRequest {
    
    @NotNull(message = "Hospital ID is required")
    private Long hospitalId;
    
    @NotNull(message = "Waste type is required")
    private WasteType wasteType;
    
    @NotNull(message = "Quantity is required")
    private BigDecimal quantityKg;
    
    @NotNull(message = "Generation date is required")
    private LocalDate generationDate;
    
    @NotNull(message = "Generation time is required")
    private LocalTime generationTime;
    
    private String department;

    // Getters and Setters
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
}