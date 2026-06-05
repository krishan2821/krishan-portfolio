// Business logic layer for project retrieval and DTO mapping
package com.portfolio.service;

import com.portfolio.dto.ProjectResponseDTO;
import com.portfolio.model.Project;
import com.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/** Handles all project-related business logic and entity-to-DTO mapping. */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;

    /**
     * Retrieves all projects from MongoDB and maps them to response DTOs.
     *
     * @return list of all projects as {@link ProjectResponseDTO}
     */
    public List<ProjectResponseDTO> getAllProjects() {
        log.debug("Fetching all projects from repository");
        try {
            return projectRepository.findAll()
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching all projects: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to retrieve projects", e);
        }
    }

    /**
     * Retrieves projects filtered by a specific technology tag.
     *
     * @param tag technology tag to filter by (e.g. "Next.js")
     * @return filtered list of matching projects as {@link ProjectResponseDTO}
     */
    public List<ProjectResponseDTO> getProjectsByTag(String tag) {
        log.debug("Fetching projects with tag: {}", tag);
        try {
            return projectRepository.findByTagsContaining(tag)
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching projects by tag '{}': {}", tag, e.getMessage(), e);
            throw new RuntimeException("Failed to retrieve projects by tag", e);
        }
    }

    /**
     * Maps a {@link Project} entity to a {@link ProjectResponseDTO} — never exposes raw entity.
     *
     * @param project the entity to map
     * @return safe DTO representation
     */
    private ProjectResponseDTO toDTO(Project project) {
        return ProjectResponseDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .tags(project.getTags())
                .githubUrl(project.getGithubUrl())
                .archImageUrl(project.getArchImageUrl())
                .createdAt(project.getCreatedAt())
                .build();
    }
}
