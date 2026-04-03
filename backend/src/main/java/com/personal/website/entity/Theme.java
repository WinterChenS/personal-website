package com.personal.website.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "themes")
public class Theme {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(name = "preset_key")
    private String presetKey;
    
    @Column(name = "primary_color")
    private String primary;
    
    @Column(name = "secondary_color")
    private String secondary;
    
    @Column(name = "accent_color")
    private String accent;
    
    private String background;
    
    @Column(name = "card_bg")
    private String cardBg;
    
    @Column(name = "text_primary")
    private String textPrimary;
    
    @Column(name = "text_secondary")
    private String textSecondary;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    // Constructors
    public Theme() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPresetKey() { return presetKey; }
    public void setPresetKey(String presetKey) { this.presetKey = presetKey; }
    
    public String getPrimary() { return primary; }
    public void setPrimary(String primary) { this.primary = primary; }
    
    public String getSecondary() { return secondary; }
    public void setSecondary(String secondary) { this.secondary = secondary; }
    
    public String getAccent() { return accent; }
    public void setAccent(String accent) { this.accent = accent; }
    
    public String getBackground() { return background; }
    public void setBackground(String background) { this.background = background; }
    
    public String getCardBg() { return cardBg; }
    public void setCardBg(String cardBg) { this.cardBg = cardBg; }
    
    public String getTextPrimary() { return textPrimary; }
    public void setTextPrimary(String textPrimary) { this.textPrimary = textPrimary; }
    
    public String getTextSecondary() { return textSecondary; }
    public void setTextSecondary(String textSecondary) { this.textSecondary = textSecondary; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}