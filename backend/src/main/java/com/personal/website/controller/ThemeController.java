package com.personal.website.controller;

import com.personal.website.entity.Theme;
import com.personal.website.repository.ThemeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ThemeController {
    
    private final ThemeRepository themeRepository;
    
    public ThemeController(ThemeRepository themeRepository) {
        this.themeRepository = themeRepository;
    }
    
    // Public endpoint to get active theme
    @GetMapping("/public/theme")
    public ResponseEntity<?> getActiveTheme() {
        return themeRepository.findByIsActiveTrue()
            .map(this::themeToMap)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.ok(Map.of("preset", "purple-pink")));
    }
    
    // Admin endpoint to save theme
    @PostMapping("/admin/theme")
    public ResponseEntity<?> saveTheme(@RequestBody Map<String, Object> themeData) {
        // Deactivate all existing themes
        themeRepository.findAll().forEach(t -> {
            t.setIsActive(false);
            themeRepository.save(t);
        });
        
        Theme theme = new Theme();
        theme.setIsActive(true);
        
        if (themeData.containsKey("preset") && themeData.get("preset") != null) {
            theme.setPresetKey((String) themeData.get("preset"));
            theme.setName("Preset: " + themeData.get("preset"));
        }
        
        if (themeData.containsKey("custom") && themeData.get("custom") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> custom = (Map<String, Object>) themeData.get("custom");
            theme.setName("Custom Theme");
            theme.setPrimary((String) custom.getOrDefault("primary", "#8B5CF6"));
            theme.setSecondary((String) custom.getOrDefault("secondary", "#EC4899"));
            theme.setAccent((String) custom.getOrDefault("accent", "#F59E0B"));
            theme.setBackground((String) custom.getOrDefault("background", ""));
            theme.setTextPrimary((String) custom.getOrDefault("textPrimary", "#1F2937"));
            theme.setTextSecondary((String) custom.getOrDefault("textSecondary", "#6B7280"));
        }
        
        Theme saved = themeRepository.save(theme);
        return ResponseEntity.ok(themeToMap(saved));
    }
    
    // Admin endpoint to get all themes
    @GetMapping("/admin/themes")
    public ResponseEntity<?> getAllThemes() {
        return ResponseEntity.ok(themeRepository.findAll());
    }
    
    private Map<String, Object> themeToMap(Theme theme) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", theme.getId());
        map.put("name", theme.getName());
        
        if (theme.getPresetKey() != null) {
            map.put("preset", theme.getPresetKey());
        }
        
        if (theme.getPrimary() != null) {
            Map<String, Object> custom = new HashMap<>();
            custom.put("primary", theme.getPrimary());
            custom.put("secondary", theme.getSecondary());
            custom.put("accent", theme.getAccent());
            custom.put("background", theme.getBackground());
            custom.put("textPrimary", theme.getTextPrimary());
            custom.put("textSecondary", theme.getTextSecondary());
         map.put("custom", custom);
        }
        
        return map;
    }
}