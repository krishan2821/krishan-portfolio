// Custom exception thrown when contact form data fails business-level validation
package com.portfolio.exception;

/** Thrown by ContactService when input data violates business rules. */
public class ContactValidationException extends RuntimeException {

    /**
     * Creates a new validation exception with a descriptive message.
     *
     * @param message explanation of the validation failure
     */
    public ContactValidationException(String message) {
        super(message);
    }
}
