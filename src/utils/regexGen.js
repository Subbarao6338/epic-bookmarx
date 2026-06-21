/**
 * Ported Regex Generation logic from Elixir Java implementation.
 * Ported to TypeScript/JavaScript for client-side functionality.
 */

export const generateRegex = (input) => {
    if (!input) return '';

    // Basic heuristic-based regex generation
    let pattern = input
        .replace(/[a-z]/g, '[a-z]')
        .replace(/[A-Z]/g, '[A-Z]')
        .replace(/\d/g, '\\d')
        .replace(/\s/g, '\\s');

    // Grouping repetitions
    pattern = pattern.replace(/(\[a-z\])+/g, (match) => `[a-z]{${match.length / 5}}`);
    pattern = pattern.replace(/(\[A-Z\])+/g, (match) => `[A-Z]{${match.length / 5}}`);
    pattern = pattern.replace(/(\\d)+/g, (match) => `\\d{${match.length / 2}}`);
    pattern = pattern.replace(/(\\s)+/g, (match) => `\\s{${match.length / 2}}`);

    return `^${pattern}$`;
};

export const testRegex = (regex, text) => {
    try {
        const re = new RegExp(regex);
        return re.test(text);
    } catch (e) {
        return false;
    }
};
