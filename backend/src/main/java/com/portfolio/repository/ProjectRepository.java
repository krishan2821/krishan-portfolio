// Spring Data MongoDB repository for Project documents with custom tag query
package com.portfolio.repository;

import com.portfolio.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/** Data access layer for the "projects" MongoDB collection. */
@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {

    /**
     * Finds all projects whose tags list contains the given tag (case-sensitive).
     *
     * @param tag the technology tag to filter by (e.g. "Next.js")
     * @return list of matching projects, empty list if none found
     */
    List<Project> findByTagsContaining(String tag);
}
