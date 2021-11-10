package com.paper.maplestory2codex.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "storage")
public class StorageProperties {
    private String iconLocation;

    public StorageProperties() {
    }

    public String getIconLocation() {
        return iconLocation;
    }

    public void setIconLocation(String iconLocation) {
        this.iconLocation = iconLocation;
    }
}
