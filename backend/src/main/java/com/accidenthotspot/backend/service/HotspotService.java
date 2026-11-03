package com.accidenthotspot.backend.service;

import com.accidenthotspot.backend.entity.Hotspot;
import com.accidenthotspot.backend.repository.HotspotRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HotspotService {

    private final HotspotRepository hotspotRepository;

    public HotspotService(HotspotRepository hotspotRepository) {
        this.hotspotRepository = hotspotRepository;
    }

    @Transactional(readOnly = true)
    public List<Hotspot> findAll() {
        return hotspotRepository.findAll();
    }
}
