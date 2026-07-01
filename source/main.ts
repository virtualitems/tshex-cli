#!/usr/bin/env node

// NPM LIBRARIES

import { program } from 'commander'

// NODE LIBRARIES

import fs from 'node:fs'
import path from 'node:path'

// FUNCTIONS

function readPackageJson() {
    const filePath = path.join(import.meta.dirname, '..', 'package.json')
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContents)
}

function executeCreateLib(templatesDir: string, libraryDir: string) {
    try {
        fs.cpSync(path.join(templatesDir, 'lib'), libraryDir, {
            recursive: true,
            filter: (src) => src.endsWith('.gitkeep') === false
        })
        console.log('Library created successfully')
    } catch (err) {
        console.error(err)
    }
}

function executeCreateContext(templatesDir: string, contextDir: string) {
    try {
        fs.cpSync(path.join(templatesDir, 'ctx'), contextDir, {
            recursive: true,
            filter: (src) => src.endsWith('.gitkeep') === false
        })
        console.log('Context created successfully')
    } catch (err) {
        console.error(err)
    }
}

function executeCreateReactContext(templatesDir: string, contextDir: string) {
    try {
        fs.cpSync(path.join(templatesDir, 'ctx-react'), contextDir, {
            recursive: true,
            filter: (src) => src.endsWith('.gitkeep') === false
        })
        console.log('React context created successfully')
    } catch (err) {
        console.error(err)
    }
}

function main(program: typeof import('commander').program) {
    const templatesDir = path.join(import.meta.dirname, '..', 'templates')

    const options = program.opts()

    let targetDir = path.resolve(options.dir ?? process.cwd())

    if (Object.keys(options).length === 0) {
        program.help()
    }

    if (fs.existsSync(targetDir) === false) {
        fs.mkdirSync(targetDir, { recursive: true })
    }

    if (options.lib !== undefined) {
        targetDir = path.join(targetDir, options.lib)
        executeCreateLib(templatesDir, targetDir)
    }

    if (options.ctx !== undefined) {
        targetDir = path.join(targetDir, options.ctx)
        executeCreateContext(templatesDir, targetDir)
    }

    if (options.react !== undefined) {
        targetDir = path.join(targetDir, options.react)
        executeCreateReactContext(templatesDir, targetDir)
    }
}

const packageJson = readPackageJson()

program
    .name('tshex')
    .version(packageJson.version)
    .option('--lib <name>', "creates a new library with it's shared directory")
    .option('--ctx <name>', 'creates a new context')
    .option('--dir <path>', 'sets the directory to create the new item')
    .option('--react <name>', 'creates a new React context')
    .parse(process.argv)

main(program)
