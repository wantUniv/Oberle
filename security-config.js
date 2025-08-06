// 网站安全配置和工具
class SecurityConfig {
    constructor() {
        this.domain = 'oberle-china.com';
        this.cdnDomains = [
            'cdnjs.cloudflare.com',
            'fonts.googleapis.com',
            'fonts.gstatic.com'
        ];
    }

    // 生成内容安全策略 (CSP)
    generateCSP() {
        const csp = {
            'default-src': ["'self'"],
            'script-src': [
                "'self'",
                "'unsafe-inline'", // 临时允许，生产环境应移除
                "'unsafe-eval'",   // 临时允许，生产环境应移除
                'cdnjs.cloudflare.com',
                'www.googletagmanager.com',
                'www.google-analytics.com'
            ],
            'style-src': [
                "'self'",
                "'unsafe-inline'",
                'cdnjs.cloudflare.com',
                'fonts.googleapis.com'
            ],
            'font-src': [
                "'self'",
                'cdnjs.cloudflare.com',
                'fonts.gstatic.com',
                'data:'
            ],
            'img-src': [
                "'self'",
                'data:',
                'blob:',
                '*.oberle-china.com',
                'www.google-analytics.com'
            ],
            'media-src': ["'self'", 'data:', 'blob:'],
            'object-src': ["'none'"],
            'frame-src': ["'none'"],
            'worker-src': ["'self'", 'blob:'],
            'child-src': ["'self'"],
            'connect-src': [
                "'self'",
                'www.google-analytics.com',
                'stats.g.doubleclick.net'
            ],
            'base-uri': ["'self'"],
            'form-action': ["'self'"],
            'frame-ancestors': ["'none'"],
            'upgrade-insecure-requests': []
        };

        return Object.entries(csp)
            .map(([directive, sources]) => 
                sources.length > 0 
                    ? `${directive} ${sources.join(' ')}` 
                    : directive
            )
            .join('; ');
    }

    // 生成安全头部配置
    generateSecurityHeaders() {
        return {
            // 内容安全策略
            'Content-Security-Policy': this.generateCSP(),
            
            // 严格传输安全
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            
            // 防止MIME类型嗅探
            'X-Content-Type-Options': 'nosniff',
            
            // 防止点击劫持
            'X-Frame-Options': 'DENY',
            
            // XSS保护
            'X-XSS-Protection': '1; mode=block',
            
            // 引用策略
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            
            // 权限策略
            'Permissions-Policy': [
                'camera=()',
                'microphone=()',
                'geolocation=()',
                'payment=()',
                'usb=()',
                'magnetometer=()',
                'accelerometer=()',
                'gyroscope=()'
            ].join(', '),
            
            // 缓存控制
            'Cache-Control': 'public, max-age=3600, must-revalidate',
            
            // 服务器信息隐藏
            'Server': 'nginx',
            
            // 防止信息泄露
            'X-Powered-By': ''
        };
    }

    // 生成Nginx安全配置
    generateNginxConfig() {
        const headers = this.generateSecurityHeaders();
        
        return `
# Nginx安全配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${this.domain} www.${this.domain};
    
    # SSL配置
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头部
${Object.entries(headers).map(([header, value]) => 
    `    add_header ${header} "${value}" always;`
).join('\n')}
    
    # 隐藏Nginx版本
    server_tokens off;
    
    # 防止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 防止访问备份文件
    location ~* \.(bak|backup|old|orig|original|tmp)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # 压缩
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types
            text/plain
            text/css
            text/xml
            text/javascript
            application/javascript
            application/xml+rss
            application/json
            image/svg+xml;
    }
    
    # HTML文件缓存
    location ~* \.(html|htm)$ {
        expires 10m;
        add_header Cache-Control "public, must-revalidate";
    }
    
    # 限制请求大小
    client_max_body_size 10M;
    
    # 限制请求速率
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    # 主配置
    root /var/www/${this.domain};
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# HTTP到HTTPS重定向
server {
    listen 80;
    listen [::]:80;
    server_name ${this.domain} www.${this.domain};
    return 301 https://$server_name$request_uri;
}

# www重定向到非www
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.${this.domain};
    
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    return 301 https://${this.domain}$request_uri;
}`;
    }

