// Business logic layer for contact form submissions with validation
package com.portfolio.service;

import com.portfolio.dto.ContactRequestDTO;
import com.portfolio.exception.ContactValidationException;
import com.portfolio.model.Contact;
import com.portfolio.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.regex.Pattern;

/** Handles validation and persistence of contact form submissions. */
@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final ContactRepository contactRepository;

    /**
     * Validates and saves a new contact enquiry to MongoDB.
     *
     * @param dto the validated contact request payload
     * @throws ContactValidationException if any business-rule validation fails
     */
    public void saveContact(ContactRequestDTO dto) {
        log.debug("Processing contact submission from: {}", dto.getEmail());
        validateContact(dto);

        try {
            Contact contact = Contact.builder()
                    .name(dto.getName().trim())
                    .email(dto.getEmail().trim().toLowerCase())
                    .message(dto.getMessage().trim())
                    .build();

            contactRepository.save(contact);
            log.info("Contact saved successfully from: {}", dto.getEmail());
        } catch (Exception e) {
            log.error("Error saving contact from '{}': {}", dto.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Failed to save contact", e);
        }
    }

    /**
     * Performs business-level validation on the contact DTO beyond JSR-380 constraints.
     *
     * @param dto the contact request to validate
     * @throws ContactValidationException if validation fails
     */
    private void validateContact(ContactRequestDTO dto) {
        if (!StringUtils.hasText(dto.getName())) {
            throw new ContactValidationException("Name must not be blank");
        }
        if (!StringUtils.hasText(dto.getEmail()) || !EMAIL_PATTERN.matcher(dto.getEmail()).matches()) {
            throw new ContactValidationException("Email must be a valid address");
        }
        if (!StringUtils.hasText(dto.getMessage()) || dto.getMessage().trim().length() < 10) {
            throw new ContactValidationException("Message must be at least 10 characters");
        }
    }
}
