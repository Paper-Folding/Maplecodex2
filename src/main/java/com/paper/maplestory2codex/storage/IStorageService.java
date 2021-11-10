package com.paper.maplestory2codex.storage;

import org.springframework.core.io.Resource;

public interface IStorageService {
    Resource loadFileAsResource(String fileName);
}
