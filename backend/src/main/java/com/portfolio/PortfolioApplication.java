// Application entry point — enables Spring Boot auto-config and MongoDB auditing
package com.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/** Bootstraps the Khatarnak Portfolio backend application. */
@SpringBootApplication
@EnableMongoAuditing
public class PortfolioApplication {

    /** Main entry point — starts the embedded Tomcat server on port 8080. */
    public static void main(String[] args) {
        SpringApplication.run(PortfolioApplication.class, args);
    }
}