    // 生成Apache安全配置
    generateApacheConfig() {
        const headers = this.generateSecurityHeaders();
        
        return `
# Apache安全配置
<VirtualHost *:443>
    ServerName ${this.domain}
    ServerAlias www.${this.domain}
    DocumentRoot /var/www/${this.domain}
    
    # SSL配置
    SSLEngine on
    SSLCertificateFile /path/to/ssl/certificate.crt
    SSLCertificateKeyFile /path/to/ssl/private.key
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder off
    SSLSessionTickets off
    
    # 安全头部
${Object.entries(headers).map(([header, value]) => 
    `    Header always set ${header} "${value}"`
).join('\n')}
    
    # 隐藏服务器信息
    ServerTokens Prod
    ServerSignature Off
    
    # 防止访问隐藏文件
    <FilesMatch "^\\."> 
        Require all denied
    </FilesMatch>
    
    # 静态资源缓存
    <LocationMatch "\\.(css|js|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|ico)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header append Cache-Control "public, immutable"
    </LocationMatch>
    
    # HTML文件缓存
    <LocationMatch "\\.(html|htm)$">
        ExpiresActive On
        ExpiresDefault "access plus 10 minutes"
        Header append Cache-Control "public, must-revalidate"
    </LocationMatch>
    
    # 压缩
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \\
            \\.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \\
            \\.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
</VirtualHost>

# HTTP到HTTPS重定向
<VirtualHost *:80>
    ServerName ${this.domain}
    ServerAlias www.${this.domain}
    Redirect permanent / https://${this.domain}/
</VirtualHost>`;
    }

    // 生成安全检查脚本
    generateSecurityCheckScript() {
        return `
// 安全检查和防护脚本
(function() {
    'use strict';
    
    // 防止控制台滥用
    const devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%c⚠️ 安全警告', 'color: red; font-size: 20px; font-weight: bold;');
                console.log('%c请勿在此处输入任何代码，这可能导致您的账户被盗用！', 'color: red; font-size: 14px;');
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // 防止右键菜单（可选）
    // document.addEventListener('contextmenu', function(e) {
    //     e.preventDefault();
    // });
    
    // 防止选择文本（可选）
    // document.addEventListener('selectstart', function(e) {
    //     e.preventDefault();
    // });
    
    // 防止拖拽（可选）
    // document.addEventListener('dragstart', function(e) {
    //     e.preventDefault();
    // });
    
    // 检测异常行为
    let clickCount = 0;
    let lastClickTime = 0;
    
    document.addEventListener('click', function() {
        const now = Date.now();
        if (now - lastClickTime < 100) {
            clickCount++;
            if (clickCount > 10) {
                console.warn('检测到异常点击行为');
                clickCount = 0;
            }
        } else {
            clickCount = 0;
        }
        lastClickTime = now;
    });
    
    // HTTPS检查
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        console.warn('⚠️ 当前连接不安全，建议使用HTTPS访问');
    }
    
    // 检查混合内容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // 检查HTTP资源
                    const httpResources = node.querySelectorAll ? 
                        node.querySelectorAll('[src^="http:"], [href^="http:"]') : [];
                    
                    if (httpResources.length > 0) {
                        console.warn('⚠️ 检测到不安全的HTTP资源:', httpResources);
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
`;
    }

    // 生成安全报告
    generateSecurityReport() {
        return {
            timestamp: new Date().toISOString(),
            domain: this.domain,
            securityHeaders: this.generateSecurityHeaders(),
            csp: this.generateCSP(),
            recommendations: [
                '启用HTTPS并配置HSTS',
                '定期更新SSL证书',
                '配置内容安全策略(CSP)',
                '隐藏服务器版本信息',
                '限制文件上传大小',
                '配置防火墙规则',
                '定期安全扫描',
                '监控异常访问',
                '备份重要数据',
                '使用CDN加速和防护'
            ],
            checklist: {
                https: '✅ HTTPS已启用',
                hsts: '✅ HSTS已配置',
                csp: '✅ CSP已配置',
                xss: '✅ XSS保护已启用',
                clickjacking: '✅ 点击劫持保护已启用',
                mimeSniffing: '✅ MIME嗅探保护已启用',
                serverTokens: '✅ 服务器信息已隐藏',
                rateLimiting: '⚠️ 需要配置速率限制',
                firewall: '⚠️ 需要配置防火墙',
                monitoring: '⚠️ 需要配置监控'
            }
        };
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityConfig;
} else if (typeof window !== 'undefined') {
    window.SecurityConfig = SecurityConfig;
}

// 使用示例
if (require.main === module) {
    const security = new SecurityConfig();
    const fs = require('fs');
    
    console.log('🔒 网站安全配置生成器');
    console.log('=' .repeat(40));
    
    // 生成Nginx配置
    fs.writeFileSync('./nginx-security.conf', security.generateNginxConfig());
    console.log('✅ 已生成 nginx-security.conf');
    
    // 生成Apache配置
    fs.writeFileSync('./apache-security.conf', security.generateApacheConfig());
    console.log('✅ 已生成 apache-security.conf');
    
    // 生成安全检查脚本
    fs.writeFileSync('./security-check.js', security.generateSecurityCheckScript());
    console.log('✅ 已生成 security-check.js');
    
    // 生成安全报告
    const report = security.generateSecurityReport();
    fs.writeFileSync('./security-report.json', JSON.stringify(report, null, 2));
    console.log('✅ 已生成 security-report.json');
    
    console.log('\n🎯 安全配置文件生成完成！');
    console.log('\n📋 安全检查清单:');
    Object.entries(report.checklist).forEach(([key, status]) => {
        console.log(`  ${status}`);
    });
}