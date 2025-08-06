// 网站分析和A/B测试配置
class AnalyticsConfig {
    constructor() {
        this.domain = 'oberle-china.com';
        this.gaTrackingId = 'GA_MEASUREMENT_ID'; // 替换为实际的GA4测量ID
        this.hotjarId = null; // 演示环境已禁用Hotjar
        this.experiments = new Map();
        this.heatmapAreas = [];
    }

    // 初始化Google Analytics 4
    initGA4() {
        return `
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${this.gaTrackingId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${this.gaTrackingId}', {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    // 增强电子商务
    enhanced_ecommerce: true,
    // 自定义维度
    custom_map: {
      'dimension1': 'user_type',
      'dimension2': 'page_category',
      'dimension3': 'experiment_variant'
    }
  });
  
  // 自定义事件跟踪
  function trackEvent(eventName, parameters = {}) {
    gtag('event', eventName, {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      ...parameters
    });
  }
  
  // 页面滚动跟踪
  let scrollDepths = [25, 50, 75, 90];
  let scrollTracked = [];
  
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    scrollDepths.forEach(depth => {
      if (scrollPercent >= depth && !scrollTracked.includes(depth)) {
        scrollTracked.push(depth);
        trackEvent('scroll_depth', {
          category: 'engagement',
          label: depth + '%',
          value: depth
        });
      }
    });
  });
  
  // 表单提交跟踪
  document.addEventListener('submit', function(e) {
    const form = e.target;
    trackEvent('form_submit', {
      category: 'conversion',
      label: form.id || form.className || 'unknown_form'
    });
  });
  
  // 点击跟踪
  document.addEventListener('click', function(e) {
    const element = e.target;
    
    // CTA按钮点击
    if (element.classList.contains('cta-button') || 
        element.classList.contains('btn-primary')) {
      trackEvent('cta_click', {
        category: 'conversion',
        label: element.textContent.trim() || element.getAttribute('aria-label')
      });
    }
    
    // 导航链接点击
    if (element.tagName === 'A' && element.closest('nav')) {
      trackEvent('navigation_click', {
        category: 'navigation',
        label: element.textContent.trim() || element.href
      });
    }
    
    // 电话号码点击
    if (element.tagName === 'A' && element.href.startsWith('tel:')) {
      trackEvent('phone_click', {
        category: 'contact',
        label: element.href.replace('tel:', '')
      });
    }
  });
  
  // 视频播放跟踪
  document.addEventListener('play', function(e) {
    if (e.target.tagName === 'VIDEO') {
      trackEvent('video_play', {
        category: 'engagement',
        label: e.target.src || e.target.currentSrc || 'unknown_video'
      });
    }
  }, true);
  
  // 页面停留时间跟踪
  let startTime = Date.now();
  let timeOnPage = 0;
  
  setInterval(function() {
    timeOnPage = Math.round((Date.now() - startTime) / 1000);
    
    // 每30秒发送一次心跳
    if (timeOnPage % 30 === 0 && timeOnPage > 0) {
      trackEvent('time_on_page', {
        category: 'engagement',
        label: 'heartbeat',
        value: timeOnPage
      });
    }
  }, 1000);
  
  // 页面离开时发送最终时间
  window.addEventListener('beforeunload', function() {
    trackEvent('time_on_page', {
      category: 'engagement',
      label: 'final',
      value: Math.round((Date.now() - startTime) / 1000)
    });
  });
</script>`;
    }

