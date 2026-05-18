package com.jobtracker.jobtracker;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelService {

    public byte[] generateExcel(List<Application> applications) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Applications");

        // Header row
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("ID");
        header.createCell(1).setCellValue("Company");
        header.createCell(2).setCellValue("Position");
        header.createCell(3).setCellValue("Status");
        header.createCell(4).setCellValue("Date Applied");
        header.createCell(5).setCellValue("Notes");
        header.createCell(6).setCellValue("CV URL");

        // Data rows
        int rowNum = 1;
        for (Application app : applications) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(app.getId());
            row.createCell(1).setCellValue(app.getCompanyName());
            row.createCell(2).setCellValue(app.getPosition());
            row.createCell(3).setCellValue(app.getStatus());
            row.createCell(4).setCellValue(app.getDateApplied() != null ?
                    app.getDateApplied().toString() : "");
            row.createCell(5).setCellValue(app.getNotes());
            row.createCell(6).setCellValue(app.getCvFileUrl() != null ?
                    app.getCvFileUrl() : "");
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }
}