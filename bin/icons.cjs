#!/usr/bin/env node
'use strict'

// 1. Run Fantasticon (uses root .rc file for config)
// 2. Move the generated files into their final resting place
// 3. Remove any lingering empty dir(s)

var log = require('log-util')
const exec = require('child_process').exec
const showBanner = require('node-banner')
const { textUI } = require('./tui.cjs')
const fs = require('fs')
const jetpack = require('fs-jetpack')
const path = require('path')

const inputDirectory = 'dist/hi'
const finalDirectory = 'dist/fonts/icons'

async function copyIconFile(filename, destname) {
    textUI.statusTxt('Copying ' + filename + ' To ' + destname)
    jetpack.copy(filename, destname, { overwrite: true })
}

async function finalize() {
    textUI.statusTxt('Moving files into Final Location ')

    const fPath = path.resolve(__dirname, '../' + finalDirectory)
    if (!fs.existsSync(finalDirectory)) {
        textUI.statusTxt(finalDirectory + ' Folder Added')
        fs.mkdirSync(finalDirectory, { recursive: true })
    }

    await copyIconFile(
        inputDirectory + '/icons.ttf',
        finalDirectory + '/icons.ttf'
    )
    await copyIconFile(
        inputDirectory + '/icons.woff',
        finalDirectory + '/icons.woff'
    )
    await copyIconFile(
        inputDirectory + '/icons.woff2',
        finalDirectory + '/icons.woff2'
    )

    await copyIconFile(
        inputDirectory + '/icons-s3.ttf',
        finalDirectory + '/icons-s3.ttf'
    )
    await copyIconFile(
        inputDirectory + '/icons-s3.woff',
        finalDirectory + '/icons-s3.woff'
    )
    await copyIconFile(
        inputDirectory + '/icons-s3.woff2',
        finalDirectory + '/icons-s3.woff2'
    )

    // TODO Make this work
    // jetpack.find("dist/icons").remove()
}

;(async () => {
    await showBanner(
        'Fantasticon',
        '┃▉ •• ━━━ •• ━━ •• ━━━ ••• ━ •• ━━━ ••• ━ • ━━ • ━▉┃'
    )
})()

const command = 'npx fantasticon -c tokens/icons/fantasticonrc.cjs'
exec(command, async function (error, stdout, stderr) {
    if (error) {
        log.error('exec error: ' + error)
    }

    textUI.statusTxt('Fantasticon Results')
    log.info(stdout)

    console.log('', '')
})

const commandS3 = 'npx fantasticon -c tokens/icons/fantasticon-s3.cjs'
exec(commandS3, async function (error, stdout, stderr) {
    if (error) {
        log.error('exec error: ' + error)
    }

    textUI.statusTxt('Fantasticon S3 Results')
    log.info(stdout)

    textUI.statusTxt('Fantasticon Finalizing')
    await finalize()
})
