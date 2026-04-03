package com.personal.website.repository;

import com.personal.website.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    Page<Article> findByPublishedTrue(Pageable pageable);
    List<Article> findByPublishedTrueOrderByCreatedAtDesc();
    List<Article> findByCategory(String category);
    Page<Article> findByCategory(String category, Pageable pageable);
    List<Article> findByTagsContaining(String tag);
}
