package com.sanskriti.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateSettingsRequest {

    private String companyPan;

    private String companyGst;

    private List<String> sellingPlatforms;

    private List<String> deliveryPartners;
}
