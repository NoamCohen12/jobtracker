package com.jobtracker.jobtracker;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService service;
    private final FileUploadService fileUploadService;


    private final ExcelService excelService;

    public ApplicationController(ApplicationService service,
                                 FileUploadService fileUploadService,
                                 ExcelService excelService) {
        this.service = service;
        this.fileUploadService = fileUploadService;
        this.excelService = excelService;
    }

    @GetMapping
    public List<Application> getAll(Authentication auth) {
        return service.getAll(auth.getName());
    }
    @GetMapping("/{id}")
    public Application getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Application create(@RequestBody Application app, Authentication auth) {
        app.setUserEmail(auth.getName());
        return service.save(app);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    @PutMapping("/{id}")
    public Application update(@PathVariable Long id,
                              @RequestBody Application app) {
        return service.update(id, app);
    }

    @PostMapping("/{id}/upload-cv")
    public Application uploadCv(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        String fileUrl = fileUploadService.uploadFile(file);
        Application app = service.getById(id);
        app.setCvFileUrl(fileUrl);
        return service.save(app);
    }
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportToExcel(Authentication auth) throws IOException {
        List<Application> applications = service.getAll(auth.getName());
        byte[] excelFile = excelService.generateExcel(applications);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=applications.xlsx")
                .contentType(org.springframework.http.MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelFile);
    }
}