    // 初始化Hotjar热力图
    initHotjar() {
        return `
<!-- Hotjar Tracking Code -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${this.hotjarId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    
    // 自定义热力图事件
    function triggerHotjarEvent(eventName, data = {}) {
        if (window.hj) {
            hj('event', eventName);
            console.log('Hotjar事件触发:', eventName, data);
        }
    }
    
    // 关键区域进入视口时触发事件
    const observeHeatmapAreas = function() {
        const areas = [
            { selector: '.hero-section', event: 'hero_viewed' },
            { selector: '.cta-section', event: 'cta_viewed' },
            { selector: '.product-showcase', event: 'products_viewed' },
            { selector: '.contact-form', event: 'contact_form_viewed' },
            { selector: '.testimonials', event: 'testimonials_viewed' }
        ];
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const area = areas.find(a => entry.target.matches(a.selector));
                    if (area) {
                        triggerHotjarEvent(area.event);
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        areas.forEach(function(area) {
            const elements = document.querySelectorAll(area.selector);
            elements.forEach(function(el) {
                observer.observe(el);
            });
        });
    };
    
    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeHeatmapAreas);
    } else {
        observeHeatmapAreas();
    }
</script>`;
    }

    // A/B测试框架
    createABTest(testName, variants, config = {}) {
        const test = {
            name: testName,
            variants: variants,
            traffic: config.traffic || 1.0, // 参与测试的流量比例
            duration: config.duration || 30, // 测试持续天数
            startDate: config.startDate || new Date(),
            endDate: config.endDate || new Date(Date.now() + (config.duration || 30) * 24 * 60 * 60 * 1000),
            targetMetric: config.targetMetric || 'conversion_rate',
            minSampleSize: config.minSampleSize || 1000,
            confidenceLevel: config.confidenceLevel || 0.95,
            active: true
        };
        
        this.experiments.set(testName, test);
        return test;
    }

