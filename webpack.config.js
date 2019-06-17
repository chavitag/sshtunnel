var Encore = require('@symfony/webpack-encore');

Encore
    // the project directory where compiled assets will be stored
    .setOutputPath('public/assets/')
    // the public path used by the web server to access the previous directory
    .setPublicPath('/assets')
    .cleanupOutputBeforeBuild()
    .enableSingleRuntimeChunk()
    .enableSourceMaps(!Encore.isProduction())
    // uncomment to create hashed filenames (e.g. app.abc123.css)
    // .enableVersioning(Encore.isProduction())
    .createSharedEntry('vendor','./vendor_shared_entries.js')
    .addStyleEntry('css/bootstrap-select','bootstrap-select/sass/bootstrap-select.scss')
    .addStyleEntry('css/bootstrap-table','bootstrap-table/dist/bootstrap-table.min.css')
    .addStyleEntry('css/bootstrap-table-fine','./assets/css/bootstrap-table-fine.css')
    .addStyleEntry('css/bootstrap-table-filter-row','./assets/bootstrap-table/filter-row/bootstrap-table-filter-row.css')
    .addEntry('js/bootstrap-select','bootstrap-select')
    .addEntry('js/bootstrap-table','bootstrap-table')
    .addEntry('js/bootstrap-table-locale-es','bootstrap-table/dist/locale/bootstrap-table-es-ES.js')
    .addEntry('js/bootstrap-table-resizable','bootstrap-table/dist/extensions/resizable/bootstrap-table-resizable.min.js')
    .addEntry('js/bootstrap-table-filter-row','./assets/bootstrap-table/filter-row/bootstrap-table-filter-row.js')
    .addStyleEntry('css/main','./assets/css/main.css')
    .addStyleEntry('css/onoff','./assets/css/onoff.css')
    .addEntry('js/utils','./assets/js/utils.js')
    .addEntry('js/twigjs','./assets/js/twigjs.js')
	 //.addEntry('js/bootstrap-table','bootstrap-table')
    //.addStyleEntry('css/bootstrap-table','bootstrap-table/dist/bootstrap-table.css')
    //.addEntry('js/twigjs/twig.min','./assets/js/twigjs/twig.min.js')

    // uncomment if you use Sass/SCSS files
    .enableSassLoader()
    // uncomment for legacy applications that require $/jQuery as a global variable
    .autoProvidejQuery()
    //.addLoader({ test: /\.twig$/, loader: 'twig-loader' })
;

module.exports = Encore.getWebpackConfig();
