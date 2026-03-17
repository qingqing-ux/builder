#!/usr/bin/env node

/**
 * 图标字体生成工具
 * 从 SVG 文件批量生成图标字体（ttf, woff, woff2）
 */

const fs = require('fs');
const path = require('path');
const SVGIcons2SVGFontStream = require('svgicons2svgfont');
const svg2ttf = require('svg2ttf');
const ttf2woff = require('ttf2woff');
const ttf2woff2 = require('ttf2woff2');

// 配置
const config = {
  // SVG 图标源目录
  svgDir: path.join(__dirname, '../ui/pages/spx/demos/images'),
  // 输出目录
  outputDir: path.join(__dirname, '../ui/components/spx'),
  // 字体名称
  fontName: 'iconfont',
  // 字体高度
  fontHeight: 1000,
  // 起始 Unicode 编码
  startUnicode: 0xe001,
  // 映射配置文件（可选，如果提供则使用配置的映射）
  mappingFile: null, // path.join(__dirname, '../ui/components/spx/icon-mapping.json')
};

/**
 * 读取映射配置
 */
function loadMapping() {
  if (config.mappingFile && fs.existsSync(config.mappingFile)) {
    try {
      const content = fs.readFileSync(config.mappingFile, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.warn('读取映射配置失败，将使用自动生成的映射:', err.message);
    }
  }
  return null;
}

/**
 * 获取 SVG 文件列表
 */
function getSvgFiles() {
  if (!fs.existsSync(config.svgDir)) {
    throw new Error(`SVG 目录不存在: ${config.svgDir}`);
  }

  const files = fs.readdirSync(config.svgDir)
    .filter(file => file.endsWith('.svg'))
    .map(file => ({
      name: path.basename(file, '.svg'),
      path: path.join(config.svgDir, file)
    }));

  if (files.length === 0) {
    throw new Error(`在 ${config.svgDir} 目录下未找到 SVG 文件`);
  }

  return files;
}

/**
 * 生成字符映射表
 */
function generateMapping(svgFiles, customMapping) {
  const mapping = {};

  svgFiles.forEach((file, index) => {
    if (customMapping && customMapping[file.name]) {
      // 使用自定义映射
      mapping[file.name] = customMapping[file.name];
    } else {
      // 自动生成映射
      const unicode = config.startUnicode + index;
      mapping[file.name] = String.fromCharCode(unicode);
    }
  });

  return mapping;
}

/**
 * 生成 SVG 字体
 */
async function generateSvgFont(svgFiles, mapping) {
  return new Promise((resolve, reject) => {
    const fontStream = new SVGIcons2SVGFontStream({
      fontName: config.fontName,
      fontHeight: config.fontHeight,
      normalize: true,
      log: () => {}
    });

    let svgFont = '';
    fontStream
      .on('data', chunk => {
        svgFont += chunk;
      })
      .on('end', () => {
        resolve(svgFont);
      })
      .on('error', reject);

    // 添加每个图标
    svgFiles.forEach(file => {
      const glyph = fs.createReadStream(file.path);
      const unicode = mapping[file.name];
      glyph.metadata = {
        unicode: [unicode],
        name: file.name
      };
      fontStream.write(glyph);
    });

    fontStream.end();
  });
}

/**
 * 生成所有格式的字体文件
 */
async function generateFonts() {
  console.log('🎨 开始生成图标字体...\n');

  // 1. 读取 SVG 文件
  console.log('📁 读取 SVG 文件...');
  const svgFiles = getSvgFiles();
  console.log(`   找到 ${svgFiles.length} 个 SVG 文件\n`);

  // 2. 生成映射表
  console.log('🗺️  生成字符映射表...');
  const customMapping = loadMapping();
  const mapping = generateMapping(svgFiles, customMapping);
  console.log('   映射表生成完成\n');

  // 3. 生成 SVG 字体
  console.log('⚙️  生成 SVG 字体...');
  const svgFont = await generateSvgFont(svgFiles, mapping);

  // 确保输出目录存在
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  // 保存 SVG 字体
  const svgPath = path.join(config.outputDir, `${config.fontName}.svg`);
  fs.writeFileSync(svgPath, svgFont);
  console.log(`   ✓ ${config.fontName}.svg\n`);

  // 4. 生成 TTF
  console.log('⚙️  生成 TTF 字体...');
  const ttf = svg2ttf(svgFont, {});
  const ttfPath = path.join(config.outputDir, `${config.fontName}.ttf`);
  fs.writeFileSync(ttfPath, Buffer.from(ttf.buffer));
  console.log(`   ✓ ${config.fontName}.ttf\n`);

  // 5. 生成 WOFF
  console.log('⚙️  生成 WOFF 字体...');
  const woff = ttf2woff(Buffer.from(ttf.buffer), {});
  const woffPath = path.join(config.outputDir, `${config.fontName}.woff`);
  fs.writeFileSync(woffPath, Buffer.from(woff.buffer));
  console.log(`   ✓ ${config.fontName}.woff\n`);

  // 6. 生成 WOFF2
  console.log('⚙️  生成 WOFF2 字体...');
  const woff2 = ttf2woff2(Buffer.from(ttf.buffer));
  const woff2Path = path.join(config.outputDir, `${config.fontName}.woff2`);
  fs.writeFileSync(woff2Path, woff2);
  console.log(`   ✓ ${config.fontName}.woff2\n`);

  // 7. 生成映射表 JSON
  const mappingPath = path.join(config.outputDir, `${config.fontName}-mapping.json`);
  const mappingWithUnicode = {};
  Object.entries(mapping).forEach(([name, char]) => {
    mappingWithUnicode[name] = {
      char,
      unicode: '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')
    };
  });
  fs.writeFileSync(mappingPath, JSON.stringify(mappingWithUnicode, null, 2));
  console.log(`   ✓ ${config.fontName}-mapping.json\n`);

  // 8. 生成 CSS 文件
  console.log('📝 生成 CSS 文件...');
  const cssContent = generateCss(mapping);
  const cssPath = path.join(config.outputDir, `${config.fontName}.css`);
  fs.writeFileSync(cssPath, cssContent);
  console.log(`   ✓ ${config.fontName}.css\n`);

  console.log('✨ 字体生成完成！');
  console.log(`📦 输出目录: ${config.outputDir}`);
}

/**
 * 生成 CSS 文件
 */
function generateCss(mapping) {
  const fontName = config.fontName;

  let css = `@font-face {
  font-family: '${fontName}';
  src: url('./${fontName}.woff2') format('woff2'),
       url('./${fontName}.woff') format('woff'),
       url('./${fontName}.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^="icon-"], [class*=" icon-"] {
  font-family: '${fontName}' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

`;

  // 为每个图标生成 CSS 类
  Object.entries(mapping).forEach(([name, char]) => {
    const unicode = '\\' + char.charCodeAt(0).toString(16);
    css += `.icon-${name}:before {
  content: "${unicode}";
}

`;
  });

  return css;
}

// 运行
if (require.main === module) {
  generateFonts().catch(err => {
    console.error('❌ 生成失败:', err);
    process.exit(1);
  });
}

module.exports = { generateFonts, config };
