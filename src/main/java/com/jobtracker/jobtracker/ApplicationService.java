package com.jobtracker.jobtracker;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository repository;

    public ApplicationService(ApplicationRepository repository) {
        this.repository = repository;
    }

    public List<Application> getAll(String userEmail) {
        return repository.findByUserEmail(userEmail);
    }
    public Application getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }
    public Application save(Application app) {
        return repository.save(app);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
    public Application update(Long id, Application updatedApp) {
        Application existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        existing.setCompanyName(updatedApp.getCompanyName());
        existing.setPosition(updatedApp.getPosition());
        existing.setStatus(updatedApp.getStatus());
        existing.setDateApplied(updatedApp.getDateApplied());
        existing.setNotes(updatedApp.getNotes());

        return repository.save(existing);
    }
}