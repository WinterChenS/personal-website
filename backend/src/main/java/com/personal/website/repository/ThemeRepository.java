package com.personal.website.repository;

import com.personal.website.entity.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ThemeRepository extends JpaRepository<Theme, Long> {
    Optional<Theme> findByIsActiveTrue();
}