package com.sanskriti.backend.mapper;

import com.sanskriti.backend.dto.response.BillResponse;
import com.sanskriti.backend.entity.Bill;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BillMapper {
    BillResponse toResponse(Bill bill);
}
