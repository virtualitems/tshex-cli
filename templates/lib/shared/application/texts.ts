/**
 * @description Dedents a string by converting tabs to spaces,
 * removing leading and trailing whitespace,
 * and collapsing multiple spaces into one.
 *
 * @param {string} str - The string to be dedented
 * @returns {string} - The dedented string
 */
export function dedent(str: string): string {
    return str
        .replace(/\t/g, ' ')
        .replace(/\r?\n/g, '\n')
        .trim()
        .replace(/ +/g, ' ')
}
