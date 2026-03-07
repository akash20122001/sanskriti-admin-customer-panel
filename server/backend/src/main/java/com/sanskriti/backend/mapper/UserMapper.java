package com.sanskriti.backend.mapper;

import com.sanskriti.backend.dto.response.UserResponse;
import com.sanskriti.backend.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}
