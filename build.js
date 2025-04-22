const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const sass = require('sass');
const browserSync = require('browser-sync').create();

// Папки и файлы
const stylesDir = path.resolve(__dirname, 'styles');
const outputCss = path.resolve(__dirname, 'dist', 'style.css');
const htmlFiles = path.resolve(__dirname, '*.html');
const allFiles = [stylesDir, htmlFiles];  // Все файлы, за которыми будем следить

// Функция для компиляции SCSS в CSS
function compileSCSS() {
    try {
        const result = sass.compile(path.join(stylesDir, 'index.scss'));
        fs.mkdirSync(path.dirname(outputCss), { recursive: true });
        fs.writeFileSync(outputCss, result.css);
        console.log(`✅ SCSS успешно скомпилирован: ${outputCss}`);
    } catch (error) {
        console.error(`❌ Ошибка компиляции SCSS: ${error.message}`);
    }
}

// Функция для запуска browser-sync
function startBrowserSync() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 8080,
        open: true,  // Открыть браузер автоматически
        watch: true  // Включаем отслеживание изменений
    });
}

// Начальная компиляция SCSS
compileSCSS();

// Запуск browser-sync
startBrowserSync();

// Настройка наблюдателя для отслеживания изменений
chokidar.watch(allFiles, { ignoreInitial: true }).on('all', (event, filePath) => {
    if (filePath.endsWith('.scss')) {
        console.log(`Изменение SCSS файла: ${filePath}`);
        compileSCSS(); // Перекомпиляция SCSS
        browserSync.reload('style.css');  // Перезагружаем только стили
    } else if (filePath.endsWith('.html')) {
        console.log(`Изменение HTML файла: ${filePath}`);
        browserSync.reload();  // Перезагружаем страницу для изменений в HTML
    }
});
