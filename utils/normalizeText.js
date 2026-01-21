function normalizeText(text) {
    if (!text || typeof text !== 'string') return '';

    let normalized = text;

    try {
        const encodings = ['latin1', 'binary', 'win1252', 'iso-8859-1'];
        for (const encoding of encodings) {
            try {
                const buffer = Buffer.from(normalized, encoding);
                const utf8Text = buffer.toString('utf-8');
                if (!utf8Text.includes('�') && utf8Text !== normalized) {
                    normalized = utf8Text;
                    break;
                }
            } catch (e) {
                continue;
            }
        }
    } catch (e) {
        console.error('UTF-8 conversion error:', e);
    }

    normalized = normalized.normalize('NFD');

    const replacements = {
        'æ': 'ae', 'ø': 'o', 'å': 'a',
        'Æ': 'Ae', 'Ø': 'O', 'Å': 'A',
        'ä': 'a', 'ö': 'o', 'ü': 'u',
        'Ä': 'A', 'Ö': 'O', 'Ü': 'U',
        'é': 'e', 'è': 'e', 'ê': 'e',
        'ó': 'o', 'ò': 'o', 'ô': 'o',
        'í': 'i', 'ì': 'i', 'î': 'i',
        'ú': 'u', 'ù': 'u', 'û': 'u',
        'ç': 'c', 'ñ': 'n', 'ß': 'ss'
    };

    Object.keys(replacements).forEach(char => {
        const regex = new RegExp(char, 'g');
        normalized = normalized.replace(regex, replacements[char]);
    });
    normalized = normalized.replace(/[\u0300-\u036f]/g, '');
    normalized = normalized.replace(/\s+/g, ' ').trim();
    return normalized;
}

module.exports = { normalizeText };

