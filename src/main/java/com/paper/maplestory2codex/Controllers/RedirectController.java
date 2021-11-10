package com.paper.maplestory2codex.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RedirectController {
    @RequestMapping("/")
    public String index() {
        return "index";
    }
}
