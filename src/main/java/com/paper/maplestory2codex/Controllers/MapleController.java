package com.paper.maplestory2codex.Controllers;

import com.alibaba.fastjson.JSON;
import com.paper.maplestory2codex.Entity.AjaxResult;
import com.paper.maplestory2codex.Entity.Item;
import com.paper.maplestory2codex.Mapper.MapleMapper;
import com.paper.maplestory2codex.storage.IStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class MapleController {
    @Autowired
    private MapleMapper mapleMapper;

    private final IStorageService storageService;

    @Autowired
    public MapleController(IStorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/item/{id}")
    public String getItemInfo(@PathVariable String id) {
        Item item = mapleMapper.getSingleItem(id);
        return new AjaxResult(1, item).toString();
    }

    @GetMapping("/icon/{id}")
    public ResponseEntity<Resource> getIcon(@PathVariable String id) {
        Resource resource = storageService.loadFileAsResource(mapleMapper.getIconPath(id));
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + id + ".png\"").body(resource);
    }

    /**
     * @param recv pass an Json object like this:
     *             {
     *             "page": "Number", // which page is rendering
     *             "count": "Number", // how many records should be returned at maximum
     *             "str": "String", // search string
     *             "type": "String" // items' type
     *             }
     * @return AjaxResult as Json object
     * @warning All fields must be passed, if nothing was provided, pass empty string(''), this api does not provide null check!
     */
    @PostMapping("/getItems")
    public String getItems(@RequestBody Map<String, Object> recv) {
        int page = Integer.parseInt(recv.get("page").toString()), count = Integer.parseInt(recv.get("count").toString());
        String searchStr = recv.get("str").toString(), type = recv.get("type").toString();
        return new AjaxResult(mapleMapper.countItems((page - 1) * count, count, searchStr, type),
                mapleMapper.getItems((page - 1) * count, count, searchStr, type)).toString();
    }

    @GetMapping("/getTypes")
    public String getTypes() {
        return JSON.toJSONString(mapleMapper.getTypes());
    }
}
