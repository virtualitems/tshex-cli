#!/usr/bin/env node
import { program } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
function readPackageJson() {
    const filePath = path.join(import.meta.dirname, '..', 'package.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
}
function executeCreateProject(templatesDir, projectDir) {
    try {
        fs.cpSync(path.join(templatesDir, 'lib'), projectDir, {
            recursive: true,
            filter: (src) => src.endsWith('.gitkeep') === false
        });
        console.log('Project created successfully');
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
function executeCreateReactContext(templatesDir, contextDir) {
    try {
        fs.cpSync(path.join(templatesDir, 'ctx-react'), contextDir, {
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
    if (options.project !== undefined) {
        targetDir = path.join(targetDir, options.project);
        executeCreateProject(templatesDir, targetDir);
    }
    if (options.react === true && options.context === undefined) {
        program.error('Option --react requires --context <name>');
    }
    if (options.context !== undefined) {
        targetDir = path.join(targetDir, options.context);
        if (options.react === true) {
            executeCreateReactContext(templatesDir, targetDir);
        }
        else {
            executeCreateContext(templatesDir, targetDir);
        }
    }
}
const packageJson = readPackageJson();
program
    .name('tshex')
    .version(packageJson.version)
    .option('-P, --project <name>', "creates a new project with it's shared directory")
    .option('-C, --context <name>', 'creates a new context')
    .option('-R, --react', 'creates a React context with --context')
    .option('--dir <path>', 'sets the directory to create the new item')
    .parse(process.argv);
main(program);
