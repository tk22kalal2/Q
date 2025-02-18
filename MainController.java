// MainController.java
import net.sourceforge.tess4j.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.*;

@RestController
public class MainController {

    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processImage(@RequestParam("image") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        StringBuilder logs = new StringBuilder();
        
        try {
            logs.append("Received image: ").append(file.getOriginalFilename()).append("\n");
            
            // Load image
            BufferedImage image = ImageIO.read(file.getInputStream());
            logs.append("Image dimensions: ").append(image.getWidth()).append("x").append(image.getHeight()).append("\n");
            
            // OCR setup
            ITesseract tesseract = new Tesseract();
            tesseract.setDatapath("tessdata"); // Set your tessdata path
            tesseract.setLanguage("eng");
            
            // Perform OCR
            logs.append("Starting OCR processing...\n");
            String result = tesseract.doOCR(image);
            logs.append("OCR completed. Analyzing text...\n");
            
            // Find option positions
            int aStart = -1, dEnd = -1;
            String[] lines = result.split("\\r?\\n");
            for (int i = 0; i < lines.length; i++) {
                if (lines[i].startsWith("A. ")) {
                    aStart = i;
                }
                if (lines[i].startsWith("D. ") && aStart != -1) {
                    dEnd = i;
                    break;
                }
            }
            
            if (aStart == -1 || dEnd == -1) {
                throw new Exception("Options not found in image");
            }
            
            // Get coordinates (simplified - need actual coordinate calculation)
            // This is a simplified example - you'll need to implement proper coordinate mapping
            int optionStartY = (image.getHeight() * aStart) / lines.length;
            int optionEndY = (image.getHeight() * dEnd) / lines.length;
            
            logs.append(String.format("Found options between Y=%d and Y=%d\n", optionStartY, optionEndY));
            
            // Split image
            BufferedImage part1 = image.getSubimage(0, 0, image.getWidth(), optionStartY);
            BufferedImage part2 = image.getSubimage(0, optionStartY, image.getWidth(), optionEndY - optionStartY);
            BufferedImage part3 = image.getSubimage(0, optionEndY, image.getWidth(), image.getHeight() - optionEndY);
            
            // Convert to base64
            response.put("part1", imageToBase64(part1));
            response.put("part2", imageToBase64(part2));
            response.put("part3", imageToBase64(part3));
            response.put("success", true);
            
        } catch (Exception e) {
            logs.append("Error: ").append(e.getMessage());
            response.put("success", false);
        }
        
        response.put("logs", logs.toString());
        return ResponseEntity.ok(response);
    }

    private String imageToBase64(BufferedImage image) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        return Base64.getEncoder().encodeToString(baos.toByteArray());
    }
}
