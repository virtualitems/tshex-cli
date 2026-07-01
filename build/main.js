#!/usr/bin/env node
import { program } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
function readPackageJson() {
    const filePath = path.join(import.meta.dirname, '..', 'package.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
}
function executeCreateLib(templatesDir, libraryDir) {
    try {
        fs.cpSync(path.join(templatesDir, 'lib'), libraryDir, {
            recursive: true,
            filter: (src) => src.endsWith('.gitkeep') === false
        });
        console.log('Library created successfully');
    }
    catch (err) {
        console.error(err);
    }
}
function executeCreateContext(templatesDir, contextDir) {
    try {
        fs.cpSync(path.join(templatesDir, 'ctx'), contextDir, {
            recursive: true,
            filter: (src) => src.endsWith('.gitkeep') === false
        });
        console.log('Context created successfully');
    }
    catch (err) {
        console.error(err);
    }
}
function copyDirectoryContents(sourceDir, destinationDir) {
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name);
        const destinationPath = path.join(destinationDir, entry.name);
        if (fs.existsSync(destinationPath) === false) {
            fs.cpSync(sourcePath, destinationPath, {
                recursive: true,
                filter: (src) => src.endsWith('.gitkeep') === false
            });
        }
    }
}
function executeCreateReactProject(templatesDir, projectDir) {
    try {
        fs.cpSync(path.join(templatesDir, 'react-project'), projectDir, {
            recursive: true,
            filter: (src) => src.endsWith('.gitkeep') === false
        });
        copyDirectoryContents(path.join(templatesDir, 'lib', 'shared'), path.join(projectDir, 'core', 'shared'));
        console.log('React project created successfully');
    }
    catch (err) {
        console.error(err);
    }
}
function executeCreateReactContext(templatesDir, contextDir) {
    try {
        fs.cpSync(path.join(templatesDir, 'react-context'), contextDir, {
            recursive: true,
            filter: (src) => src.endsWith('.gitkeep') === false
        });
        console.log('React context created successfully');
    }
    catch (err) {
        console.error(err);
    }
}
function main(program) {
    const templatesDir = path.join(import.meta.dirname, '..', 'templates');
    const options = program.opts();
    let targetDir = path.resolve(options.dir ?? process.cwd());
    if (Object.keys(options).length === 0) {
        program.help();
    }
    if (fs.existsSync(targetDir) === false) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    if (options.lib !== undefined) {
        targetDir = path.join(targetDir, options.lib);
        executeCreateLib(templatesDir, targetDir);
    }
    if (options.ctx !== undefined) {
        targetDir = path.join(targetDir, options.ctx);
        executeCreateContext(templatesDir, targetDir);
    }
    if (options.reactProject !== undefined) {
        targetDir = path.join(targetDir, options.reactProject);
        executeCreateReactProject(templatesDir, targetDir);
    }
    if (options.reactContext !== undefined) {
        targetDir = path.join(targetDir, options.reactContext);
        executeCreateReactContext(templatesDir, targetDir);
    }
}
const packageJson = readPackageJson();
program
    .name('tshex')
    .version(packageJson.version)
    .option('--lib <name>', "creates a new library with it's shared directory")
    .option('--ctx <name>', 'creates a new context')
    .option('--dir <path>', 'sets the directory to create the new item')
    .option('--react-project <name>', 'creates a new React project')
    .option('--react-context <name>', 'creates a new React context')
    .parse(process.argv);
main(program);
