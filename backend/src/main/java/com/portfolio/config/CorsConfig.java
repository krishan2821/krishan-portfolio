// Global CORS configuration allowing cross-origin requests from the Next.js frontend
package com.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/** Configures CORS for all /api/v1/** endpoints. */
@Configuration
public class CorsConfig {

    /**
     * Registers a global CORS filter permitting the Next.js dev server and production domain.
     *
     * @return configured {@link CorsFilter} bean
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allowed origins: local Next.js dev + production frontend
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "https://khatarnak.dev"
        ));

        // Allowed HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "OPTIONS"));

        // Allow all headers (Authorization, Content-Type, etc.)
        config.addAllowedHeader("*");

        // Send cookies and credentials if needed
        config.setAllowCredentials(true);

        // Cache preflight response for 30 minutes
        config.setMaxAge(1800L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