    // 生成A/B测试脚本
    generateABTestScript() {
        return `
// A/B测试框架
class ABTestFramework {
    constructor() {
        this.experiments = new Map();
        this.userVariants = new Map();
        this.cookieName = 'ab_test_variants';
        this.loadUserVariants();
    }
    
    // 加载用户的测试变体
    loadUserVariants() {
        const cookie = this.getCookie(this.cookieName);
        if (cookie) {
            try {
                const variants = JSON.parse(decodeURIComponent(cookie));
                Object.entries(variants).forEach(([test, variant]) => {
                    this.userVariants.set(test, variant);
                });
            } catch (e) {
                console.warn('A/B测试cookie解析失败:', e);
            }
        }
    }
    
    // 保存用户的测试变体
    saveUserVariants() {
        const variants = Object.fromEntries(this.userVariants);
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30天
        this.setCookie(this.cookieName, encodeURIComponent(JSON.stringify(variants)), expires);
    }
    
    // 创建A/B测试
    createTest(testName, variants, config = {}) {
        const test = {
            name: testName,
            variants: variants,
            traffic: config.traffic || 1.0,
            active: config.active !== false,
            targetSelector: config.targetSelector,
            onVariantAssigned: config.onVariantAssigned || function() {}
        };
        
        this.experiments.set(testName, test);
        return test;
    }
    
    // 获取用户的测试变体
    getVariant(testName) {
        const test = this.experiments.get(testName);
        if (!test || !test.active) {
            return null;
        }
        
        // 检查是否已分配变体
        if (this.userVariants.has(testName)) {
            return this.userVariants.get(testName);
        }
        
        // 检查流量分配
        if (Math.random() > test.traffic) {
            return null;
        }
        
        // 随机分配变体
        const variants = Object.keys(test.variants);
        const variant = variants[Math.floor(Math.random() * variants.length)];
        
        // 保存分配结果
        this.userVariants.set(testName, variant);
        this.saveUserVariants();
        
        // 触发回调
        test.onVariantAssigned(variant, test.variants[variant]);
        
        // 发送分析事件
        if (typeof trackEvent === 'function') {
            trackEvent('ab_test_assigned', {
                category: 'experiment',
                label: testName + ':' + variant
            });
        }
        
        return variant;
    }
    
    // 应用测试变体
    applyVariant(testName, variantName = null) {
        const test = this.experiments.get(testName);
        if (!test) return false;
        
        const variant = variantName || this.getVariant(testName);
        if (!variant || !test.variants[variant]) return false;
        
        const variantConfig = test.variants[variant];
        
        // 应用CSS变更
        if (variantConfig.css) {
            this.applyCSSChanges(variantConfig.css);
        }
        
        // 应用HTML变更
        if (variantConfig.html && test.targetSelector) {
            this.applyHTMLChanges(test.targetSelector, variantConfig.html);
        }
        
        // 应用JavaScript变更
        if (variantConfig.js && typeof variantConfig.js === 'function') {
            variantConfig.js();
        }
        
        return true;
    }
    
    // 应用CSS变更
    applyCSSChanges(cssRules) {
        const style = document.createElement('style');
        style.textContent = cssRules;
        style.setAttribute('data-ab-test', 'true');
        document.head.appendChild(style);
    }
    
    // 应用HTML变更
    applyHTMLChanges(selector, html) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (typeof html === 'string') {
                el.innerHTML = html;
            } else if (typeof html === 'function') {
                html(el);
            }
        });
    }
    
    // 记录转化事件
    recordConversion(testName, conversionType = 'default', value = 1) {
        const variant = this.userVariants.get(testName);
        if (!variant) return;
        
        if (typeof trackEvent === 'function') {
            trackEvent('ab_test_conversion', {
                category: 'experiment',
                label: testName + ':' + variant + ':' + conversionType,
                value: value
            });
        }
        
        // 发送到Hotjar
        if (typeof triggerHotjarEvent === 'function') {
            triggerHotjarEvent('ab_conversion_' + testName + '_' + variant);
        }
    }
    
    // Cookie操作
    getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    }
    
    setCookie(name, value, expires) {
        document.cookie = name + "=" + value + "; expires=" + expires.toUTCString() + "; path=/; SameSite=Lax";
    }
}

// 初始化A/B测试框架
const abTest = new ABTestFramework();

// 定义测试案例
// 1. CTA按钮颜色测试
abTest.createTest('cta_button_color', {
    'control': {
        css: '.cta-button { background-color: #007bff; }'
    },
    'variant_gold': {
        css: '.cta-button { background-color: #FFC107; color: #000; }'
    },
    'variant_green': {
        css: '.cta-button { background-color: #28a745; }'
    }
}, {
    traffic: 0.8,
    targetSelector: '.cta-button'
});

// 2. 表单字段数量测试
abTest.createTest('contact_form_fields', {
    'control': {
        // 保持原有表单
    },
    'simplified': {
        html: function(formElement) {
            // 简化表单，只保留必要字段
            const fields = formElement.querySelectorAll('.form-group');
            fields.forEach((field, index) => {
                if (index > 2) { // 只保留前3个字段
                    field.style.display = 'none';
                }
            });
        }
    }
}, {
    traffic: 0.5,
    targetSelector: '.contact-form'
});

// 3. 首屏标题测试
abTest.createTest('hero_headline', {
    'control': {
        // 保持原有标题
    },
    'benefit_focused': {
        html: '<h1>50年超长质保，让您的投资更安心</h1>'
    },
    'urgency_focused': {
        html: '<h1>限时优惠：高端系统门窗定制专家</h1>'
    }
}, {
    traffic: 0.6,
    targetSelector: '.hero-title'
});

// 应用所有测试
function initABTests() {
    abTest.applyVariant('cta_button_color');
    abTest.applyVariant('contact_form_fields');
    abTest.applyVariant('hero_headline');
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initABTests);
} else {
    initABTests();
}

// 转化事件监听
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.classList.contains('contact-form')) {
        abTest.recordConversion('contact_form_fields', 'form_submit');
        abTest.recordConversion('hero_headline', 'form_submit');
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-button')) {
        abTest.recordConversion('cta_button_color', 'cta_click');
        abTest.recordConversion('hero_headline', 'cta_click');
    }
});

// 导出到全局
window.abTest = abTest;
`;
    }

