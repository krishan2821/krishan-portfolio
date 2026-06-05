// Spring Data MongoDB repository for Contact documents
package com.portfolio.repository;

import com.portfolio.model.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/** Data access layer for the "contacts" MongoDB collection. */
@Repository
public interface ContactRepository extends MongoRepository<Contact, String> {
    // Inherits standard CRUD operations from MongoRepository<Contact, String>
}
