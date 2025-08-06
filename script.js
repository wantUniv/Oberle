// 兼容性检查和polyfill
(function() {
    'use strict';
    
    // 检查基本API支持
    if (!document.addEventListener) {
        console.warn('浏览器不支持addEventListener，部分功能可能无法正常工作');
        return;
    }
    
    // Polyfill for forEach (IE8+)
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(callback, thisArg) {
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }
    
    // Polyfill for querySelectorAll (IE8+)
    if (!document.querySelectorAll) {
        document.querySelectorAll = function(selector) {
            var doc = document,
                head = doc.documentElement.firstChild,
                styleTag = doc.createElement('STYLE');
            head.appendChild(styleTag);
            doc.__qsaels = [];
            styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsaels.push(this))}";
            window.scrollBy(0, 0);
            return doc.__qsaels;
        };
    }
    
    // 主入口函数
    function initApp() {
        try {
            // 视频背景和打字机动画
            initHeroVideo();
            
            // 动态计数器
            initCounterAnimations();
            
            // 页面锚点进度指示器
            initScrollProgress();
            
            // 轮播图功能
            initHeroSlider();
            
            // 导航栏功能
            initNavigation();
            
            // 导航栏滚动效果
            initNavbarScroll();
            
            // 滚动动画
            initScrollAnimations();
            
            // 平滑滚动
            initSmoothScroll();
            
            // 招商加盟功能
            initFranchise();
            
            // 语言切换功能
            initLanguageSwitch();
            
            // 如何购买功能
            initPurchase();
            
            console.log('网站初始化完成');
        } catch (error) {
            console.error('网站初始化失败:', error);
        }
    }
    
    // 兼容不同的DOM加载事件
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
    
    // 备用加载方式
    if (window.addEventListener) {
        window.addEventListener('load', function() {
            if (!window.appInitialized) {
                initApp();
                window.appInitialized = true;
            }
        });
    }
})();

// 导航栏滚动效果
function initNavbarScroll() {
    try {
        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            console.warn('导航栏元素未找到');
            return;
        }
        
        let lastScrollTop = 0;
        
        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 添加滚动样式
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        }
        
        // 使用节流函数优化性能
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
                setTimeout(function() {
                    ticking = false;
                }, 16);
            }
        }
        
        window.addEventListener('scroll', requestTick);
        
        console.log('导航栏滚动效果初始化完成');
    } catch (error) {
        console.error('导航栏滚动效果初始化失败:', error);
    }
}

// 轮播图初始化
function initHeroSlider() {
    try {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        // 检查必要元素是否存在
        if (!slides || !slides.length || !dots || !dots.length || !prevBtn || !nextBtn) {
            console.warn('轮播图元素未找到，跳过初始化');
            return;
        }
        
        // 检查浏览器是否支持classList
        if (!document.documentElement.classList) {
            console.warn('浏览器不支持classList，轮播图功能可能受限');
            return;
        }
    
    let currentSlide = 0;
    // 移除自动播放相关变量
    // let slideInterval;  // 删除这行
    let isTransitioning = false;

    // 显示指定幻灯片
    function showSlide(index) {
        // 防止过快切换
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        // 移除所有活动状态
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 添加活动状态
        if (slides[index] && dots[index]) {
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
        
        // 重置过渡状态
        setTimeout(() => {
            isTransitioning = false;
        }, 100);
    }

    // 下一张幻灯片
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // 上一张幻灯片
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // 开始自动播放
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 2000);
    }

    // 停止自动播放
    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // 事件监听器 - 移除自动播放重启
    nextBtn.addEventListener('click', () => {
        // stopAutoPlay();  // 删除这行
        nextSlide();
        // startAutoPlay();  // 删除这行
    });

    prevBtn.addEventListener('click', () => {
        // stopAutoPlay();  // 删除这行
        prevSlide();
        // startAutoPlay();  // 删除这行
    });

    // 点击圆点切换 - 移除自动播放重启
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // stopAutoPlay();  // 删除这行
            showSlide(index);
            // startAutoPlay();  // 删除这行
        });
    });

    // 移除所有自动播放相关的事件监听器
    // 删除以下所有代码：
    /*
    // 鼠标悬停时停止自动播放
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoPlay);
        heroSection.addEventListener('mouseleave', startAutoPlay);
    }

    // 页面可见性变化时控制播放
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    // 窗口失焦时停止播放
    window.addEventListener('blur', stopAutoPlay);
    window.addEventListener('focus', startAutoPlay);

    // 开始自动播放
    startAutoPlay();
    */
        
        // 初始化第一张幻灯片
        showSlide(0);
        
    } catch (error) {
        console.error('轮播图初始化失败:', error);
    }
}

