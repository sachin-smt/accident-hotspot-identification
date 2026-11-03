package com.accidenthotspot.backend.controller;

import com.accidenthotspot.backend.entity.Hotspot;
import com.accidenthotspot.backend.service.HotspotService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hotspots")
public class HotspotController {

    private final HotspotService hotspotService;

    public HotspotController(HotspotService hotspotService) {
        this.hotspotService = hotspotService;
    }

    @GetMapping
    public List<Hotspot> getHotspots() {
        return hotspotService.findAll();
    }
}
