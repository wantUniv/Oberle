// 性能优化配置文件
// 包含缓存策略、资源压缩、代码优化等配置

// Nginx配置生成器
function generateNginxConfig() {
    return `
# Nginx性能优化配置
server {
    listen 80;
    server_name www.oberle-jiancai.com oberle-jiancai.com;
    
    # 启用Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/svg+xml;
    
    # 静态资源缓存策略
    location ~* \.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # 启用ETag
        etag on;
        
        # 压缩静态文件
        gzip_static on;
    }
    
    # HTML文件缓存策略
    location ~* \.(html|htm)$ {
        expires 10m;
        add_header Cache-Control "public, must-revalidate";
        add_header Vary "Accept-Encoding";
    }
    
    # WebP图片优先级
    location ~* \.(jpe?g|png)$ {
        add_header Vary Accept;
        try_files $uri$webp_suffix $uri =404;
    }
    
    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # CSP策略
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https:; font-src 'self' https://cdnjs.cloudflare.com; connect-src 'self';" always;
}
`;
}

// Cloudflare缓存规则配置
function generateCloudflareRules() {
    return {
        "page_rules": [
            {
                "url": "*.oberle-jiancai.com/*.css",
                "actions": {
                    "cache_level": "cache_everything",
                    "edge_cache_ttl": 31536000,  // 1年
                    "browser_cache_ttl": 31536000
                }
            },
            {
                "url": "*.oberle-jiancai.com/*.js",
                "actions": {
                    "cache_level": "cache_everything",
                    "edge_cache_ttl": 31536000,
                    "browser_cache_ttl": 31536000
                }
            },
            {
                "url": "*.oberle-jiancai.com/*.webp",
                "actions": {
                    "cache_level": "cache_everything",
                    "edge_cache_ttl": 31536000,
                    "browser_cache_ttl": 31536000
                }
            },
            {
                "url": "oberle-jiancai.com/",
                "actions": {
                    "cache_level": "cache_everything",
                    "edge_cache_ttl": 600,  // 10分钟
                    "browser_cache_ttl": 600
                }
            }
        ]
    };
}

// 关键CSS提取配置
function getCriticalCSS() {
    return `
/* 关键CSS - 首屏渲染必需 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #fff;
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.hero-section {
    height: 100vh;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -2;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 123, 255, 0.7), rgba(102, 126, 234, 0.7));
    z-index: -1;
}

.hero-text {
    text-align: center;
    color: white;
    z-index: 1;
    max-width: 800px;
    padding: 0 20px;
}

.hero-text h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    margin-bottom: 20px;
    font-weight: bold;
}

.cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #FFC107, #FF8F00);
    color: #333;
    padding: 15px 30px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3);
}

.cta-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(255, 193, 7, 0.4);
}

/* 加载动画 */
.page-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 1;
    transition: opacity 0.5s ease;
}

.page-loader.hidden {
    opacity: 0;
    pointer-events: none;
}
`;
}

// 代码分割配置
function getCodeSplittingConfig() {
    return {
        "critical": [
            "header navigation",
            "hero section",
            "basic animations",
            "mobile menu"
        ],
        "deferred": [
            "carousel functionality",
            "form validation",
            "scroll animations",
            "modal dialogs",
            "roi calculator",
            "tech blueprint"
        ],
        "lazy": [
            "image galleries",
            "video players",
            "social widgets",
            "analytics"
        ]
    };
}

// 资源预加载配置
function getPreloadConfig() {
    return {
        "fonts": [
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-brands-400.woff2"
        ],
        "critical_images": [
            "images/webp/lunbotu (1).webp",
            "images/webp/gongsi.webp"
        ],
        "critical_css": [
            "styles.css"
        ],
        "critical_js": [
            "script.js"
        ]
    };
}

// 性能监控配置
function getPerformanceMonitoring() {
    return `
// 性能监控代码
function initPerformanceMonitoring() {
    // Core Web Vitals 监控
    if ('web-vitals' in window) {
        import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
    
    // 自定义性能指标
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const metrics = {
            'DNS查询': perfData.domainLookupEnd - perfData.domainLookupStart,
            'TCP连接': perfData.connectEnd - perfData.connectStart,
            '首字节时间': perfData.responseStart - perfData.requestStart,
            'DOM解析': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            '页面加载': perfData.loadEventEnd - perfData.loadEventStart,
            '总加载时间': perfData.loadEventEnd - perfData.navigationStart
        };
        
        console.table(metrics);
        
        // 发送到分析服务（可选）
        if (metrics['总加载时间'] > 3000) {
            console.warn('页面加载时间超过3秒，需要优化');
        }
    });
}

// 资源加载优化
function optimizeResourceLoading() {
    // 预加载关键资源
    const criticalResources = [
        { href: 'images/webp/lunbotu (1).webp', as: 'image' },
        { href: 'images/webp/gongsi.webp', as: 'image' }
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        document.head.appendChild(link);
    });
    
    // 延迟加载非关键资源
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // 加载非关键CSS
            const nonCriticalCSS = document.querySelectorAll('link[rel="preload"][as="style"]');
            nonCriticalCSS.forEach(link => {
                link.rel = 'stylesheet';
            });
        });
    }
}

// 初始化性能优化
document.addEventListener('DOMContentLoaded', () => {
    initPerformanceMonitoring();
    optimizeResourceLoading();
});
`;
}

module.exports = {
    generateNginxConfig,
    generateCloudflareRules,
    getCriticalCSS,
    getCodeSplittingConfig,
    getPreloadConfig,
    getPerformanceMonitoring
};