package com.biotrace.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionCompleteRequest {

    @NotNull(message = "Collection request ID is required")
    private Long collectionRequestId;
}
