// SEO优化配置和工具
class SEOOptimizer {
    constructor() {
        this.siteConfig = {
            domain: 'https://www.oberle-china.com',
            siteName: '江西欧伯乐建材科技有限公司',
            description: '专业系统门窗定制专家，提供断桥铝门窗、智能门窗解决方案，50年品质保证，全国招商加盟',
            keywords: [
                '系统门窗加盟', '断桥铝门窗', '隔音门窗', '智能门窗',
                '别墅门窗定制', '江西门窗厂家', '门窗招商', '高端门窗'
            ],
            author: '江西欧伯乐建材科技有限公司',
            language: 'zh-CN',
            region: 'CN-JX'
        };
        
        this.structuredData = this.generateStructuredData();
    }

    // 生成JSON-LD结构化数据
    generateStructuredData() {
        return {
            // 公司信息
            organization: {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "江西欧伯乐建材科技有限公司",
                "url": "https://www.oberle-china.com",
                "logo": "https://www.oberle-china.com/images/logo.png",
                "description": "专业系统门窗定制专家，提供断桥铝门窗、智能门窗解决方案",
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "CN",
                    "addressRegion": "江西省",
                    "addressLocality": "南昌市",
                    "streetAddress": "高新技术产业开发区"
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+86-400-123-4567",
                    "contactType": "customer service",
                    "availableLanguage": "Chinese"
                },
                "sameAs": [
                    "https://weibo.com/oberle",
                    "https://www.linkedin.com/company/oberle"
                ]
            },

            // 产品信息
            products: [
                {
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": "断桥铝系统门窗",
                    "description": "采用德国工艺，50年使用寿命，40dB隔音效果，抗风压等级12级",
                    "brand": {
                        "@type": "Brand",
                        "name": "欧伯乐"
                    },
                    "manufacturer": {
                        "@type": "Organization",
                        "name": "江西欧伯乐建材科技有限公司"
                    },
                    "offers": {
                        "@type": "Offer",
                        "priceCurrency": "CNY",
                        "availability": "https://schema.org/InStock",
                        "seller": {
                            "@type": "Organization",
                            "name": "江西欧伯乐建材科技有限公司"
                        }
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.8",
                        "reviewCount": "1250",
                        "bestRating": "5",
                        "worstRating": "1"
                    }
                }
            ],

            // 服务信息
            service: {
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "门窗定制安装服务",
                "description": "提供专业的门窗测量、定制、安装和售后服务",
                "provider": {
                    "@type": "Organization",
                    "name": "江西欧伯乐建材科技有限公司"
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "中国"
                },
                "serviceType": "门窗定制安装"
            },

            // 网站信息
            website: {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "江西欧伯乐建材科技有限公司官网",
                "url": "https://www.oberle-china.com",
                "description": "专业系统门窗定制专家，提供断桥铝门窗、智能门窗解决方案",
                "inLanguage": "zh-CN",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.oberle-china.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            }
        };
    }

    // 生成站点地图
    generateSitemap() {
        const pages = [
            { url: '/', priority: '1.0', changefreq: 'daily' },
            { url: '/products', priority: '0.9', changefreq: 'weekly' },
            { url: '/cases', priority: '0.8', changefreq: 'weekly' },
            { url: '/about', priority: '0.7', changefreq: 'monthly' },
            { url: '/franchise', priority: '0.9', changefreq: 'weekly' },
            { url: '/contact', priority: '0.6', changefreq: 'monthly' }
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages.map(page => `
  <url>
    <loc>${this.siteConfig.domain}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${this.generateImageSitemap(page.url)}
  </url>`).join('')}
</urlset>`;

        return sitemap;
    }

    // 生成图片站点地图
    generateImageSitemap(pageUrl) {
        const imageMap = {
            '/': [
                'images/lunbotu (1).jpg',
                'images/gongsi.jpg',
                'images/logo.png'
            ],
            '/products': [
                'images/lvcai.jpg',
                'images/heijin.jpg',
                'images/xiangbin.jpg'
            ]
        };

        const images = imageMap[pageUrl] || [];
        return images.map(img => `
    <image:image>
      <image:loc>${this.siteConfig.domain}/${img}</image:loc>
      <image:title>${img.split('/').pop().split('.')[0]}</image:title>
    </image:image>`).join('');
    }

    // 生成robots.txt
    generateRobotsTxt() {
        return `User-agent: *
Allow: /

# 禁止访问敏感目录
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$
Disallow: /*.log$

# 站点地图
Sitemap: ${this.siteConfig.domain}/sitemap.xml
Sitemap: ${this.siteConfig.domain}/sitemap-images.xml

# 爬取延迟
Crawl-delay: 1`;
    }

    // 生成Meta标签
    generateMetaTags(pageData = {}) {
        const defaultData = {
            title: '江西欧伯乐建材科技有限公司 - 专业系统门窗定制专家',
            description: this.siteConfig.description,
            keywords: this.siteConfig.keywords.join(', '),
            image: `${this.siteConfig.domain}/images/og-image.jpg`,
            url: this.siteConfig.domain
        };

        const data = { ...defaultData, ...pageData };

        return `
<!-- 基础Meta标签 -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${data.description}">
<meta name="keywords" content="${data.keywords}">
<meta name="author" content="${this.siteConfig.author}">
<meta name="robots" content="index, follow">
<meta name="language" content="${this.siteConfig.language}">
<meta name="geo.region" content="${this.siteConfig.region}">

<!-- Open Graph标签 -->
<meta property="og:type" content="website">
<meta property="og:title" content="${data.title}">
<meta property="og:description" content="${data.description}">
<meta property="og:image" content="${data.image}">
<meta property="og:url" content="${data.url}">
<meta property="og:site_name" content="${this.siteConfig.siteName}">
<meta property="og:locale" content="zh_CN">

<!-- Twitter Card标签 -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${data.title}">
<meta name="twitter:description" content="${data.description}">
<meta name="twitter:image" content="${data.image}">

<!-- 移动端优化 -->
<meta name="format-detection" content="telephone=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- 搜索引擎验证 -->
<meta name="baidu-site-verification" content="codeva-your-verification-code">
<meta name="google-site-verification" content="your-google-verification-code">

<!-- 缓存控制 -->
<meta http-equiv="Cache-Control" content="max-age=3600">
<meta http-equiv="Expires" content="${new Date(Date.now() + 3600000).toUTCString()}">`;
    }

    // 生成结构化数据脚本
    generateStructuredDataScript() {
        return `
<!-- 结构化数据 -->
<script type="application/ld+json">
${JSON.stringify(this.structuredData.organization, null, 2)}
</script>

<script type="application/ld+json">
${JSON.stringify(this.structuredData.products[0], null, 2)}
</script>

<script type="application/ld+json">
${JSON.stringify(this.structuredData.service, null, 2)}
</script>

<script type="application/ld+json">
${JSON.stringify(this.structuredData.website, null, 2)}
</script>`;
    }

    // 关键词密度分析
    analyzeKeywordDensity(content) {
        const words = content.toLowerCase().match(/[\u4e00-\u9fa5a-z]+/g) || [];
        const wordCount = {};
        const totalWords = words.length;

        words.forEach(word => {
            if (word.length > 1) {
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });

        const keywordDensity = {};
        this.siteConfig.keywords.forEach(keyword => {
            const count = wordCount[keyword.toLowerCase()] || 0;
            keywordDensity[keyword] = {
                count,
                density: ((count / totalWords) * 100).toFixed(2) + '%'
            };
        });

        return keywordDensity;
    }

    // 生成SEO报告
    generateSEOReport(htmlContent) {
        const report = {
            title: this.extractTitle(htmlContent),
            metaDescription: this.extractMetaDescription(htmlContent),
            headings: this.extractHeadings(htmlContent),
            images: this.analyzeImages(htmlContent),
            links: this.analyzeLinks(htmlContent),
            keywordDensity: this.analyzeKeywordDensity(htmlContent)
        };

        return report;
    }

    extractTitle(html) {
        const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        return match ? match[1] : '未找到标题';
    }

    extractMetaDescription(html) {
        const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        return match ? match[1] : '未找到描述';
    }

    extractHeadings(html) {
        const headings = {};
        for (let i = 1; i <= 6; i++) {
            const regex = new RegExp(`<h${i}[^>]*>([^<]+)</h${i}>`, 'gi');
            const matches = html.match(regex) || [];
            headings[`h${i}`] = matches.map(match => match.replace(/<[^>]+>/g, ''));
        }
        return headings;
    }

    analyzeImages(html) {
        const imgRegex = /<img[^>]*>/gi;
        const images = html.match(imgRegex) || [];
        
        return {
            total: images.length,
            withAlt: images.filter(img => /alt=["'][^"']*["']/i.test(img)).length,
            withoutAlt: images.filter(img => !/alt=["'][^"']*["']/i.test(img)).length
        };
    }

    analyzeLinks(html) {
        const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>/gi;
        const links = [];
        let match;
        
        while ((match = linkRegex.exec(html)) !== null) {
            links.push(match[1]);
        }
        
        return {
            total: links.length,
            internal: links.filter(link => !link.startsWith('http') || link.includes(this.siteConfig.domain)).length,
            external: links.filter(link => link.startsWith('http') && !link.includes(this.siteConfig.domain)).length
        };
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOOptimizer;
} else if (typeof window !== 'undefined') {
    window.SEOOptimizer = SEOOptimizer;
}

// 使用示例
if (require.main === module) {
    const seo = new SEOOptimizer();
    
    console.log('🔍 SEO优化工具');
    console.log('=' .repeat(40));
    
    // 生成文件
    const fs = require('fs');
    
    // 生成站点地图
    fs.writeFileSync('./sitemap.xml', seo.generateSitemap());
    console.log('✅ 已生成 sitemap.xml');
    
    // 生成robots.txt
    fs.writeFileSync('./robots.txt', seo.generateRobotsTxt());
    console.log('✅ 已生成 robots.txt');
    
    // 生成Meta标签示例
    const metaTags = seo.generateMetaTags();
    fs.writeFileSync('./meta-tags-example.html', metaTags);
    console.log('✅ 已生成 meta-tags-example.html');
    
    // 生成结构化数据
    const structuredData = seo.generateStructuredDataScript();
    fs.writeFileSync('./structured-data.html', structuredData);
    console.log('✅ 已生成 structured-data.html');
    
    console.log('\n🎯 SEO优化文件生成完成！');
}