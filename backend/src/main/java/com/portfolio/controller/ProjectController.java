// REST controller exposing project endpoints at /api/v1/projects
package com.portfolio.controller;

import com.portfolio.dto.ProjectResponseDTO;
import com.portfolio.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Handles HTTP requests for portfolio project resources. */
@RestController
@RequestMapping("/api/v1/projects")
@CrossOrigin(origins = {"http://localhost:3000", "${FRONTEND_ORIGIN:https://khatarnak.dev}"})
@RequiredArgsConstructor
@Slf4j
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Returns all projects, or filters by tag if the optional query param is present.
     *
     * @param tag optional technology tag to filter by (e.g. ?tag=Next.js)
     * @return 200 OK with list of {@link ProjectResponseDTO}
     */
    @GetMapping
    public ResponseEntity<List<ProjectResponseDTO>> getProjects(
            @RequestParam(required = false) String tag) {
        log.debug("GET /api/v1/projects — tag filter: {}", tag);
        try {
            List<ProjectResponseDTO> projects = (tag != null && !tag.isBlank())
                    ? projectService.getProjectsByTag(tag)
                    : projectService.getAllProjects();
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            log.error("Error handling GET /api/v1/projects: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
