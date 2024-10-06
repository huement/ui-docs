/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
    ui: {
        port: 8101,
    },
    files: [ 'dist/*.html', 'dist/docs/*.html', 'demo/css/*.css', 'dist/css/*.css' ],
    watchEvents: [ 'change' ],
    watch: true,
    ignore: [],
    single: false,
    watchOptions: {
        ignoreInitial: true,
    },
    server: {
        baseDir: './dist/',
        directory: true,
        index: './dist/index.html',
    },
    proxy: false,
    port: 1331,
    middleware: false,
    serveStatic: [],
    ghostMode: {
        clicks: true,
        scroll: true,
        location: true,
        forms: {
            submit: true,
            inputs: true,
            toggles: true,
        },
    },
    logLevel: 'info',
    logPrefix: 'Browsersync',
    logConnections: false,
    logFileChanges: true,
    logSnippet: true,
    rewriteRules: [],
    open: 'local',
    browser: 'default',
    cors: false,
    xip: false,
    hostnameSuffix: false,
    reloadOnRestart: false,
    notify: true,
    scrollProportionally: true,
    scrollThrottle: 0,
    scrollRestoreTechnique: 'window.name',
    scrollElements: [],
    scrollElementMapping: [],
    reloadDelay: 5500,
    reloadDebounce: 5500,
    reloadThrottle: 5500,
    plugins: [],
    injectChanges: true,
    startPath: null,
    minify: false,
    host: null,
    localOnly: false,
    codeSync: true,
    timestamps: true,
    clientEvents: [
        'scroll',
        'scroll:element',
        'input:text',
        'input:toggles',
        'form:submit',
        'form:reset',
        'click',
    ],
    socket: {
        socketIoOptions: {
            log: false,
        },
        socketIoClientConfig: {
            reconnectionAttempts: 50,
        },
        path: '/browser-sync/socket.io',
        clientPath: '/browser-sync',
        namespace: '/browser-sync',
        clients: {
            heartbeatTimeout: 5000,
        },
    },
    tagNames: {
        less: 'link',
        scss: 'link',
        css: 'link',
        jpg: 'img',
        jpeg: 'img',
        png: 'img',
        svg: 'img',
        gif: 'img',
        js: 'script',
    },
    injectNotification: false,
}
