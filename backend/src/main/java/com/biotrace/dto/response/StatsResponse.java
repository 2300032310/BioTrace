package com.biotrace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {
    private BigDecimal totalWaste;
    private Integer pendingCollections;
    private Integer completedCollections;
    private Double complianceRate;
    private Integer violations;

    // Getters and Setters
    public BigDecimal getTotalWaste() {
        return totalWaste;
    }

    public void setTotalWaste(BigDecimal totalWaste) {
        this.totalWaste = totalWaste;
    }

    public Integer getPendingCollections() {
        return pendingCollections;
    }

    public void setPendingCollections(Integer pendingCollections) {
        this.pendingCollections = pendingCollections;
    }

    public Integer getCompletedCollections() {
        return completedCollections;
    }

    public void setCompletedCollections(Integer completedCollections) {
        this.completedCollections = completedCollections;
    }

    public Double getComplianceRate() {
        return complianceRate;
    }

    public void setComplianceRate(Double complianceRate) {
        this.complianceRate = complianceRate;
    }

    public Integer getViolations() {
        return violations;
    }

    public void setViolations(Integer violations) {
        this.violations = violations;
    }
}