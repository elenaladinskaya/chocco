const { src, dest, task, series, watch, parallel } = require('gulp');
const rm = require('gulp-rm'); //удаление файлов и папок
const sass = require('gulp-sass'); //копиляция sass
const sassGlob = require('gulp-sass-glob'); //импорт стилей в один файл
const concat = require('gulp-concat'); //склейка css файлов
const browserSync = require('browser-sync').create(); //локальный сервер 
const reload = browserSync.reload; //перезгрузка сервера
const autoprefixer = require('gulp-autoprefixer'); //автоматическая подстановка префиксов (применять именно к css коду)
const px2rem = require('gulp-smile-px2rem'); //перевод px в rem
const gcmq = require('gulp-group-css-media-queries'); //группировка медиа-запросов
const cleanCSS = require('gulp-clean-css'); //минификация css
const sourcemaps = require('gulp-sourcemaps'); //карта css стилей
const uglify = require('gulp-uglify'); //минификация js
const svgo = require('gulp-svgo'); //создание svg спрайтов (оптимизация xml)
const svgSprite = require('gulp-svg-sprite'); //создание svg спрайтов (склейка)
const gulpif = require('gulp-if'); //плагин разделения на потоки: разработка и продакшн и запуска плагинов в соответствии с этой стадией
const env = process.env.NODE_ENV; //разделение потоков на разработку (npm run gulp) и продакшн (npm run build)

const { DIST_PATH, SRC_PATH, STYLES__LIBS, JS_LIBS } = require('./gulp.config'); //подключение конфигурации для gulp (делается самостоятельно и для себя)

sass.compiler = require('node-sass'); //компилятор sass на node.js

// Задача удаление всех файлов и папок из папки dist
task('clean', () => {
  return src(`${DIST_PATH}/**/*`, { read: false }).pipe(rm());
});

// Задача копирование в папку dist файлов html и перезапуск сервера внутри потока
task('copy:html', () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

// Задача копирование в папку dist файлов img и перезапуск сервера внутри потока
task('copy:img', () => {
  return src(`${SRC_PATH}/img/**`)
    .pipe(dest(`${DIST_PATH}/img`))
    .pipe(reload({ stream: true }));
});

// Задача копирование в папку dist файлов видео и перезапуск сервера внутри потока
task('copy:vid', () => {
  return src(`${SRC_PATH}/vid/**`)
    .pipe(dest(`${DIST_PATH}/vid`))
    .pipe(reload({ stream: true }));
});

// Задача компиляция sass в css
task('styles', () => {
  return src([//массив стилей для обработки
    ...STYLES__LIBS,
    `${SRC_PATH}/css/main.scss`
  ])
    .pipe(gulpif(env === 'dev', sourcemaps.init())) //инициализация карты css при условии dev/разработка
    .pipe(concat('main.min.scss')) //склейка файлов в один main.min.scss
    .pipe(sassGlob()) //подключаем все файлы scss и конвертируем в css 
    .pipe(sass().on('error', sass.logError)) //вывод ошибки при некорректном срабатывании
    // .pipe(px2rem()) //перевод px в rem
    .pipe(gulpif(env === 'dev',
      autoprefixer({
        cascade: false
      }))
    ) //простановка префиксов в полученных css файлах при условии dev/разработка
    // .pipe(gulpif(env === 'prod', gcmq())) //группировка медиа-запросов при условии "prod/продакшн"
    .pipe(gulpif(env === 'prod', cleanCSS())) //сжатие/минификация в одну строку при условии "prod/продакшн"
    .pipe(gulpif(env === 'dev', sourcemaps.write())) //записываем карту css при условии dev/разработка
    .pipe(dest(`${DIST_PATH}/css`)) //папка, в которую будет отправлен скомпилированный файл
    .pipe(reload({ stream: true })); //перезагрузка сервера
});

// Задача сборка JavaScript
task('scripts', () => {
  return src([
    ...JS_LIBS, //массив стилей для обработки
    `${SRC_PATH}/js/*.js`
  ]) //передаем массив файлов js
    .pipe(gulpif(env === 'dev', sourcemaps.init())) //инициализация карты js при условии 'dev'/разработка
    .pipe(concat('main.min.js', { newLine: ';' })) //склейка файлов в один main.min.js
    .pipe(gulpif(env === 'prod', uglify())) //минификация js при условии 'prod'/продакшн
    .pipe(gulpif(env === 'dev', sourcemaps.write())) //записываем карту js при условии 'dev'/разработка
    .pipe(dest(`${DIST_PATH}/js`)) //папка, в которую будет отправлен скомпилированный файл
    .pipe(reload({ stream: true })); //перезагрузка сервера
});

// --не подключен-- Задача склейка иконок в спрайт + удаление атрибутов fill, stroke и т.д. и все дата-атрибуты
// task('icons', () => {
//   return src(`${SRC_PATH}/img/icons/*.svg`)
//     .pipe(svgo({
//       plugins: [
//         {
//           removeAttrs: {
//             attrs: "(fill|stroke|style|width|height|data.*)" //удалить лишние атрибуты
//           }
//         }
//       ]
//     })
//     )
//     .pipe(svgSprite({//сборка в спрайт
//       mode: {//режим работы
//         symbol: {//режим собрать в тег symbol
//           sprite: '../sprite.svg' //название спрайта и путь к нему
//         }
//       } 
//     }))
//     .pipe(dest(`${DIST_PATH}/img/icons`));
// });

// Задача запуск сервера
task('server', () => {
  browserSync.init({
    server: {
      baseDir: `./${DIST_PATH}`
    },
    open: false
  });
});

// Слежение за изменениями в файлах и когда произойдет изменение, вызывать соответствующие задачи 
task('watch', () => {
  watch(`./${SRC_PATH}/css/**/*.scss`, series("styles"));
  watch(`./${SRC_PATH}/*.html`, series("copy:html"));
  watch(`./${SRC_PATH}/js/*.js`, series("scripts"));
  // watch(`./${SRC_PATH}/img/icons/*.svg`, series("icons"));
})

//Запуск сборки для разработки (npm run gulp)
task(
  'default',
  series(
    'clean',
    parallel(
      'copy:html',
      'copy:img',
      'copy:vid',
      'styles',
      'scripts'
    ),
    parallel('watch', 'server')
  ));

//Запуск сборки в продакшн (npm run build), когда разработка завершена для последующей заливки на боевой сервер | не запускаются сервер и вотчер
task(
  'build',
  series(
    'clean', 
    parallel(
      'copy:html',
      'copy:img',
      'copy:vid',
      'styles',
      'scripts'
    ))
);