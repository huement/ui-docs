#!/usr/bin/env node
const fse = require('fs-extra')
const fsp = require('fs/promises')
const fs = require('fs')
const { textUI } = require('./tui.cjs')
const jetpack = require('fs-jetpack')

const packData = textUI.getParsedPackage()
const debugOutput = packData.debugMode || false

// sleep time expects milliseconds
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

function getDestSize(target) {
    if (jetpack.exists(target)) {
        var statDest = fs.statSync(target)
        var destSizeInBytes = statDest.size
        return textUI.formatBytes(destSizeInBytes)
    } else {
        return 'ERROR: File not found'
    }
}

function moveSrcDest(srcFile, destFile) {
    textUI.taskTxt('MOVING TO ' + destFile)
    jetpack.move(srcFile, destFile, { overwrite: false })
    var destSize = getDestSize(destFile)
    console.log(destSize)
}

function checkThenMove(sourceFile, outputFile) {
    if (fs.existsSync(outputFile)) {
        textUI.taskTxt('REMOVING OLD FILE...')
        // With Promises:
        fse.remove(outputFile)
            .then(() => {
                moveSrcDest(sourceFile, outputFile)
            })
            .catch((err) => {
                console.error(err)
            })
    } else {
        moveSrcDest(sourceFile, outputFile)
    }
}

function fspCompare(sourceFile, destinationFile, fileName) {
    fsp.readFile(destinationFile).then((fileBuffer) => {
        // now read the new file
        fsp.readFile(sourceFile).then((fileBufferNew) => {
            // your logic here
            if (fileBuffer.toString() === fileBufferNew.toString()) {
                if ( debugOutput ) {
                    textUI.infoTxt( "NOT MOVING "+fileName )
                }
            } else {
                textUI.statusTxt( "MOVING "+fileName )

                checkThenMove(sourceFile, destinationFile)
            }
        })
    })
}

function compareCurrentFileToDestination(inputFilePath, outputFilePath) {
    var filename = inputFilePath.replace(/^.*[\\/]/, '')

    var dest = outputFilePath + filename

    var statSrc = fs.statSync(inputFilePath)
    var srcSizeInBytes = statSrc.size
    var srcSize = textUI.formatBytes(srcSizeInBytes)

    var statDest = 0
    var destSizeInBytes = 0
    var destSize = null
    var destSizeCheck = jetpack.exists(dest)
    sleep(1000)

    if (destSizeCheck && destSizeCheck === 'file') {
        statDest = fs.statSync(dest)
        destSizeInBytes = statDest.size
        destSize = textUI.formatBytes(destSizeInBytes)
        sleep(1000)
    }

    if (!destSize) {
        textUI.statusTxt("MOVING "+filename+" AUTOMATICALLY")
        moveSrcDest(inputFilePath, dest)
    } else {
        fspCompare(inputFilePath, dest, filename)
        sleep(1000)
    }
}

function findAllFilesToUpdate(
    sourceFileToCheck,
    sourceSeachString,
    outputPath
) {
    var allTheFiles = jetpack.find(sourceFileToCheck, {
        matching: sourceSeachString,
    })

    for (const pathPath of allTheFiles) {
        compareCurrentFileToDestination(pathPath, outputPath)
    }

    compareCurrentFileToDestination("./dist/index.html", "./index.html")
}

textUI.headerLog(
    `Running MOVE command. checking for changed .HTML files`
)
findAllFilesToUpdate('_temp', '*.html', 'dist/docs/')
