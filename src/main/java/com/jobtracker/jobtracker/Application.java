package com.jobtracker.jobtracker;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;


@Data
@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String companyName;
    private String position;
    private String status;
    private LocalDate dateApplied;
    private String notes;
    private String cvFileUrl;

}
