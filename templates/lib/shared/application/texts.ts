const dedentRegex = /^\s+|\s+$|[ \t]*\r?\n[ \t]*|[ \t]+/g

const whitespaceOnlyRegex = /^\s+$/

function replacer(match: string): string {
    if (match.includes('\n')) return '\n'
    if (whitespaceOnlyRegex.test(match)) return ''
    return ' '
}

/**
 * @description Dedents a string by converting tabs to spaces,
 * removing leading and trailing whitespace,
 * and collapsing multiple spaces into one.
 *
 * @param {string} str - The string to be dedented
 * @returns {string} - The dedented string
 */
export function dedent(str: string): string {
    return str.replace(dedentRegex, replacer)
}
