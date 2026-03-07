package com.sanskriti.backend.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sanskriti.backend.annotation.SuccessMessage;
import com.sanskriti.backend.dto.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * Auto-wraps all controller return values in BaseResponse.
 *
 * Before (verbose):
 *   public ResponseEntity<BaseResponse<AuthResponse>> login(...) {
 *       return ResponseEntity.ok(BaseResponse.success(response, "Login successful"));
 *   }
 *
 * After (clean):
 *   @SuccessMessage("Login successful")
 *   public AuthResponse login(...) {
 *       return authService.login(request);
 *   }
 *
 * The advice intercepts every controller return and wraps it:
 *   - Object returns → BaseResponse.success(data, message)
 *   - String returns → BaseResponse.success(stringAsMessage) (serialized manually)
 *   - BaseResponse returns → skipped (already wrapped, e.g. error handlers)
 *   - null returns → BaseResponse.success(message)
 */
@RestControllerAdvice
@RequiredArgsConstructor
public class ResponseWrapperAdvice implements ResponseBodyAdvice<Object> {

    private final ObjectMapper objectMapper;

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response
    ) {
        if (body instanceof BaseResponse) {
            return body;
        }

        String message = "Success";
        SuccessMessage annotation = returnType.getMethodAnnotation(SuccessMessage.class);
        if (annotation != null) {
            message = annotation.value();
        }

        if (body instanceof String stringBody) {
            response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
            BaseResponse<Void> wrapped = BaseResponse.success(stringBody.isEmpty() ? message : stringBody);
            try {
                return objectMapper.writeValueAsString(wrapped);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize response", e);
            }
        }

        if (body == null) {
            return BaseResponse.success(message);
        }

        return BaseResponse.success(body, message);
    }
}