    // 生成性能监控脚本
    generatePerformanceMonitoring() {
        return `
// 性能监控和用户体验分析
class PerformanceAnalytics {
    constructor() {
        this.metrics = {};
        this.userActions = [];
        this.errors = [];
        this.init();
    }
    
    init() {
        this.measurePageLoad();
        this.measureCoreWebVitals();
        this.trackUserInteractions();
        this.trackErrors();
        this.setupReporting();
    }
    
    // 页面加载性能
    measurePageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            
            this.metrics.pageLoad = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
                firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                timeToInteractive: this.calculateTTI()
            };
            
            this.sendMetric('page_performance', this.metrics.pageLoad);
        });
    }
    
    // Core Web Vitals
    measureCoreWebVitals() {
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            this.sendMetric('lcp', { value: lastEntry.startTime });
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // FID (First Input Delay)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
                this.sendMetric('fid', { value: entry.processingStart - entry.startTime });
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.cls = clsValue;
            this.sendMetric('cls', { value: clsValue });
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    // 用户交互跟踪
    trackUserInteractions() {
        const interactions = ['click', 'scroll', 'keydown', 'touchstart'];
        
        interactions.forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                this.userActions.push({
                    type: eventType,
                    timestamp: Date.now(),
                    target: this.getElementSelector(e.target),
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                });
                
                // 限制数组大小
                if (this.userActions.length > 100) {
                    this.userActions.shift();
                }
            }, { passive: true });
        });
        
        // 滚动深度跟踪
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                this.metrics.maxScrollDepth = maxScrollDepth;
            }
        }, { passive: true });
    }
    
    // 错误跟踪
    trackErrors() {
        window.addEventListener('error', (e) => {
            this.errors.push({
                type: 'javascript',
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                timestamp: Date.now()
            });
            
            this.sendMetric('error', {
                type: 'javascript',
                message: e.message,
                source: e.filename
            });
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.errors.push({
                type: 'promise',
                reason: e.reason.toString(),
                timestamp: Date.now()
            });
            
            this.sendMetric('error', {
                type: 'promise',
                reason: e.reason.toString()
            });
        });
    }
    
    // 计算TTI (Time to Interactive)
    calculateTTI() {
        const navigation = performance.getEntriesByType('navigation')[0];
        return navigation.domInteractive - navigation.navigationStart;
    }
    
    // 获取元素选择器
    getElementSelector(element) {
        if (element.id) return '#' + element.id;
        if (element.className) return '.' + element.className.split(' ')[0];
        return element.tagName.toLowerCase();
    }
    
    // 发送指标
    sendMetric(name, data) {
        if (typeof trackEvent === 'function') {
            trackEvent('performance_metric', {
                category: 'performance',
                label: name,
                value: typeof data.value === 'number' ? Math.round(data.value) : 0,
                custom_parameters: data
            });
        }
    }
    
    // 设置定期报告
    setupReporting() {
        // 每5分钟发送一次用户行为报告
        setInterval(() => {
            if (this.userActions.length > 0) {
                this.sendMetric('user_interactions', {
                    count: this.userActions.length,
                    types: [...new Set(this.userActions.map(a => a.type))]
                });
            }
        }, 5 * 60 * 1000);
        
        // 页面卸载时发送最终报告
        window.addEventListener('beforeunload', () => {
            this.sendFinalReport();
        });
    }
    
    // 发送最终报告
    sendFinalReport() {
        const report = {
            metrics: this.metrics,
            userActions: this.userActions.length,
            errors: this.errors.length,
            sessionDuration: Date.now() - performance.timing.navigationStart
        };
        
        // 使用sendBeacon确保数据发送
        if (navigator.sendBeacon && typeof trackEvent === 'function') {
            trackEvent('session_end', {
                category: 'engagement',
                label: 'final_report',
                custom_parameters: report
            });
        }
    }
    
    // 获取性能报告
    getPerformanceReport() {
        return {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            metrics: this.metrics,
            userActions: this.userActions.slice(-20), // 最近20个操作
            errors: this.errors,
            recommendations: this.generateRecommendations()
        };
    }
    
    // 生成优化建议
    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics.lcp > 2500) {
            recommendations.push('LCP过高，建议优化图片加载和关键资源');
        }
        
        if (this.metrics.fid > 100) {
            recommendations.push('FID过高，建议优化JavaScript执行');
        }
        
        if (this.metrics.cls > 0.1) {
            recommendations.push('CLS过高，建议固定元素尺寸');
        }
        
        if (this.errors.length > 0) {
            recommendations.push('存在JavaScript错误，需要修复');
        }
        
        return recommendations;
    }
}

// 初始化性能监控
const performanceAnalytics = new PerformanceAnalytics();
window.performanceAnalytics = performanceAnalytics;
`;
    }

