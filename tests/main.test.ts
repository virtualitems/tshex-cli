import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.join(import.meta.dirname!, '..')
const TESTS_OUT = path.join(ROOT, '.tests')
const TEMPLATES = path.join(ROOT, 'templates')
const CLI = path.join(ROOT, 'build', 'main.js')

function cli(...args: string[]): { ok: boolean; stdout: string; stderr: string } {
    const result = new Deno.Command('deno', {
        args: ['run', '--allow-all', CLI, ...args],
        stdout: 'piped',
        stderr: 'piped',
    }).outputSync()

    return {
        ok: result.success,
        stdout: new TextDecoder().decode(result.stdout),
        stderr: new TextDecoder().decode(result.stderr),
    }
}

function reset(dir: string): void {
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true })
    fs.mkdirSync(dir, { recursive: true })
}

function assertMatchesTemplate(generatedDir: string, templateDir: string): void {
    function walk(tmplCurrent: string, rel: string): void {
        for (const entry of fs.readdirSync(tmplCurrent, { withFileTypes: true })) {
            const entryRel = rel ? `${rel}/${entry.name}` : entry.name
            const tmplFull = path.join(tmplCurrent, entry.name)
            const genFull = path.join(generatedDir, entryRel)

            if (entry.isDirectory()) {
                assert.ok(
                    fs.existsSync(genFull) && fs.statSync(genFull).isDirectory(),
                    `Missing directory: ${entryRel}`
                )
                walk(tmplFull, entryRel)
            } else if (entry.name !== '.gitkeep') {
                assert.ok(fs.existsSync(genFull), `Missing file: ${entryRel}`)
                assert.strictEqual(
                    fs.readFileSync(genFull, 'utf-8'),
                    fs.readFileSync(tmplFull, 'utf-8'),
                    `Content mismatch: ${entryRel}`
                )
            }
        }
    }

    walk(templateDir, '')
}

Deno.test('--project generates correct structure from lib template', () => {
    const dir = path.join(TESTS_OUT, 'project')
    reset(dir)

    const { ok, stderr } = cli('--dir', dir, '--project', 'myapp')
    assert.ok(ok, stderr)

    assertMatchesTemplate(path.join(dir, 'myapp'), path.join(TEMPLATES, 'lib'))
})

Deno.test('--context generates correct structure from ctx template', () => {
    const dir = path.join(TESTS_OUT, 'context')
    reset(dir)

    const { ok, stderr } = cli('--dir', dir, '--context', 'orders')
    assert.ok(ok, stderr)

    assertMatchesTemplate(path.join(dir, 'orders'), path.join(TEMPLATES, 'ctx'))
})

Deno.test('--context --react generates correct structure from ctx-react template', () => {
    const dir = path.join(TESTS_OUT, 'react')
    reset(dir)

    const { ok, stderr } = cli('--dir', dir, '--context', 'products', '--react')
    assert.ok(ok, stderr)

    assertMatchesTemplate(path.join(dir, 'products'), path.join(TEMPLATES, 'ctx-react'))
})

Deno.test('--react without --context exits with error', () => {
    const { ok, stderr } = cli('--react')
    assert.ok(!ok, 'Should have exited with error')
    assert.ok(stderr.includes('--react requires --context'), stderr)
})

Deno.test('--tests mirrors source structure using tests template content', () => {
    const dir = path.join(TESTS_OUT, 'tests-cmd')
    reset(dir)

    const src = path.join(dir, 'src')
    fs.mkdirSync(path.join(src, 'orders'), { recursive: true })
    fs.mkdirSync(path.join(src, 'products'), { recursive: true })
    fs.mkdirSync(path.join(src, 'shared'), { recursive: true })
    fs.writeFileSync(path.join(src, 'orders', 'service.ts'), '')
    fs.writeFileSync(path.join(src, 'products', 'handler.ts'), '')
    fs.writeFileSync(path.join(src, 'shared', 'utils.ts'), '')

    const dest = path.join(dir, 'dest')
    fs.mkdirSync(path.join(dest, 'tests'), { recursive: true })

    const { ok, stderr } = cli('--dir', dest, '--tests', src)
    assert.ok(ok, stderr)

    const templateContent = fs.readFileSync(path.join(TEMPLATES, 'tests', 'content.ts'), 'utf-8')
    const testsDir = path.join(dest, 'tests', 'src')

    const expectedFiles = [
        path.join(testsDir, 'orders', 'service.ts'),
        path.join(testsDir, 'products', 'handler.ts'),
    ]

    for (const file of expectedFiles) {
        assert.ok(fs.existsSync(file), `Missing: ${file}`)
        assert.strictEqual(fs.readFileSync(file, 'utf-8'), templateContent, `Wrong content: ${file}`)
    }

    assert.ok(
        !fs.existsSync(path.join(testsDir, 'shared', 'utils.ts')),
        'shared/ at root level should be skipped'
    )
})
