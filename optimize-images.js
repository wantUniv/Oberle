// 图片优化脚本 - 将现有图片转换为WebP格式
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 图片文件夹路径
const imagesDir = path.join(__dirname, 'images');
const webpDir = path.join(__dirname, 'images', 'webp');

// 创建WebP文件夹
if (!fs.existsSync(webpDir)) {
    fs.mkdirSync(webpDir, { recursive: true });
}

// 支持的图片格式
const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif'];

// 转换图片为WebP格式
async function convertToWebP() {
    try {
        const files = fs.readdirSync(imagesDir);
        
        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            
            if (supportedFormats.includes(ext)) {
                const inputPath = path.join(imagesDir, file);
                const outputPath = path.join(webpDir, path.basename(file, ext) + '.webp');
                
                console.log(`转换中: ${file} -> ${path.basename(outputPath)}`);
                
                await sharp(inputPath)
                    .webp({ 
                        quality: 85,  // 高质量压缩
                        effort: 6     // 最大压缩努力
                    })
                    .toFile(outputPath);
                
                // 获取文件大小对比
                const originalSize = fs.statSync(inputPath).size;
                const webpSize = fs.statSync(outputPath).size;
                const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
                
                console.log(`✓ ${file}: ${(originalSize/1024).toFixed(1)}KB -> ${(webpSize/1024).toFixed(1)}KB (减少${reduction}%)`);
            }
        }
        
        console.log('\n✅ 所有图片转换完成！');
        console.log('💡 请更新HTML文件以使用WebP格式图片');
        
    } catch (error) {
        console.error('转换失败:', error);
    }
}

// 生成现代化图片标签（支持WebP回退）
function generatePictureTag(imageName, alt, className = '', loading = 'lazy') {
    const baseName = path.basename(imageName, path.extname(imageName));
    
    return `<picture>
    <source srcset="images/webp/${baseName}.webp" type="image/webp">
    <img src="images/${imageName}" alt="${alt}" class="${className}" loading="${loading}">
</picture>`;
}

// 批量生成HTML替换建议
function generateHTMLReplacements() {
    const replacements = [
        // 轮播图
        { old: 'images/lunbotu (1).jpg', new: 'images/webp/lunbotu (1).webp' },
        { old: 'images/lunbotu (2).jpg', new: 'images/webp/lunbotu (2).webp' },
        { old: 'images/lunbotu (3).jpg', new: 'images/webp/lunbotu (3).webp' },
        { old: 'images/lunbotu (4).jpg', new: 'images/webp/lunbotu (4).webp' },
        { old: 'images/lunbotu (5).png', new: 'images/webp/lunbotu (5).webp' },
        
        // 产品图片
        { old: 'images/lvcai.jpg', new: 'images/webp/lvcai.webp' },
        { old: 'images/boli.png', new: 'images/webp/boli.webp' },
        { old: 'images/wujin.png', new: 'images/webp/wujin.webp' },
        { old: 'images/shawang.jpg', new: 'images/webp/shawang.webp' },
        { old: 'images/geretiao.jpg', new: 'images/webp/geretiao.webp' },
        
        // 公司图片
        { old: 'images/gongsi.jpg', new: 'images/webp/gongsi.webp' },
        { old: 'images/anzhaung.jpg', new: 'images/webp/anzhaung.webp' },
        { old: 'images/shouhou.jpg', new: 'images/webp/shouhou.webp' },
        
        // 实拍图片
        { old: 'images/shipai (1).jpg', new: 'images/webp/shipai (1).webp' },
        { old: 'images/shipai (2).jpg', new: 'images/webp/shipai (2).webp' },
        { old: 'images/shipai (3).jpg', new: 'images/webp/shipai (3).webp' },
        { old: 'images/shipai (4).jpg', new: 'images/webp/shipai (4).webp' },
        { old: 'images/shipai (5).jpg', new: 'images/webp/shipai (5).webp' },
        { old: 'images/shipai (6).jpg', new: 'images/webp/shipai (6).webp' }
    ];
    
    console.log('\n📝 HTML替换建议:');
    replacements.forEach(item => {
        console.log(`${item.old} -> ${item.new}`);
    });
}

// 执行转换
if (require.main === module) {
    convertToWebP().then(() => {
        generateHTMLReplacements();
    });
}

module.exports = { convertToWebP, generatePictureTag };