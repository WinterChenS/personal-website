import { useLanguage } from '../contexts/LanguageContext'

export const translations = {
  zh: {
    nav: {
      home: '首页', blog: '博客', projects: '项目', admin: '管理后台',
      logout: '退出登录', login: '登录'
    },
    home: {
      stats: { coffee: '杯咖啡', projects: '个项目', articles: '篇文章', stars: 'Stars' },
      sections: { articles: '最新文章', projects: '精选项目', skills: '技能栈', viewAll: '查看全部', viewMore: '了解更多' },
      contact: { button: '联系我' },
      hero: { 
        prefix: '一名',
        readBlog: '阅读博客',
        viewProjects: '查看项目'
      },
      features: {
        title: '我能做什么',
        subtitle: '专业技能',
        fullStack: { title: '全栈开发', desc: '前后端技术栈全面掌握，构建完整解决方案' },
        architecture: { title: '系统架构', desc: '设计高可用、可扩展的分布式系统架构' },
        writing: { title: '技术写作', desc: '分享技术心得与实践经验，记录成长历程' },
        innovation: { title: '持续创新', desc: '保持对新技术的探索热情，拥抱变化' }
      },
      skills: { title: '技能专长', badge: '技术栈' },
      articles: { badge: '最新动态', title: '最新文章' },
      projects: { badge: '作品展示', title: '精选项目' },
      cta: {
        sendEmail: '发送邮件',
        browseArticles: '浏览文章',
        defaultTitle: '开始合作',
        defaultDesc: '有想法？想要合作？或者只是想打个招呼？随时联系我！'
      },
      defaultBio: '热爱技术，专注于构建优雅的解决方案。从全栈开发到系统架构，始终保持学习的热情，用代码改变世界。',
      defaultTags: ['全栈开发者', '技术爱好者', '终身学习者', '开源贡献者']
    },
    blog: {
      title: '博客文章', 
      subtitle: '探索技术、分享经验、记录成长，这里是我的技术日记',
      searchPlaceholder: '搜索文章...',
      resultsCount: '共找到',
      articlesUnit: '篇文章',
      noArticles: {
        title: '没有找到文章',
        desc: '尝试更改搜索条件或分类筛选'
      }
    },
    projects: {
      title: '项目作品',
      subtitle: '从想法到实现，每一个项目都是一次技术与创意的探索',
      searchPlaceholder: '搜索项目...',
      resultsCount: '共找到',
      projectsUnit: '个项目',
      sortFeatured: '精选优先',
      stats: {
        total: '项目总数',
        featured: '精选项目',
        techStack: '技术栈'
      },
      noProjects: {
        title: '没有找到项目',
        desc: '尝试更改搜索条件或技术栈筛选'
      },
      cta: {
        title: '有项目想法？',
        desc: '我总是对新的合作机会和有趣的项目保持开放态度',
        button: '联系我'
      }
    },
    admin: {
      title: '管理后台', articles: '文章管理', projects: '项目管理', skills: '技能管理', profile: '个人信息',
      save: '保存', cancel: '取消', edit: '编辑', delete: '删除', create: '新建',
      success: '保存成功', failed: '保存失败',
      profileInfo: {
        title: '个人信息', basic: '基本信息', social: '社交链接', advanced: '高级配置',
        nickname: '昵称', bio: '个人简介', bioHelper: '简短介绍你自己', location: '位置',
        website: '个人网站', emailPublic: '公开邮箱', tags: '职业标签',
        tagsHelper: '逗号分隔', welcomeText: '欢迎语', ctaTitle: 'CTA 标题',
        ctaDescription: 'CTA 描述', coffeeCount: '咖啡数', starsCount: 'Stars 数'
      }
    },
    common: {
      loading: '加载中...',
      error: '出错了',
      retry: '重试',
      all: '全部'
    },
    footer: {
      navigation: '导航',
      contact: '联系',
      rights: '版权所有',
      madeWith: '用',
      and: '和',
      using: '技术构建'
    }
  },
  en: {
    nav: {
      home: 'Home', blog: 'Blog', projects: 'Projects', admin: 'Admin',
      logout: 'Logout', login: 'Login'
    },
    home: {
      stats: { coffee: 'Cups of Coffee', projects: 'Projects', articles: 'Articles', stars: 'Stars' },
      sections: { articles: 'Latest Articles', projects: 'Featured Projects', skills: 'Tech Stack', viewAll: 'View All', viewMore: 'Learn More' },
      contact: { button: 'Contact Me' },
      hero: { 
        prefix: 'A',
        readBlog: 'Read Blog',
        viewProjects: 'View Projects'
      },
      features: {
        title: 'What I Do',
        subtitle: 'Professional Skills',
        fullStack: { title: 'Full Stack Dev', desc: 'Mastering frontend and backend technologies to build complete solutions' },
        architecture: { title: 'System Architecture', desc: 'Designing highly available and scalable distributed systems' },
        writing: { title: 'Technical Writing', desc: 'Sharing insights and experiences, documenting the growth journey' },
        innovation: { title: 'Continuous Innovation', desc: 'Maintaining passion for exploring new technologies and embracing change' }
      },
      skills: { title: 'Skills & Expertise', badge: 'Tech Stack' },
      articles: { badge: 'Latest Updates', title: 'Latest Articles' },
      projects: { badge: 'Showcase', title: 'Featured Projects' },
      cta: {
        sendEmail: 'Send Email',
        browseArticles: 'Browse Articles',
        defaultTitle: 'Let\'s Collaborate',
        defaultDesc: 'Have an idea? Want to collaborate? Or just want to say hi? Feel free to reach out!'
      },
      defaultBio: 'Passionate about technology, focused on building elegant solutions. From full-stack development to system architecture, always maintaining enthusiasm for learning and changing the world with code.',
      defaultTags: ['Full Stack Developer', 'Tech Enthusiast', 'Lifelong Learner', 'Open Source Contributor']
    },
    blog: {
      title: 'Blog Articles', 
      subtitle: 'Exploring technology, sharing experiences, documenting growth - my technical diary',
      searchPlaceholder: 'Search articles...',
      resultsCount: 'Found',
      articlesUnit: 'articles',
      noArticles: {
        title: 'No articles found',
        desc: 'Try changing search criteria or category filter'
      }
    },
    projects: {
      title: 'Projects Portfolio',
      subtitle: 'From idea to reality, each project is an exploration of technology and creativity',
      searchPlaceholder: 'Search projects...',
      resultsCount: 'Found',
      projectsUnit: 'projects',
      sortFeatured: 'Featured First',
      stats: {
        total: 'Total Projects',
        featured: 'Featured',
        techStack: 'Tech Stack'
      },
      noProjects: {
        title: 'No projects found',
        desc: 'Try changing search criteria or tech stack filter'
      },
      cta: {
        title: 'Have a project idea?',
        desc: 'I\'m always open to new collaboration opportunities and interesting projects',
        button: 'Contact Me'
      }
    },
    admin: {
      title: 'Admin', articles: 'Articles', projects: 'Projects', skills: 'Skills', profile: 'Profile',
      save: 'Save', cancel: 'Cancel', edit: 'Edit', delete: 'Delete', create: 'Create',
      success: 'Saved', failed: 'Failed',
      profileInfo: {
        title: 'Profile', basic: 'Basic Info', social: 'Social', advanced: 'Advanced',
        nickname: 'Nickname', bio: 'Bio', bioHelper: 'Brief intro', location: 'Location',
        website: 'Website', emailPublic: 'Public Email', tags: 'Tags',
        tagsHelper: 'Comma separated', welcomeText: 'Welcome Text', ctaTitle: 'CTA Title',
        ctaDescription: 'CTA Description', coffeeCount: 'Coffee', starsCount: 'Stars'
      }
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      all: 'All'
    },
    footer: {
      navigation: 'Navigation',
      contact: 'Contact',
      rights: 'All rights reserved',
      madeWith: 'Made with',
      and: 'and',
      using: 'using'
    }
  }
}

export function useTranslation() {
  const { language } = useLanguage()
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }
  return { t, language }
}