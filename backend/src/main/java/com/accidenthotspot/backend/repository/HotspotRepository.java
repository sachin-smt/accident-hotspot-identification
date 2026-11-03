package com.accidenthotspot.backend.repository;

import com.accidenthotspot.backend.entity.Hotspot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotspotRepository extends JpaRepository<Hotspot, Integer> {
}
