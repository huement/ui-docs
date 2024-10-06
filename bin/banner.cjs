#!/usr/bin/env node
'use strict'

// 1. Run Fantasticon (uses root .rc file for config)
// 2. Move the generated files into their final resting place
// 3. Remove any lingering empty dir(s)

const showBanner = require('node-banner')
const { textUI } = require('./tui.cjs')

;(async () => {
    const packData = textUI.getParsedPackage()
    await showBanner(
        `${packData.name}`,
        ' ┃▉ •• ━━━ •• ━━ •• ━━━ ••• ━ •• ━━ •• ━━━ ••• ━ • ━ ••• ━ • ▉┃'
    )
})()