    // 生成完整的分析配置
    generateFullConfig() {
        return {
            ga4Script: this.initGA4(),
            hotjarScript: this.initHotjar(),
            abTestScript: this.generateABTestScript(),
            performanceScript: this.generatePerformanceMonitoring(),
            implementation: {
                htmlHead: `
${this.initGA4()}
${this.initHotjar()}
`,
                htmlBody: `
<script>
${this.generateABTestScript()}
${this.generatePerformanceMonitoring()}
</script>
`
            }
        };
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsConfig;
} else if (typeof window !== 'undefined') {
    window.AnalyticsConfig = AnalyticsConfig;
}

// 使用示例
if (require.main === module) {
    const analytics = new AnalyticsConfig();
    const fs = require('fs');
    
    console.log('📊 网站分析配置生成器');
    console.log('=' .repeat(40));
    
    const config = analytics.generateFullConfig();
    
    // 生成分析脚本文件
    fs.writeFileSync('./analytics-tracking.js', 
        config.abTestScript + '\n\n' + config.performanceScript
    );
    console.log('✅ 已生成 analytics-tracking.js');
    
    // 生成HTML集成代码
    fs.writeFileSync('./analytics-integration.html', `
<!DOCTYPE html>
<html>
<head>
    <!-- 在<head>中添加以下代码 -->
    ${config.htmlHead}
</head>
<body>
    <!-- 在</body>前添加以下代码 -->
    ${config.htmlBody}
</body>
</html>
    `);
    console.log('✅ 已生成 analytics-integration.html');
    
    // 生成配置文档
    const documentation = {
        setup: {
            ga4: '替换 GA_MEASUREMENT_ID 为实际的Google Analytics 4测量ID',
            hotjar: '替换 HOTJAR_SITE_ID 为实际的Hotjar站点ID',
            implementation: '将生成的代码添加到网站的HTML中'
        },
        abTests: {
            'cta_button_color': '测试CTA按钮颜色对转化率的影响',
            'contact_form_fields': '测试表单字段数量对提交率的影响',
            'hero_headline': '测试首屏标题对用户参与度的影响'
        },
        metrics: {
            'Core Web Vitals': 'LCP, FID, CLS自动监控',
            'User Interactions': '点击、滚动、键盘输入跟踪',
            'Performance': '页面加载时间、资源加载监控',
            'Errors': 'JavaScript错误和Promise拒绝跟踪'
        },
        recommendations: [
            '定期检查A/B测试结果并优化',
            '监控Core Web Vitals指标',
            '分析用户行为热力图',
            '根据性能数据优化页面',
            '及时修复JavaScript错误'
        ]
    };
    
    fs.writeFileSync('./analytics-documentation.json', JSON.stringify(documentation, null, 2));
    console.log('✅ 已生成 analytics-documentation.json');
    
    console.log('\n🎯 分析配置文件生成完成！');
    console.log('\n📋 配置清单:');
    console.log('  ✅ Google Analytics 4 跟踪');
    console.log('  ✅ Hotjar 热力图监控');
    console.log('  ✅ A/B 测试框架');
    console.log('  ✅ 性能监控系统');
    console.log('  ✅ 用户行为分析');
    console.log('  ✅ 错误跟踪系统');
}