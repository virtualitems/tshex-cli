#!/usr/bin/env node

// NPM LIBRARIES

import { program } from 'commander'

// NODE LIBRARIES

import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

// FUNCTIONS

function readPackageJson() {
    const filePath = path.join(import.meta.dirname, '..', 'package.json')
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContents)
}

function executeCreateProject(templatesDir: string, projectDir: string) {
    try {
        fs.cpSync(path.join(templatesDir, 'lib'), projectDir, {
            recursive: true,
            filter: (src) => src.endsWith('.gitkeep') === false
        })
        console.log('Project created successfully')
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

function executeCreateTests(
    sourceDir: string,
    destinationDir: string,
    fileContents: string,
    ignoredSourceDir?: string,
    rootSourceDir: string = sourceDir
) {
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true })

    if (fs.existsSync(destinationDir) === false) {
        fs.mkdirSync(destinationDir, { recursive: true })
    }

    for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name)
        const destinationPath = path.join(destinationDir, entry.name)

        if (entry.isDirectory()) {
            if (entry.name === 'shared' && sourceDir === rootSourceDir) {
                continue
            }

            if (ignoredSourceDir !== undefined && sourcePath.startsWith(ignoredSourceDir)) {
                continue
            }

            if (fs.existsSync(destinationPath) && fs.statSync(destinationPath).isDirectory() === false) {
                continue
            }

            executeCreateTests(sourcePath, destinationPath, fileContents, ignoredSourceDir, rootSourceDir)
            continue
        }

        if (entry.isFile() && entry.name.endsWith('.ts') && fs.existsSync(destinationPath) === false) {
            fs.writeFileSync(destinationPath, fileContents)
        }
    }
}

async function ensureTestsDirectory(testsRootDir: string) {
    if (fs.existsSync(testsRootDir)) {
        if (fs.statSync(testsRootDir).isDirectory() === false) {
            throw new Error(`Tests path exists but is not a directory: ${testsRootDir}`)
        }

        return
    }

    const rl = readline.createInterface({ input, output })

    try {
        const answer = await rl.question(`Tests directory does not exist at ${testsRootDir}. Create it? (y/N) `)

        if (answer.trim().toLowerCase() !== 'y') {
            return false
        }
    } finally {
        rl.close()
    }

    fs.mkdirSync(testsRootDir, { recursive: true })
    return true
}

async function main(program: typeof import('commander').program) {
    const templatesDir = path.join(import.meta.dirname, '..', 'templates')

    const options = program.opts()

    let targetDir = path.resolve(options.dir ?? process.cwd())

    if (Object.keys(options).length === 0) {
        program.help()
    }

    if (fs.existsSync(targetDir) === false) {
        fs.mkdirSync(targetDir, { recursive: true })
    }

    if (options.project !== undefined) {
        targetDir = path.join(targetDir, options.project)
        executeCreateProject(templatesDir, targetDir)
    }

    if (options.react === true && options.context === undefined) {
        program.error('Option --react requires --context <name>')
    }

    if (options.context !== undefined) {
        targetDir = path.join(targetDir, options.context)

        if (options.react === true) {
            executeCreateReactContext(templatesDir, targetDir)
        } else {
            executeCreateContext(templatesDir, targetDir)
        }
    }

    if (options.tests !== undefined) {
        const sourceDir = path.resolve(options.tests)
        const testsTemplateFile = path.join(templatesDir, 'tests', 'content.ts')

        if (fs.existsSync(sourceDir) === false) {
            program.error(`Tests source directory does not exist: ${sourceDir}`)
        }

        if (fs.statSync(sourceDir).isDirectory() === false) {
            program.error(`Tests source path is not a directory: ${sourceDir}`)
        }

        if (fs.existsSync(testsTemplateFile) === false) {
            program.error(`Tests template file does not exist: ${testsTemplateFile}`)
        }

        const testsTemplateContents = fs.readFileSync(testsTemplateFile, 'utf-8')

        const testsRootDir = path.join(targetDir, 'tests')
        const testsDirectoryCreated = await ensureTestsDirectory(testsRootDir)

        if (testsDirectoryCreated === false) {
            program.error('Tests directory creation cancelled')
        }

        const testsDir = path.join(testsRootDir, path.basename(sourceDir))

        if (testsDir === sourceDir) {
            program.error('Tests destination directory cannot be the same as the source directory')
        }

        executeCreateTests(sourceDir, testsDir, testsTemplateContents, testsRootDir)
        console.log('Tests structure created successfully')
    }
}

const packageJson = readPackageJson()

program
    .name('tshex')
    .version(packageJson.version)
    .option('-P, --project <name>', "creates a new project with it's shared directory")
    .option('-C, --context <name>', 'creates a new context')
    .option('-R, --react', 'creates a React context with --context')
    .option('-T, --tests <path>', 'creates a .ts tests structure from an existing directory')
    .option('--dir <path>', 'sets the directory to create the new item')
    .parse(process.argv)

void main(program).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err)
    program.error(message)
})