// 导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // 汉堡菜单切换
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接时关闭移动菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 移除滚动时改变导航栏样式的代码
    // 删除以下代码：
    /*
    // 滚动时改变导航栏样式
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'transparent';
        } else {
            navbar.style.background = 'transparent';
        }
    });
    */
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 为需要动画的元素添加观察
    const animatedElements = document.querySelectorAll(
        '.product-card, .case-item, .about-text, .contact-item, .animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale, .animate-rotate, .animate-fade-in'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// 平滑滚动
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 65; // 考虑导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 表单提交处理已移除 - 现在使用微信二维码联系方式

// 产品卡片悬停效果
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// 案例卡片悬停效果
document.querySelectorAll('.case-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// 数字动画效果
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target === 100) {
                stat.textContent = Math.floor(current) + '%';
            } else {
                stat.textContent = Math.floor(current) + '+';
            }
        }, 20);
    });
}

// 增强的滚动观察器
const enhancedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // 如果是统计数据区域，启动数字动画
            if (entry.target.classList.contains('company-stats-enhanced')) {
                setTimeout(animateNumbers, 500);
            }
        }
    });
}, { threshold: 0.2 });

// 观察所有需要动画的元素
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right');
    animatedElements.forEach(el => enhancedObserver.observe(el));
});

// 粒子背景效果初始化
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// 视差滚动效果
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// 3D鼠标跟随效果
function init3DMouseEffect() {
    const cards = document.querySelectorAll('.hover-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// 增强的滚动动画
function enhancedScrollAnimations() {
    // 为不同元素添加延迟动画
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // 添加滚动进度指示器
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #007bff, #28a745);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// 主初始化函数
function init() {
    initHeroSlider();
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initFranchise();
    initPurchase();
    initROICalculator();
    initTechBlueprint();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 添加页面加载动画和震撼视觉效果
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // 初始化新增的震撼视觉效果
    setTimeout(() => {
        initParticles();
    }, 100);
    
    initParallaxEffect();
    init3DMouseEffect();
    enhancedScrollAnimations();
});

// 返回顶部按钮
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(0,123,255,0.3);
`;

document.body.appendChild(backToTopBtn);

// 显示/隐藏返回顶部按钮
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

// 返回顶部功能
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 添加悬停效果
backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.transform = 'scale(1.1)';
    backToTopBtn.style.background = '#0056b3';
});

backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.transform = 'scale(1)';
    backToTopBtn.style.background = '#007bff';
});

// 键盘导航支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // 关闭移动菜单
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// 如何购买功能
function initPurchase() {
    const channelBtns = document.querySelectorAll('.channel-btn');
    
    channelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.getAttribute('data-platform');
            
            // 按钮点击动画
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
            
            // 根据平台跳转到对应店铺
             if (platform === 'taobao') {
                 window.open('https://shop305110886.taobao.com/?spm=a21n57.shop_search.0.0.2934523cS9Vz5r', '_blank');
             } else if (platform === '1688') {
                 window.open('https://shizhix.1688.com/page/offerlist.htm?spm=a2615.27861609.wp_pc_common_topnav.0', '_blank');
             }
        });
    });
    
    // 购买渠道卡片动画
    const channelItems = document.querySelectorAll('.channel-item');
    channelItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
    
    // 购买流程步骤动画
    const guideSteps = document.querySelectorAll('.guide-steps .step-item');
    guideSteps.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.15}s`;
    });
}

