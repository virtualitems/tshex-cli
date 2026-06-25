#!/usr/bin/env node
import { program } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
function readPackageJson() {
    return JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '..', 'package.json'), 'utf-8'));
}
function executeCreateLib(templatesDir, libraryDir) {
    try {
        fs.cpSync(path.join(templatesDir, 'lib'), libraryDir, {
            recursive: true,
            filter: (src) => !src.endsWith('.gitkeep')
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
            filter: (src) => !src.endsWith('.gitkeep')
        });
        console.log('Context created successfully');
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
        return;
    }
    if (!fs.existsSync(targetDir)) {
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
}
const packageJson = readPackageJson();
program
    .name('tshex')
    .version(packageJson.version)
    .option('--lib <name>', "creates a new library with it's shared directory")
    .option('--ctx <name>', 'creates a new context')
    .option('--dir <path>', 'sets the directory to create the new item')
    .parse(process.argv);
main(program);
