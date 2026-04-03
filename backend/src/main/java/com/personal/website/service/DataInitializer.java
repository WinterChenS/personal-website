package com.personal.website.service;

import com.personal.website.entity.*;
import com.personal.website.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final PasswordEncoder passwordEncoder;
    
    public DataInitializer(UserRepository userRepository, ArticleRepository articleRepository,
                          ProjectRepository projectRepository, SkillRepository skillRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.articleRepository = articleRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@example.com");
            admin.setRole("ADMIN");
            admin.setNickname("站长");
            admin.setBio("全栈开发者，热爱技术与开源");
            admin.setLocation("中国");
            admin.setGithub("https://github.com");
            userRepository.save(admin);
        }
        
        if (articleRepository.count() == 0) {
            Article article1 = new Article();
            article1.setTitle("欢迎使用个人网站");
            article1.setSummary("这是一个基于 React + Spring Boot 构建的个人网站");
            article1.setContent("# 欢迎来到我的个人网站\n\n这是一个使用 React 和 Spring Boot 构建的现代化个人网站。\n\n## 特性\n\n- 🎨 精美的用户界面\n- 📝 文章管理系统\n- 💼 项目展示\n- 🛠️ 技能展示\n- 🔐 安全的管理后台");
            article1.setCategory("公告");
            article1.setTags("欢迎,网站");
            article1.setPublished(true);
            article1.setViews(100);
            articleRepository.save(article1);
            
            Article article2 = new Article();
            article2.setTitle("技术栈介绍");
            article2.setSummary("介绍本网站使用的技术栈");
            article2.setContent("# 技术栈介绍\n\n## 前端\n\n- React 18\n- Vite\n- TailwindCSS\n- Framer Motion\n\n## 后端\n\n- Java 21\n- Spring Boot 3.2\n- Spring Security\n- JWT Authentication\n- H2 Database");
            article2.setCategory("技术");
            article2.setTags("React,Spring Boot,Java");
            article2.setPublished(true);
            articleRepository.save(article2);
        }
        
        if (projectRepository.count() == 0) {
            Project project1 = new Project();
            project1.setName("个人网站");
            project1.setDescription("一个现代化的个人网站，展示个人项目、文章和技能");
            project1.setTechStack("React,Spring Boot,Java 21,TailwindCSS");
            project1.setGithubUrl("https://github.com/username/personal-website");
            project1.setFeatured(true);
            project1.setDisplayOrder(1);
            projectRepository.save(project1);
            
            Project project2 = new Project();
            project2.setName("API 网关");
            project2.setDescription("高性能的 API 网关服务");
            project2.setTechStack("Go,Docker,Kubernetes");
            project2.setGithubUrl("https://github.com/username/api-gateway");
            project2.setFeatured(true);
            project2.setDisplayOrder(2);
            projectRepository.save(project2);
        }
        
        if (skillRepository.count() == 0) {
            List<Skill> skills = List.of(
                createSkill("Java", "后端", 90, 1),
                createSkill("Spring Boot", "后端", 88, 2),
                createSkill("React", "前端", 85, 3),
                createSkill("TypeScript", "前端", 82, 4),
                createSkill("Go", "后端", 75, 5),
                createSkill("Docker", "DevOps", 80, 6),
                createSkill("Kubernetes", "DevOps", 70, 7),
                createSkill("MySQL", "数据库", 85, 8),
                createSkill("Redis", "数据库", 78, 9)
            );
   skillRepository.saveAll(skills);
        }
    }
    
    private Skill createSkill(String name, String category, int proficiency, int order) {
        Skill skill = new Skill();
        skill.setName(name);
        skill.setCategory(category);
        skill.setProficiency(proficiency);
        skill.setDisplayOrder(order);
        return skill;
    }
}