// 招商加盟功能
function initFranchise() {
    const franchiseBtn = document.querySelector('.franchise-btn');
    
    if (franchiseBtn) {
        franchiseBtn.addEventListener('click', () => {
            // 滚动到联系我们部分
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 65;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // 可以添加更多交互效果
            franchiseBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                franchiseBtn.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // 加盟优势卡片动画
    const advantageItems = document.querySelectorAll('.advantage-item');
    advantageItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // 加盟流程步骤动画
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
}

// 预加载图片（如果有真实图片的话）
function preloadImages() {
    const imageUrls = [
        // 在这里添加真实图片URL
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// 性能优化：延迟加载非关键资源
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        preloadImages();
    });
} else {
    setTimeout(preloadImages, 2000);
}

// 语言切换功能
function initLanguageSwitch() {
    // 创建语言切换按钮
    const languageBtn = document.createElement('button');
    languageBtn.className = 'language-switch-btn';
    languageBtn.innerHTML = '<i class="fas fa-globe"></i> EN';
    languageBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 123, 255, 0.9);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        z-index: 1001;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(languageBtn);
    
    // 获取当前语言状态
    let currentLanguage = localStorage.getItem('website-language') || 'zh';
    
    // 更新按钮文本
    function updateButtonText() {
        if (currentLanguage === 'zh') {
            languageBtn.innerHTML = '<i class="fas fa-globe"></i> EN';
        } else {
            languageBtn.innerHTML = '<i class="fas fa-globe"></i> 中文';
        }
    }
    
    // 切换语言函数
    function switchLanguage() {
        const elementsWithLang = document.querySelectorAll('[data-zh][data-en]');
        
        elementsWithLang.forEach(element => {
            const zhText = element.getAttribute('data-zh');
            const enText = element.getAttribute('data-en');
            
            if (currentLanguage === 'zh') {
                element.textContent = enText;
            } else {
                element.textContent = zhText;
            }
        });
        
        // 切换语言状态
        currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
        
        // 保存到本地存储
        localStorage.setItem('website-language', currentLanguage);
        
        // 更新按钮文本
        updateButtonText();
        
        // 添加切换动画效果
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 150);
    }
    
    // 初始化语言显示
    if (currentLanguage === 'en') {
        switchLanguage();
    }
    updateButtonText();
    
    // 绑定点击事件
    languageBtn.addEventListener('click', switchLanguage);
    
    // 鼠标悬停效果
    languageBtn.addEventListener('mouseenter', () => {
        languageBtn.style.transform = 'scale(1.05)';
        languageBtn.style.background = 'rgba(0, 123, 255, 1)';
    });
    
    languageBtn.addEventListener('mouseleave', () => {
        languageBtn.style.transform = 'scale(1)';
        languageBtn.style.background = 'rgba(0, 123, 255, 0.9)';
    });
    
    // 响应式调整
    function adjustButtonPosition() {
        if (window.innerWidth <= 768) {
            languageBtn.style.top = '15px';
            languageBtn.style.right = '15px';
            languageBtn.style.padding = '8px 12px';
            languageBtn.style.fontSize = '12px';
        } else {
            languageBtn.style.top = '20px';
            languageBtn.style.right = '20px';
            languageBtn.style.padding = '10px 15px';
            languageBtn.style.fontSize = '14px';
        }
    }
    
    // 初始调整
    adjustButtonPosition();
    
    // 监听窗口大小变化
    window.addEventListener('resize', adjustButtonPosition);
}
// 产品轮播功能
function initProductCarousel() {
    const slides = document.querySelectorAll('.product-slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // 自动轮播
    setInterval(nextSlide, 4000);
    
    // VR体验按钮点击事件
    const vrBtn = document.querySelector('.vr-btn');
    if (vrBtn) {
        vrBtn.addEventListener('click', function() {
            // 这里可以添加VR体验的逻辑
            alert('VR体验功能开发中...');
        });
    }
}

// 品牌实力动画
function initStrengthAnimation() {
    const strengthItems = document.querySelectorAll('.strength-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    });
    
    strengthItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
}

// 初始化新功能
// 视频背景和打字机动画初始化
function initHeroVideo() {
    try {
        const video = document.querySelector('.hero-background-video');
        const typewriterText = document.querySelector('.typewriter-text');
        
        // 视频加载优化
        if (video) {
            video.addEventListener('loadeddata', function() {
                console.log('视频加载完成');
            });
            
            video.addEventListener('error', function() {
                console.warn('视频加载失败，使用后备图片');
                const fallback = document.querySelector('.video-fallback');
                if (fallback) {
                    fallback.style.display = 'block';
                }
            });
        }
        
        // 打字机动画重启功能
        if (typewriterText) {
            setTimeout(() => {
                typewriterText.style.animation = 'none';
                typewriterText.offsetHeight; // 触发重排
                typewriterText.style.animation = 'typewriter 4s steps(40, end), blink-caret 0.75s step-end infinite';
            }, 100);
        }
        
        console.log('视频背景初始化完成');
    } catch (error) {
        console.error('视频背景初始化失败:', error);
    }
}

// 动态计数器动画
function initCounterAnimations() {
    try {
        const counters = document.querySelectorAll('.counter-animation');
        
        function animateCounter(counter) {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // 2秒动画
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            counter.classList.add('counting');
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    counter.classList.remove('counting');
                }
                counter.textContent = Math.floor(current) + suffix;
            }, 16);
        }
        
        // 使用Intersection Observer触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
        
        console.log('动态计数器初始化完成');
    } catch (error) {
        console.error('动态计数器初始化失败:', error);
    }
}

