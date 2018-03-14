package org.apereo.cas.mgmt;

import org.apereo.cas.mgmt.configuration.CasManagementConfigurationProperties;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.boot.autoconfigure.web.ServerProperties;

/**
 * This is {@link CasManagementUtils}.
 *
 * @author Misagh Moayyed
 * @since 5.2.0
 */
public final class CasManagementUtils {
    
    private CasManagementUtils() {}
    
    /**
     * Gets default callback url.
     *
     * @param casProperties    the cas properties
     * @param serverProperties the server properties
     * @return the default callback url
     */
    public static String getDefaultCallbackUrl(final CasManagementConfigurationProperties casProperties, final ServerProperties serverProperties) {
        try {
            return casProperties.getMgmt().getServerName().concat(serverProperties.getContextPath()).concat("/register.html");
        } catch (final Exception e) {
            throw new BeanCreationException(e.getMessage(), e);
        }
    }
}
