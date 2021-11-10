package com.paper.maplestory2codex.storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class StorageService implements IStorageService {
    @Autowired
    private StorageProperties storageProperties;

    @Override
    public Resource loadFileAsResource(String fileName) {
        try {
            Path file = Paths.get(storageProperties.getIconLocation() + "/" + fileName);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable())
                return resource;
        } catch (IOException e) {
            return null;
        }
        return null;
    }
}
