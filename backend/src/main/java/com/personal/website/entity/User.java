package com.personal.website.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String role = "ADMIN";
    
    private String avatar;
    
    private String nickname;
    
    private String bio;
    
    private String location;
    
    private String website;
    
    private String github;
    
    private String twitter;
    
    private String linkedin;
    
    // 新增字段：邮箱公开地址
    private String emailPublic;
    
    // 新增字段：职业标签（逗号分隔，如"全栈开发者,技术爱好者"）
    @Column(length = 500)
    private String tags;
    
    // 新增字段：欢迎语（如"👋 Hello, I'm"）
    private String welcomeText;
    
    // 新增字段：CTA 区域标题
    private String ctaTitle;
    
    // 新增字段：CTA 区域描述
    @Column(length = 500)
    private String ctaDescription;
    
    // 新增字段：统计数据 - 咖啡数
    private Integer coffeeCount = 1000;
    
    // 新增字段：统计数据 - Stars 数
    private Integer starsCount = 1000;
    
    // === 多语言字段 ===
    
    // 英文版字段
    private String bioEn;
    private String tagsEn;
    private String welcomeTextEn;
    private String ctaTitleEn;
    private String ctaDescriptionEn;
    
    // 中文版字段（保留原字段作为中文版）
    // bio, tags, welcomeText, ctaTitle, ctaDescription 已存在
}
