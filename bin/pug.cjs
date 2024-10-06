#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-argument */

//  Runs the PUG command with a number of custom filters
//  Allowing for JSTransformer & other dynamic data to be applied on build

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

const pug = require('pug')
const packData = require('../package.json')
const fs = require('fs-extra')
const c = require('ansi-colors')
const path = require('path')
const async = require('async')
const glob = require('glob')
const jetpack = require( 'fs-jetpack' )
const { textUI } = require( './tui.cjs' )
const { fileMGMT } = require('./filemgmt.cjs')
require('dotenv').config()

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs( hideBin( process.argv ) ).argv

class PugPageBuilder {
    constructor( tokenFile, outputFile ) {
        textUI.headerLog('Building HTML Page from Pug Templates')

        this.pageList = require('../web/pages/webpages.json')

        this.tokenFile = tokenFile
        this.resultFile = outputFile
        this. pugMojo = {
            pretty: true,
            filters: {
                stylus: function (str, opts) {
                    let ret
                    str = str.replace(/\\n /g, '')
                    const styl = require('stylus')
                    styl(str, opts).render(function (err, css) {
                        if (err) throw err
                        ret = css.replace(/\s/g, '')
                    })
                    return '\n<style>' + ret + '</style>'
                },
                markdownify: function (block) {
                    const jstransformer = require('jstransformer')
                    const marked = jstransformer(require('jstransformer-markdown-it'))
                    const markdownBlock = marked.render(block).body
                    return markdownBlock
                },
                highlightify: function (block, options) {
                    const jstransformer = require('jstransformer')
                    const highlight = jstransformer(require('jstransformer-highlight'))

                    const lang = options.lang || 'html'
                    const oc = options.class || ''
                    const render = highlight.render(block, { language: lang }).body

                    // prettier-ignore
                    const results = "<pre class='code " + oc + "' data-lang='" + lang + "'><code>" + render + '</code></pre>'
                    return results
                },
                prismify: function (block, options) {
                    const jstransformer = require('jstransformer')
                    const prism = jstransformer(require('jstransformer-prismjs'))

                    const lang = options.lang || 'html'
                    const render = prism.render(block, { language: lang }).body

                    // prettier-ignore
                    const results = "<pre class='code' data-lang='" + lang + "'><code>" + render + '</code></pre>'
                    return results
                },
                codeblock: function (block, option) {
                    const jstransformer = require('jstransformer')
                    const highlight = jstransformer(require('jstransformer-highlight'))

                    const lang = option.lang || 'html'
                    const cName = option.class || ''
                    const prevC = option.previewClass || ''
                    const fClass = 'documentation-content' + ' ' + cName

                    let escaped = ''
                    if (lang === 'html') {
                        escaped = `<div class="preview-wrapper"><div class="mojo-preview ${prevC}">${block}</div></div>`
                    }

                    const highlightBlock = highlight.render(block, {
                        language: lang,
                    }).body
                    const highlighted = `<div class='mojo-highlight'><pre class="code" data-lang="${lang}"><code>${highlightBlock}</code></pre></div>`

                    const ex = "<span class='mojo-doclabel'>EXAMPLE</span>"
                    const htmlTemplate =
                        "<div class='mojo-docblock'>" +
                        ex +
                        escaped +
                        highlighted +
                        '</div>'
                    const final =
                        "<div class='" + fClass + "'>" + htmlTemplate + '</div>'

                    return final
                },
                iconify: function (block) {},
            },
        }

        this.buildDataObject = {
            pages: require('../web/pages/docs/pagelist.json'),
            package: packData,
            envData: { url: process.env.URL },
            colorStacks: require('../tokens/stack.json'),
            colorTokens: require('../tokens/chords.json'),
            iconList: require('../web/pages/docs/iconlist.json'),
            templatePages: require('../web/pages/templates/templatelist.json'),
        }
    }

    async transformPugDocTemplates(pageName, pageOptions) {
        const html = pug.compileFile(
            './web/pages/' + pageName + '.pug',
            pageOptions
        )({
            pages: require('../web/pages/docs/pagelist.json'),
            package: packData,
            envData: { url: process.env.URL },
            colorStacks: require('../tokens/stack.json'),
            colorTokens: require('../tokens/chords.json'),
            iconList: require('../web/pages/docs/iconlist.json'),
            templatePages: require('../web/pages/templates/templatelist.json'),
        })

        return html
    }