// 页面锚点进度指示器
function initScrollProgress() {
    try {
        // 创建进度指示器
        const progressContainer = document.createElement('div');
        progressContainer.className = 'scroll-progress';
        
        const sections = ['home', 'products', 'about', 'cases', 'franchise', 'purchase', 'contact'];
        const sectionNames = ['首页', '选材', '关于', '案例', '加盟', '购买', '联系'];
        
        sections.forEach((sectionId, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            dot.setAttribute('data-section', sectionId);
            dot.setAttribute('title', sectionNames[index]);
            
            dot.addEventListener('click', () => {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
            
            progressContainer.appendChild(dot);
        });
        
        document.body.appendChild(progressContainer);
        
        // 滚动监听更新活动状态
        function updateProgress() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const dots = document.querySelectorAll('.progress-dot');
            
            sections.forEach((sectionId, index) => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const sectionTop = section.offsetTop - 100;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                        dots.forEach(dot => dot.classList.remove('active'));
                        dots[index].classList.add('active');
                    }
                }
            });
        }
        
        window.addEventListener('scroll', updateProgress);
        updateProgress(); // 初始化
        
        console.log('页面锚点进度指示器初始化完成');
    } catch (error) {
        console.error('页面锚点进度指示器初始化失败:', error);
    }
}

