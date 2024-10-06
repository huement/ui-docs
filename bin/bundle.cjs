#!/usr/bin/env node
'use strict'

// Using Browserify to create a javascript bundle from the Bootstrap 5 libraries
// as well as any other third party scripts (such as popper.js)
// This script only runs browserify. All the code to include and everything
// that goes into the bundle is found in the ./js/index.umd.js file.

const { textUI } = require('./tui.cjs')
const fs = require('fs')
const browserify = require('browserify')
const path = require('path')
const jetpack = require('fs-jetpack')

// CONFIG VARS
const packageData = textUI.getParsedPackage()

const inputFileName = './js/index.js'
const outputFileName = './dist/js/bundle.js'

// START BUNDLING..
textUI.taskTxt(`${packageData.name} javascript browserify starting...`)

const buildBundle = async () => {
    browserify(inputFileName)
        .transform('babelify', {
            presets: ['@babel/preset-env'],
        })
        .bundle()
        .pipe(fs.createWriteStream(outputFileName))
}

const finalize = async () => {
    // DISPLAY RESULTING FILE STATS
    if (fs.existsSync(outputFileName) !== true) {
        awaitFinalize()
    } else {
        var stats = fs.statSync(outputFileName)
        var fileSizeInBytes = stats.size
        let newSize = textUI.formatBytes(fileSizeInBytes)

        if (fileSizeInBytes < 100000) {
            awaitFinalize()
            return
        }

        textUI.infoTxt(`Created ${outputFileName}`)
        textUI.infoTxt(`File size: ${newSize}`)
    }
}

const globalCounter = 0
const awaitFinalize = () => {
    if (globalCounter >= 5) {
        textUI.errorTxt('Max Attempts Reached! Fail Quitting.')
        return false
    }
    globalCounter++
    setTimeout(() => {
        finalize()
    }, '2000')
}

;(async () => {
    if (jetpack.exists('dist/js/') !== true) {
        jetpack.dir('dist/js')
    }

    await buildBundle()

    setTimeout(() => {
        finalize()
    }, '3000')
})()
