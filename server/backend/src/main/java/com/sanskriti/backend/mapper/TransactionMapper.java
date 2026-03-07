package com.sanskriti.backend.mapper;

import com.sanskriti.backend.dto.response.TransactionResponse;
import com.sanskriti.backend.entity.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    TransactionResponse toResponse(Transaction transaction);
}
