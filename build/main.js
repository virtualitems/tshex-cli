#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import path from 'path';
program
    .name('tshex')
    .version('1.0.0')
    .option('--lib <name>', 'creates a new library with it\'s shared directory')
    .option('--ctx <name>', 'creates a new context')
    .option('--cls <name>', 'creates a new class')
    .option('--rfc <name>', 'creates a new react functional component')
    .option('--dir <path>', 'sets the directory to create the new item')
    .parse(process.argv);
function executeCreateLib(templatesDir, libraryDir) {
    try {
        fs.cpSync(path.join(templatesDir, 'lib'), libraryDir, {
            recursive: true,
            filter: function (src) { return (!src.endsWith('.gitkeep')); }
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
            filter: function (src) { return (!src.endsWith('.gitkeep')); }
        });
        console.log('Context created successfully');
    }
    catch (err) {
        console.error(err);
    }
}
function executeCreateClass(templatesDir, classDir) {
    try {
        fs.cpSync(path.join(templatesDir, 'class.example'), classDir, {});
        console.log('Class created successfully');
    }
    catch (err) {
        console.error(err);
    }
}
function executeCreateReactFunctionalComponent(templatesDir, classDir) {
    try {
        fs.cpSync(path.join(templatesDir, 'react.component.example'), classDir, {});
        console.log('React component created successfully');
    }
    catch (err) {
        console.error(err);
    }
}
(function () {
    var _a;
    var templatesDir = path.join(import.meta.dirname, '..', 'templates');
    var options = program.opts();
    var targetDir = path.resolve((_a = options.dir) !== null && _a !== void 0 ? _a : process.cwd());
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
    if (options.cls !== undefined) {
        var target = path.join(targetDir, options.cls + '.ts');
        executeCreateClass(templatesDir, target);
    }
    if (options.rfc !== undefined) {
        var target = path.join(targetDir, options.rfc + '.tsx');
        executeCreateReactFunctionalComponent(templatesDir, target);
    }
})();
