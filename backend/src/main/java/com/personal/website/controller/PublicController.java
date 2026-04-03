package com.personal.website.controller;

import com.personal.website.entity.*;
import com.personal.website.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin
public class PublicController {
    
    private final ArticleRepository articleRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    
    public PublicController(ArticleRepository articleRepository, 
                           ProjectRepository projectRepository,
                           SkillRepository skillRepository,
                           UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }
    
    @GetMapping("/articles")
    public ResponseEntity<Page<Article>> getArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(articleRepository.findByPublishedTrue(pageable));
    }
    
    @GetMapping("/articles/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable Long id) {
        return articleRepository.findById(id)
            .filter(Article::getPublished)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getProjects() {
        return ResponseEntity.ok(projectRepository.findAllByOrderByDisplayOrderAsc());
    }
    
    @GetMapping("/projects/featured")
    public ResponseEntity<List<Project>> getFeaturedProjects() {
        return ResponseEntity.ok(projectRepository.findByFeaturedTrueOrderByDisplayOrderAsc());
    }
    
    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getSkills() {
        return ResponseEntity.ok(skillRepository.findAllByOrderByDisplayOrderAsc());
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam(defaultValue = "zh") String lang) {
        return userRepository.findAll().stream()
            .findFirst()
            .map(user -> {
                Map<String, Object> profile = new HashMap<>();
                // 基础信息（不分语言）
                profile.put("nickname", user.getNickname() != null ? user.getNickname() : "");
                profile.put("location", user.getLocation() != null ? user.getLocation() : "");
                profile.put("website", user.getWebsite() != null ? user.getWebsite() : "");
                profile.put("github", user.getGithub() != null ? user.getGithub() : "");
                profile.put("twitter", user.getTwitter() != null ? user.getTwitter() : "");
                profile.put("linkedin", user.getLinkedin() != null ? user.getLinkedin() : "");
                profile.put("emailPublic", user.getEmailPublic() != null ? user.getEmailPublic() : "");
                profile.put("coffeeCount", user.getCoffeeCount() != null ? user.getCoffeeCount() : 1000);
                profile.put("starsCount", user.getStarsCount() != null ? user.getStarsCount() : 1000);
                
                // 根据语言返回对应内容
                boolean isEn = "en".equalsIgnoreCase(lang);
                profile.put("bio", isEn ? 
                    (user.getBioEn() != null ? user.getBioEn() : user.getBio() != null ? user.getBio() : "") :
                    (user.getBio() != null ? user.getBio() : ""));
                profile.put("tags", isEn ?
                    (user.getTagsEn() != null ? user.getTagsEn() : user.getTags() != null ? user.getTags() : "") :
                    (user.getTags() != null ? user.getTags() : ""));
                profile.put("welcomeText", isEn ?
                    (user.getWelcomeTextEn() != null ? user.getWelcomeTextEn() : user.getWelcomeText() != null ? user.getWelcomeText() : "") :
                    (user.getWelcomeText() != null ? user.getWelcomeText() : ""));
                profile.put("ctaTitle", isEn ?
                    (user.getCtaTitleEn() != null ? user.getCtaTitleEn() : user.getCtaTitle() != null ? user.getCtaTitle() : "") :
                    (user.getCtaTitle() != null ? user.getCtaTitle() : ""));
                profile.put("ctaDescription", isEn ?
                    (user.getCtaDescriptionEn() != null ? user.getCtaDescriptionEn() : user.getCtaDescription() != null ? user.getCtaDescription() : "") :
                    (user.getCtaDescription() != null ? user.getCtaDescription() : ""));
                
                return ResponseEntity.ok(profile);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    // 统计数据接口
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long articleCount = articleRepository.count();
        long projectCount = projectRepository.count();
        long totalStars = projectRepository.findAll().stream()
            .mapToInt(p -> p.getStars() != null ? p.getStars() : 0)
            .sum();
        
        return userRepository.findAll().stream()
            .findFirst()
            .map(user -> ResponseEntity.ok(Map.of(
                "coffeeCount", user.getCoffeeCount() != null ? user.getCoffeeCount() : 1000,
                "projectCount", projectCount,
                "articleCount", articleCount,
                "starsCount", user.getStarsCount() != null ? user.getStarsCount() : (int) totalStars
            )))
            .orElse(ResponseEntity.notFound().build());
    }
}