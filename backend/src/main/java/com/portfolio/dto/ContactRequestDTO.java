// DTO for validating and deserializing incoming contact form POST requests
package com.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Validated request body for POST /api/v1/contact. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequestDTO {

    /** Sender's full name — must not be blank. */
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    /** Valid email address — must not be blank. */
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid address")
    private String email;

    /** Message body — must not be blank, max 2000 chars. */
    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 2000, message = "Message must be between 10 and 2000 characters")
    private String message;
}
