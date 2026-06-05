// MongoDB document model representing a portfolio project entry
package com.portfolio.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/** Represents a portfolio project stored in the "projects" MongoDB collection. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "projects")
public class Project {

    /** Unique MongoDB ObjectId. */
    @Id
    private String id;

    /** Human-readable project title. */
    private String title;

    /** Short project description (1–3 sentences). */
    private String description;

    /** Technology tags (e.g. "Next.js", "Spring Boot"). */
    private List<String> tags;

    /** GitHub repository URL. */
    private String githubUrl;

    /** URL to the project architecture diagram image. */
    private String archImageUrl;

    /** Timestamp automatically set on document creation via @EnableMongoAuditing. */
    @CreatedDate
    private LocalDateTime createdAt;
}
