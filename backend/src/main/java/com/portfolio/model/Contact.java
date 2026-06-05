// MongoDB document model representing a contact form submission
package com.portfolio.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/** Represents a contact enquiry stored in the "contacts" MongoDB collection. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "contacts")
public class Contact {

    /** Unique MongoDB ObjectId. */
    @Id
    private String id;

    /** Sender's full name. */
    private String name;

    /** Sender's email address. */
    private String email;

    /** Message body submitted through the contact form. */
    private String message;

    /** Timestamp automatically set on document creation via @EnableMongoAuditing. */
    @CreatedDate
    private LocalDateTime submittedAt;
}
