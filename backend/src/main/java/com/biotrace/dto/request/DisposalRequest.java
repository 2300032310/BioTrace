package com.biotrace.dto.request;

import com.biotrace.enums.DisposalMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisposalRequest {
    
    @NotNull(message = "Waste record ID is required")
    private Long wasteRecordId;
    
    @NotNull(message = "Disposal date is required")
    private LocalDateTime disposalDate;
    
    @NotNull(message = "Disposal method is required")
    private DisposalMethod disposalMethod;
    
    @NotNull(message = "Disposal facility is required")
    private String disposalFacility;
    
    private String certificateUrl;

    // Getters and Setters
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
}