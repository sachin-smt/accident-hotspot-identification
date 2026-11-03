package com.accidenthotspot.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "accidents")
public class Accident {

    @Id
    @Column(name = "accident_id")
    private Integer accidentId;

    @Column(name = "city", length = 100)
    private String city;
    @Column(name = "state", length = 100)
    private String state;
    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;
    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;
    @Column(name = "accident_date")
    private LocalDate accidentDate;
    @Column(name = "accident_time", length = 10)
    private String accidentTime;
    @Column(name = "hour")
    private Integer hour;
    @Column(name = "day_of_week", length = 20)
    private String dayOfWeek;
    @Column(name = "is_weekend", columnDefinition = "TINYINT")
    private Boolean weekend;
    @Column(name = "road_type", length = 50)
    private String roadType;
    @Column(name = "lanes")
    private Integer lanes;
    @Column(name = "traffic_signal", columnDefinition = "TINYINT")
    private Boolean trafficSignal;
    @Column(name = "weather", length = 50)
    private String weather;
    @Column(name = "visibility", length = 30)
    private String visibility;
    @Column(name = "temperature", precision = 5, scale = 2)
    private BigDecimal temperature;
    @Column(name = "traffic_density", length = 30)
    private String trafficDensity;
    @Column(name = "cause", length = 100)
    private String cause;
    @Column(name = "accident_severity", length = 30)
    private String accidentSeverity;
    @Column(name = "vehicles_involved")
    private Integer vehiclesInvolved;
    @Column(name = "casualties")
    private Integer casualties;
    @Column(name = "is_peak_hour", columnDefinition = "TINYINT")
    private Boolean peakHour;
    @Column(name = "festival", length = 100)
    private String festival;
    @Column(name = "risk_score", precision = 5, scale = 3)
    private BigDecimal riskScore;
    @Column(name = "cluster_id")
    private Integer clusterId;
    @Column(name = "is_hotspot", columnDefinition = "TINYINT")
    private Boolean hotspot;

    protected Accident() {
    }
}