    transformPugPageTemplates(pageData) {
        // const dynamicData = this.buildDataObject

        const html = pug.compileFile(
            pageData.path + pageData.file,
            this.pugMojo
        )({
            pages: require('../web/pages/webpages'),
            package: packData,
            envData: { url: process.env.URL },
        })

        fs.writeFile('dist' + pageData.url, html, (err) => {
            if (err !== null && err !== undefined) {
                console.error(err)
            }

            // file written successfully
            console.log(
                c.green.bold('dist' + pageData.url),
                c.green(' created successfully!')
            )
        })
    }

    /**
     * use regex to find a string for a given file. useful for finding page config data etc
     * @param {String} fullPath - path to file that will be searched
     * @param {String} regexString - string converted into regex filter
     * @return {String|bool} returns either the first instance of found string or false
     */
    async findStringInFile(fullPath, regexString) {
        const data = fs.readFileSync(fullPath).toString('utf8')
        const dataArr = data.split('\n')
        const regex = new RegExp(regexString)
        if (regex.test(data)) {
            for (const line of dataArr) {
                if (regex.test(line)) {
                    return line
                }
            }
        }

        return false
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
    }

    buildWebpages(searchDir = 'web/pages/') {
        textUI.statusTxt( 'TRANSFORMING PUG -> HTML...' )
        console.log( this.pageList )

        for (const pObj of this.pageList) {
            pObj.path = searchDir

            if ( pObj.file ) {
                console.log('Target: ' + searchDir + pObj.file)
                this.transformPugPageTemplates(pObj)
            } else {
                console.log('skipping ' + pObj.name + '. no file given')
            }
        }

        console.log('', '', '')
    }

    async buildDocumentation(searchDir = 'web/pages/docs') {
        // Get a list of all the pages to build
        // Load the required global pug vars
        // Compile each page
        // const baseDir = path.resolve(process.cwd())
        const searchPath = path.resolve(process.cwd(), searchDir)
        const outputDir = './_temp/'
        const outputPath = path.resolve(process.cwd(), outputDir)

        console.log(searchPath, outputPath)
        jetpack.dir(outputPath)

        const AllFiles = jetpack.find(searchPath, {
            matching: '*.pug',
            recursive: false,
        })

        for (const file of AllFiles) {
            console.log('Target: ' + file)
            const pageObj = {}
            const fname = this.capitalizeFirstLetter(path.parse(file).name)
            const fslug = this.slugify(fname)
            const furl = './docs/' + fslug + '.html'

            // Grouping
            let fgroup = ''
            const groupName = await this.findStringInFile(file, /var\sparent\b/)
            if (groupName !== 0 && groupName !== undefined) {
                // Clean Up Match
                fgroup = groupName
                    .replace('- var parent =', '')
                    .replace('"', '')
                    .replace('"', '')
                    .replace("'", '')
                    .replace("'", '')
                    .trim()
            }
            pageObj.group = fgroup
            pageObj.name = fname
            pageObj.url = furl
            pageObj.path = outputDir + fslug + '.html'
            pageObj.html = await this.transformPugDocTemplates('docs/' + fslug, this.pugMojo)

            void fileMGMT.writeOutFile(pageObj.path, pageObj.html)
            console.log(c.green.bold(fname + ' WRITTEN'))

            // console.log(JSON.stringify(pageObj))
        }

        // Filename is either derived from the target OR explicitly declared
        // let lastItem = this.target.substring(this.target.lastIndexOf("/") + 1);

        // if (this.data.filename) finalPageName = slugify(this.data.filename)

        const totalPages = AllFiles.length
        // if (searchResults.length > 0) {
        //   writeJson(finalPage + '.json', searchResults, options.indent)
        // } else {
        //   writeOutFile(finalPage + '.json', gList, options.indent)
        // }

        console.log(
            '\n',
            c.green.bold(
                `${totalPages} doc pages linked up and saved to: ${outputDir}`
            ),
            '\n'
        )
    }
}

module.exports = PugPageBuilder

if ( argv.build ) {
    textUI.headerLog("RUNNING PUG PAGE BUILDER...")
    const pugBuilder = new PugPageBuilder()
    pugBuilder.buildWebpages()
    pugBuilder.buildDocumentation()
}
