const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// WebP图片转换工具
class WebPConverter {
    constructor() {
        this.inputDir = './images';
        this.outputDir = './images/webp';
        this.supportedFormats = ['.jpg', '.jpeg', '.png', '.gif'];
        this.conversionLog = [];
    }

    async init() {
        try {
            // 创建输出目录
            if (!fs.existsSync(this.outputDir)) {
                fs.mkdirSync(this.outputDir, { recursive: true });
            }

            console.log('🚀 开始WebP转换优化...');
            await this.convertImages();
            this.generateReport();
            this.generateHTMLSuggestions();
        } catch (error) {
            console.error('转换过程中出现错误:', error);
        }
    }

    async convertImages() {
        if (!fs.existsSync(this.inputDir)) {
            console.log('⚠️  images目录不存在，跳过图片转换');
            return;
        }

        const files = fs.readdirSync(this.inputDir);
        const imageFiles = files.filter(file => 
            this.supportedFormats.includes(path.extname(file).toLowerCase())
        );

        console.log(`📸 找到 ${imageFiles.length} 张图片需要转换`);

        for (const file of imageFiles) {
            await this.convertSingleImage(file);
        }
    }

    async convertSingleImage(filename) {
        const inputPath = path.join(this.inputDir, filename);
        const outputFilename = path.parse(filename).name + '.webp';
        const outputPath = path.join(this.outputDir, outputFilename);

        try {
            const inputStats = fs.statSync(inputPath);
            const inputSize = inputStats.size;

            // 转换为WebP
            await sharp(inputPath)
                .webp({ 
                    quality: 85,
                    effort: 6
                })
                .toFile(outputPath);

            const outputStats = fs.statSync(outputPath);
            const outputSize = outputStats.size;
            const compressionRatio = ((inputSize - outputSize) / inputSize * 100).toFixed(1);

            this.conversionLog.push({
                original: filename,
                webp: outputFilename,
                originalSize: this.formatFileSize(inputSize),
                webpSize: this.formatFileSize(outputSize),
                savings: compressionRatio + '%'
            });

            console.log(`✅ ${filename} -> ${outputFilename} (节省 ${compressionRatio}%)`);
        } catch (error) {
            console.error(`❌ 转换失败: ${filename}`, error.message);
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    generateReport() {
        console.log('\n📊 转换报告:');
        console.log('=' .repeat(60));
        
        this.conversionLog.forEach(log => {
            console.log(`${log.original}:`);
            console.log(`  原始大小: ${log.originalSize}`);
            console.log(`  WebP大小: ${log.webpSize}`);
            console.log(`  节省空间: ${log.savings}`);
            console.log('');
        });

        const totalSavings = this.conversionLog.reduce((acc, log) => {
            return acc + parseFloat(log.savings.replace('%', ''));
        }, 0);
        const avgSavings = (totalSavings / this.conversionLog.length).toFixed(1);

        console.log(`📈 平均压缩率: ${avgSavings}%`);
        console.log(`🎯 总共转换: ${this.conversionLog.length} 张图片`);
    }

    generateHTMLSuggestions() {
        console.log('\n🔧 HTML优化建议:');
        console.log('=' .repeat(60));
        
        this.conversionLog.forEach(log => {
            const originalName = path.parse(log.original).name;
            const ext = path.parse(log.original).ext;
            
            console.log(`<!-- 替换 ${log.original} -->`);
            console.log(`<picture>`);
            console.log(`  <source srcset="images/webp/${log.webp}" type="image/webp">`);
            console.log(`  <img src="images/${log.original}" alt="${originalName}" loading="lazy">`);
            console.log(`</picture>\n`);
        });

        // 生成CSS背景图片建议
        console.log('\n🎨 CSS背景图片优化建议:');
        console.log('=' .repeat(60));
        
        this.conversionLog.forEach(log => {
            const className = path.parse(log.original).name.replace(/[^a-zA-Z0-9]/g, '-');
            console.log(`/* 替换 ${log.original} 背景图 */`);
            console.log(`.${className} {`);
            console.log(`  background-image: url('images/webp/${log.webp}');`);
            console.log(`}`);
            console.log(`/* 降级支持 */`);
            console.log(`.no-webp .${className} {`);
            console.log(`  background-image: url('images/${log.original}');`);
            console.log(`}\n`);
        });
    }
}

// WebP支持检测脚本
function generateWebPDetectionScript() {
    return `
// WebP支持检测
(function() {
    function supportsWebP(callback) {
        const webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    supportsWebP(function(supported) {
        if (supported) {
            document.documentElement.classList.add('webp');
        } else {
            document.documentElement.classList.add('no-webp');
        }
    });
})();
`;
}

// 主执行函数
async function main() {
    console.log('🎯 WebP图片优化工具');
    console.log('=' .repeat(40));
    
    // 检查sharp依赖
    try {
        require.resolve('sharp');
    } catch (error) {
        console.log('❌ 缺少sharp依赖，请先安装:');
        console.log('npm install sharp');
        return;
    }

    const converter = new WebPConverter();
    await converter.init();

    // 生成WebP检测脚本
    const detectionScript = generateWebPDetectionScript();
    fs.writeFileSync('./webp-detection.js', detectionScript);
    console.log('\n📝 已生成WebP检测脚本: webp-detection.js');
    
    console.log('\n✨ 优化完成！请根据上述建议更新HTML和CSS文件。');
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { WebPConverter, generateWebPDetectionScript };