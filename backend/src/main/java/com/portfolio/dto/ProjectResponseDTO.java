// DTO for exposing project data to API consumers — never returns raw @Document entity
package com.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/** Read-only projection of a Project document returned from the REST API. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponseDTO {

    /** Project unique identifier. */
    private String id;

    /** Human-readable project title. */
    private String title;

    /** Short project description. */
    private String description;

    /** Technology tags list. */
    private List<String> tags;

    /** GitHub repository URL. */
    private String githubUrl;

    /** URL to the architecture diagram image. */
    private String archImageUrl;

    /** ISO-8601 creation timestamp. */
    private LocalDateTime createdAt;
}