// SVG动画图标功能
function initSVGAnimations() {
    try {
        // 防水图标动画
        const waterproofIcon = `
            <svg class="animated-icon waterproof-icon" viewBox="0 0 100 100" width="60" height="60">
                <defs>
                    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#4FC3F7;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#29B6F6;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path class="water-drop" d="M50 20 C30 40, 30 60, 50 80 C70 60, 70 40, 50 20 Z" fill="url(#waterGradient)">
                    <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="2s" repeatCount="indefinite"/>
                </path>
                <circle class="ripple" cx="50" cy="50" r="35" fill="none" stroke="#4FC3F7" stroke-width="2" opacity="0">
                    <animate attributeName="r" values="35;45;35" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.7;0" dur="2s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;
        
        // 隔热图标动画
        const thermalIcon = `
            <svg class="animated-icon thermal-icon" viewBox="0 0 100 100" width="60" height="60">
                <defs>
                    <linearGradient id="heatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#FF5722;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#FF9800;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFC107;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect x="20" y="30" width="60" height="40" fill="url(#heatGradient)" rx="5">
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
                </rect>
                <path class="heat-wave" d="M25 25 Q30 20 35 25 Q40 30 45 25 Q50 20 55 25 Q60 30 65 25 Q70 20 75 25" 
                      stroke="#FF5722" stroke-width="2" fill="none" opacity="0.8">
                    <animateTransform attributeName="transform" type="translateY" values="0;-5;0" dur="1s" repeatCount="indefinite"/>
                </path>
            </svg>
        `;
        
        // 将SVG图标添加到相应的卡片中
        const cards = document.querySelectorAll('.premium-card');
        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            const iconContainer = card.querySelector('.card-icon');
            
            if (iconContainer) {
                iconContainer.addEventListener('mouseenter', () => {
                    if (category === 'glass' && !iconContainer.querySelector('.waterproof-icon')) {
                        iconContainer.innerHTML += waterproofIcon;
                    } else if (category === 'thermal' && !iconContainer.querySelector('.thermal-icon')) {
                        iconContainer.innerHTML += thermalIcon;
                    }
                });
            }
        });
        
        console.log('SVG动画图标初始化完成');
    } catch (error) {
        console.error('SVG动画图标初始化失败:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initProductCarousel();
    initStrengthAnimation();
    initSVGAnimations();
});

// 收益计算器功能
function initROICalculator() {
    try {
        const calculator = document.querySelector('.roi-calculator-section');
        if (!calculator) return;
        
        const citySelect = document.getElementById('city-select');
        const storeArea = document.getElementById('store-area');
        const investmentAmount = document.getElementById('investment-amount');
        const calculateBtn = document.getElementById('calculate-btn');
        
        const annualRevenueEl = document.getElementById('annual-revenue');
        const roiPeriodEl = document.getElementById('roi-period');
        const profitRateEl = document.getElementById('profit-rate');
        
        // 城市系数配置
        const cityMultipliers = {
            'tier1': { revenue: 1.5, cost: 1.3 },
            'tier2': { revenue: 1.2, cost: 1.1 },
            'tier3': { revenue: 1.0, cost: 1.0 },
            'tier4': { revenue: 0.8, cost: 0.9 }
        };
        
        function calculateROI() {
            const cityType = citySelect.value;
            const area = parseFloat(storeArea.value) || 0;
            const investment = parseFloat(investmentAmount.value) || 0;
            
            const multiplier = cityMultipliers[cityType] || cityMultipliers.tier3;
            
            // 基础年收益计算（每平米基础收益2000元）
            const baseRevenue = area * 2000;
            const annualRevenue = baseRevenue * multiplier.revenue;
            
            // 年运营成本（投资额的30%）
            const annualCost = investment * 10000 * 0.3 * multiplier.cost;
            
            // 年净利润
            const annualProfit = annualRevenue - annualCost;
            
            // 投资回报周期（月）
            const roiPeriod = annualProfit > 0 ? (investment * 10000 / annualProfit * 12) : 0;
            
            // 年利润率
            const profitRate = investment > 0 ? (annualProfit / (investment * 10000) * 100) : 0;
            
            // 更新显示
            updateCounterAnimation(annualRevenueEl, Math.round(annualRevenue / 10000), '万元');
            updateCounterAnimation(roiPeriodEl, Math.round(roiPeriod), '个月');
            updateCounterAnimation(profitRateEl, Math.round(profitRate), '%');
        }
        
        function updateCounterAnimation(element, targetValue, suffix) {
            if (!element) return;
            
            const startValue = 0;
            const duration = 1500;
            const startTime = performance.now();
            
            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // 使用缓动函数
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuart);
                
                element.textContent = currentValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        // 绑定事件
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateROI);
        }
        
        // 输入变化时自动计算
        [citySelect, storeArea, investmentAmount].forEach(element => {
            if (element) {
                element.addEventListener('change', calculateROI);
                element.addEventListener('input', calculateROI);
            }
        });
        
        // 初始计算
        calculateROI();
        
        console.log('收益计算器初始化完成');
    } catch (error) {
        console.error('收益计算器初始化失败:', error);
    }
}

// 3D技术图谱功能
function initTechBlueprint() {
    try {
        const blueprint = document.querySelector('.tech-blueprint');
        if (!blueprint) return;
        
        const techItems = blueprint.querySelectorAll('.tech-item');
        const infoPanel = blueprint.querySelector('.tech-info-panel');
        
        // 技术点数据
        const techData = {
            'insulation': {
                title: '隔热性能技术',
                description: '采用先进的断桥铝技术和多腔体结构，实现卓越的隔热性能，有效降低能耗。',
                features: ['断桥铝结构', '多腔体设计', '低传热系数', '节能环保'],
                workingPrinciple: '通过断桥铝型材阻断热传导路径，配合多腔体结构形成空气隔热层，大幅降低热量传递。'
            },
            'soundproof': {
                title: '隔音降噪技术',
                description: '采用中空玻璃和多道密封技术，有效阻隔外界噪音，营造宁静舒适的室内环境。',
                features: ['中空玻璃', '多道密封', '吸音材料', '降噪设计'],
                workingPrinciple: '中空玻璃层间空气起到隔音作用，多道密封条阻断声音传播路径，实现优异隔音效果。'
            },
            'waterproof': {
                title: '防水密封技术',
                description: '采用等压排水原理和三道密封设计，确保在恶劣天气条件下的完全防水。',
                features: ['等压排水', '三道密封', '防水胶条', '排水槽设计'],
                workingPrinciple: '通过等压排水系统平衡内外压力，三道密封确保雨水无法渗透，排水槽及时排除积水。'
            },
            'windproof': {
                title: '抗风压技术',
                description: '采用加强型材和多点锁闭系统，确保在强风环境下的结构稳定性和安全性。',
                features: ['加强型材', '多点锁闭', '钢质加强', '结构优化'],
                workingPrinciple: '通过增加型材壁厚和钢质加强筋提升结构强度，多点锁闭系统分散风压载荷。'
            },
            'durability': {
                title: '耐久性技术',
                description: '采用氟碳喷涂和优质材料，确保产品在各种环境条件下的长期稳定性能。',
                features: ['氟碳喷涂', '优质铝材', '抗老化', '耐腐蚀'],
                workingPrinciple: '氟碳涂层提供优异的耐候性和抗腐蚀性，优质铝材确保结构长期稳定。'
            },
            'security': {
                title: '安全防护技术',
                description: '采用多点锁闭系统和防盗设计，提供全方位的安全防护，保障家居安全。',
                features: ['多点锁闭', '防盗设计', '安全玻璃', '智能锁具'],
                workingPrinciple: '多点锁闭系统增加锁闭点数量，防盗设计提升撬锁难度，安全玻璃防止暴力破坏。'
            }
        };
        
        // 技术项交互
        techItems.forEach(item => {
            const techId = item.getAttribute('data-tech');
            
            item.addEventListener('mouseenter', () => {
                // 高亮当前技术项
                techItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // 显示技术信息
                if (techData[techId] && infoPanel) {
                    const data = techData[techId];
                    infoPanel.innerHTML = `
                        <h4>${data.title}</h4>
                        <p>${data.description}</p>
                        <div class="working-principle">
                            <h5>工作原理：</h5>
                            <p>${data.workingPrinciple}</p>
                        </div>
                        <ul class="tech-features">
                            ${data.features.map(feature => `<li><i class="fas fa-check"></i>${feature}</li>`).join('')}
                        </ul>
                    `;
                    infoPanel.classList.add('visible');
                }
            });
            
            item.addEventListener('mouseleave', () => {
                // 移除悬停效果
                item.classList.remove('active');
            });
            
            item.addEventListener('click', () => {
                // 点击时显示详细信息模态框
                if (techData[techId]) {
                    showTechModal(techData[techId]);
                }
            });
        });
        
        // 隐藏信息面板
        blueprint.addEventListener('mouseleave', () => {
            if (infoPanel) {
                infoPanel.classList.remove('visible');
            }
            techItems.forEach(i => i.classList.remove('active'));
        });
        
        // 添加CSS动画样式
        const style = document.createElement('style');
        style.textContent = `
            .tech-info-panel {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 20px;
                max-width: 400px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                color: #333;
            }
            
            .tech-info-panel.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .tech-info-panel h4 {
                margin: 0 0 10px 0;
                color: #007bff;
                font-size: 18px;
            }
            
            .tech-info-panel h5 {
                margin: 15px 0 5px 0;
                color: #333;
                font-size: 14px;
            }
            
            .tech-info-panel p {
                margin: 0 0 10px 0;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .tech-features {
                list-style: none;
                padding: 0;
                margin: 10px 0 0 0;
            }
            
            .tech-features li {
                padding: 5px 0;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .tech-features li i {
                color: #28a745;
                font-size: 12px;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        console.log('3D技术图谱初始化完成');
     } catch (error) {
         console.error('3D技术图谱初始化失败:', error);
     }
 }
 
 // 显示技术详情模态框
 function showTechModal(techData) {
     // 创建模态框HTML
     const modalHTML = `
         <div class="tech-modal-overlay" id="techModal">
             <div class="tech-modal">
                 <div class="tech-modal-header">
                     <h3>${techData.title}</h3>
                     <button class="tech-modal-close" onclick="closeTechModal()">
                         <i class="fas fa-times"></i>
                     </button>
                 </div>
                 <div class="tech-modal-body">
                     <div class="tech-modal-content">
                         <div class="tech-description">
                             <h4>技术描述</h4>
                             <p>${techData.description}</p>
                         </div>
                         <div class="working-principle">
                             <h4>工作原理</h4>
                             <p>${techData.workingPrinciple}</p>
                         </div>
                         <div class="tech-features">
                             <h4>技术特点</h4>
                             <ul>
                                 ${techData.features.map(feature => `<li><i class="fas fa-check-circle"></i>${feature}</li>`).join('')}
                             </ul>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     `;
     
     // 添加到页面
     document.body.insertAdjacentHTML('beforeend', modalHTML);
     
     // 添加模态框样式
     const modalStyle = document.createElement('style');
     modalStyle.textContent = `
         .tech-modal-overlay {
             position: fixed;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             background: rgba(0, 0, 0, 0.8);
             display: flex;
             justify-content: center;
             align-items: center;
             z-index: 10000;
             opacity: 0;
             animation: fadeIn 0.3s ease forwards;
         }
         
         .tech-modal {
             background: white;
             border-radius: 20px;
             max-width: 600px;
             width: 90%;
             max-height: 80vh;
             overflow-y: auto;
             transform: scale(0.8);
             animation: modalSlideIn 0.3s ease forwards;
             box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
         }
         
         .tech-modal-header {
             padding: 25px 30px 20px;
             border-bottom: 1px solid #eee;
             display: flex;
             justify-content: space-between;
             align-items: center;
             background: linear-gradient(135deg, #007bff, #0056b3);
             color: white;
             border-radius: 20px 20px 0 0;
         }
         
         .tech-modal-header h3 {
             margin: 0;
             font-size: 24px;
             font-weight: 600;
         }
         
         .tech-modal-close {
             background: none;
             border: none;
             color: white;
             font-size: 20px;
             cursor: pointer;
             padding: 5px;
             border-radius: 50%;
             transition: background 0.3s ease;
         }
         
         .tech-modal-close:hover {
             background: rgba(255, 255, 255, 0.2);
         }
         
         .tech-modal-body {
             padding: 30px;
         }
         
         .tech-modal-content h4 {
             color: #007bff;
             margin: 0 0 15px 0;
             font-size: 18px;
             font-weight: 600;
         }
         
         .tech-modal-content p {
             line-height: 1.6;
             color: #555;
             margin-bottom: 25px;
         }
         
         .tech-modal-content ul {
             list-style: none;
             padding: 0;
         }
         
         .tech-modal-content li {
             padding: 8px 0;
             display: flex;
             align-items: center;
             gap: 10px;
             color: #333;
         }
         
         .tech-modal-content li i {
             color: #28a745;
             font-size: 16px;
         }
         
         @keyframes fadeIn {
             to { opacity: 1; }
         }
         
         @keyframes modalSlideIn {
             to { transform: scale(1); }
         }
         
         @media (max-width: 768px) {
             .tech-modal {
                 width: 95%;
                 margin: 20px;
             }
             
             .tech-modal-header {
                 padding: 20px;
             }
             
             .tech-modal-body {
                 padding: 20px;
             }
         }
     `;
     document.head.appendChild(modalStyle);
     
     // 点击遮罩层关闭模态框
     document.getElementById('techModal').addEventListener('click', (e) => {
         if (e.target.classList.contains('tech-modal-overlay')) {
             closeTechModal();
         }
     });
 }
 
 // 关闭技术模态框
 function closeTechModal() {
     const modal = document.getElementById('techModal');
     if (modal) {
         modal.style.animation = 'fadeOut 0.3s ease forwards';
         setTimeout(() => {
             modal.remove();
         }, 300);
     }
 }
 
 // 添加关闭动画
 const closeAnimationStyle = document.createElement('style');
 closeAnimationStyle.textContent = `
     @keyframes fadeOut {
         to { opacity: 0; }
     }
 `;
 document.head.appendChild(closeAnimationStyle);

// 显示技术详情模态框
function showTechModal(techData) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'tech-modal';
    modal.innerHTML = `
        <div class="tech-modal-content">
            <span class="tech-modal-close">&times;</span>
            <h3>${techData.title}</h3>
            <p>${techData.description}</p>
            <div class="tech-features-grid">
                ${techData.features.map(feature => `
                    <div class="feature-card">
                        <i class="fas fa-check-circle"></i>
                        <span>${feature}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 添加样式
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // 显示动画
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // 关闭功能
    const closeBtn = modal.querySelector('.tech-modal-close');
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // ESC键关闭
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}