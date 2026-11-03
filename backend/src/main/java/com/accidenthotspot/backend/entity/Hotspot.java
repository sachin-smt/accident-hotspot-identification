package com.accidenthotspot.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "hotspots")
public class Hotspot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "city", length = 100)
    private String city;
    @Column(name = "cluster_id")
    private Integer clusterId;
    @Column(name = "accident_count")
    private Integer accidentCount;
    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;
    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;
    @Column(name = "fatal_records")
    private Integer fatalRecords;
    @Column(name = "total_casualties")
    private Integer totalCasualties;
    @Column(name = "avg_risk_score", precision = 6, scale = 4)
    private BigDecimal avgRiskScore;

    protected Hotspot() {
    }

    public Integer getId() {
        return id;
    }

    public Integer getClusterId() {
        return clusterId;
    }

    public String getCity() {
        return city;
    }

    public Integer getAccidentCount() {
        return accidentCount;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public Integer getFatalRecords() {
        return fatalRecords;
    }

    public Integer getTotalCasualties() {
        return totalCasualties;
    }

    public BigDecimal getAvgRiskScore() {
        return avgRiskScore;
    }
}
