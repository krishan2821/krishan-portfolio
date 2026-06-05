// REST controller exposing the contact form endpoint at /api/v1/contact
package com.portfolio.controller;

import com.portfolio.dto.ContactRequestDTO;
import com.portfolio.exception.ContactValidationException;
import com.portfolio.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** Handles HTTP requests for contact form submissions. */
@RestController
@RequestMapping("/api/v1/contact")
@CrossOrigin(origins = {"http://localhost:3000", "${FRONTEND_ORIGIN:https://khatarnak.dev}"})
@RequiredArgsConstructor
@Slf4j
public class ContactController {

    private final ContactService contactService;

    /**
     * Accepts and persists a new contact form submission.
     *
     * @param dto validated request body containing name, email, and message
     * @return 201 Created on success, 400 Bad Request on validation failure
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> submitContact(
            @Valid @RequestBody ContactRequestDTO dto) {
        log.debug("POST /api/v1/contact — from: {}", dto.getEmail());
        try {
            contactService.saveContact(dto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of("message", "Your message has been received. I'll get back to you soon!"));
        } catch (ContactValidationException e) {
            log.warn("Contact validation failed: {}", e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error handling POST /api/v1/contact: {}", e.getMessage(), e);
            return ResponseEntity
                    .internalServerError()
                    .body(Map.of("error", "An unexpected error occurred. Please try again."));
        }
    }
}
