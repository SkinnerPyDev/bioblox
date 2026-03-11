// ===================== ROBLOX FONT GENERATOR JS =====================

// Helper: properly split Unicode strings (handles surrogate pairs)
const chars = s => [...s];

// ---- UNICODE MAPS ----
const MAPS = {
    cursive: chars('ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ'),
    cursiveBold: chars('𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃'),
    script: chars('𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'),
    bold: chars('𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳'),
    italic: chars('𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧'),
    boldItalic: chars('𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛'),
    sansBold: chars('𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇'),
    sansItalic: chars('𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻'),
    sansBoldItalic: chars('𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯'),
    mono: chars('𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣'),
    fraktur: chars('𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷'),
    gothicBold: chars('𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟'),
    doubleStruck: chars('𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫'),
    bubble: chars('ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ'),
    bubbleBold: chars('🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩'),
    fullwidth: chars('ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'),
    smallCaps: chars('ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀsᴛᴜᴠᴡxʏᴢ'),
    cyrillic: chars('аъсдефгнітјкlмnорцrстцvwхуz'),
    greek: chars('αβcδεfgηιjklμνoπqρsτυvwxγz'),
};

const ALPHA = chars('abcdefghijklmnopqrstuvwxyz');
const ALPHA_UP = chars('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const MAPS_UP = {
    cursiveBold: chars('𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩'),
    script: chars('𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵'),
    bold: chars('𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙'),
    italic: chars('𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍'),
    boldItalic: chars('𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁'),
    sansBold: chars('𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭'),
    sansItalic: chars('𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡'),
    sansBoldItalic: chars('𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕'),
    mono: chars('𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉'),
    fraktur: chars('𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ'),
    gothicBold: chars('𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅'),
    doubleStruck: chars('𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ'),
    bubble: chars('ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ'),
    bubbleBold: chars('🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩'),
    fullwidth: chars('ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ'),
    smallCaps: chars('ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀsᴛᴜᴠᴡxʏᴢ'),
};

// Combining characters
const STRIKE = '\u0336';
const UNDERL = '\u0332';
const DOUBLE_U = '\u0333';
const DOT_AB = '\u0307';
const DOT_BL = '\u0323';
const RING = '\u030A';

function convertMap(text, mapLower, mapUpper) {
    return [...text].map(ch => {
        const li = ALPHA.indexOf(ch.toLowerCase());
        if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) {
            // uppercase
            const ui = ALPHA_UP.indexOf(ch);
            return (mapUpper && ui >= 0) ? mapUpper[ui] : (li >= 0 ? mapLower[li] : ch);
        }
        return li >= 0 ? mapLower[li] : ch;
    }).join('');
}

function addCombining(text, combChar) {
    return [...text].map(ch => ch + combChar).join('');
}

// ---- ALL 150 FONT STYLES ----
const FONT_STYLES = [
    // ---- AESTHETIC ----
    { name: 'Aesthetic Script', cat: 'aesthetic', convert: t => convertMap(t, MAPS.cursiveBold, MAPS_UP.cursiveBold) },
    { name: 'Italic Script', cat: 'aesthetic', convert: t => convertMap(t, MAPS.script, MAPS_UP.script) },
    { name: 'Bold Italic', cat: 'aesthetic', convert: t => convertMap(t, MAPS.boldItalic, MAPS_UP.boldItalic) },
    { name: 'Sans Italic', cat: 'aesthetic', convert: t => convertMap(t, MAPS.sansItalic, MAPS_UP.sansItalic) },
    { name: 'Sans Bold Italic', cat: 'aesthetic', convert: t => convertMap(t, MAPS.sansBoldItalic, MAPS_UP.sansBoldItalic) },
    { name: 'Double Struck', cat: 'aesthetic', convert: t => convertMap(t, MAPS.doubleStruck, MAPS_UP.doubleStruck) },
    { name: 'Monospace', cat: 'aesthetic', convert: t => convertMap(t, MAPS.mono, MAPS_UP.mono) },
    { name: 'Fullwidth', cat: 'aesthetic', convert: t => convertMap(t, MAPS.fullwidth, MAPS_UP.fullwidth) },
    { name: 'Small Caps', cat: 'aesthetic', convert: t => convertMap(t, MAPS.smallCaps, MAPS_UP.smallCaps) },
    { name: 'Superscript', cat: 'aesthetic', convert: t => convertMap(t, MAPS.cursive, null) },
    { name: 'Italic', cat: 'aesthetic', convert: t => convertMap(t, MAPS.italic, MAPS_UP.italic) },
    { name: 'Bold Sans', cat: 'aesthetic', convert: t => convertMap(t, MAPS.sansBold, MAPS_UP.sansBold) },
    // ---- GOTHIC ----
    { name: 'Gothic Fraktur', cat: 'gothic', convert: t => convertMap(t, MAPS.fraktur, MAPS_UP.fraktur) },
    { name: 'Gothic Bold', cat: 'gothic', convert: t => convertMap(t, MAPS.gothicBold, MAPS_UP.gothicBold) },
    { name: 'Gothic + Underline', cat: 'gothic', convert: t => addCombining(convertMap(t, MAPS.gothicBold, MAPS_UP.gothicBold), UNDERL) },
    { name: 'Fraktur + Strike', cat: 'gothic', convert: t => addCombining(convertMap(t, MAPS.fraktur, MAPS_UP.fraktur), STRIKE) },
    { name: 'Gothic Bold + Italic', cat: 'gothic', convert: t => convertMap(t, MAPS.boldItalic, MAPS_UP.boldItalic) + '᪵' },
    { name: 'Greek Style', cat: 'gothic', convert: t => convertMap(t, MAPS.greek, null) },
    // ---- CUTE ----
    { name: 'Bubble', cat: 'cute', convert: t => convertMap(t, MAPS.bubble, MAPS_UP.bubble) },
    { name: 'Bubble Bold', cat: 'cute', convert: t => convertMap(t, MAPS.bubbleBold, MAPS_UP.bubbleBold) },
    { name: 'Bubble + Script', cat: 'cute', convert: t => convertMap(t, MAPS.bubble, MAPS_UP.bubble) + ' ' + convertMap(t, MAPS.cursiveBold, MAPS_UP.cursiveBold) },
    { name: 'Bold', cat: 'cute', convert: t => convertMap(t, MAPS.bold, MAPS_UP.bold) },
    // ---- FUN ----
    { name: 'Strikethrough', cat: 'fun', convert: t => addCombining(t, STRIKE) },
    { name: 'Underline', cat: 'fun', convert: t => addCombining(t, UNDERL) },
    { name: 'Double Underline', cat: 'fun', convert: t => addCombining(t, DOUBLE_U) },
    { name: 'Dot Above', cat: 'fun', convert: t => addCombining(t, DOT_AB) },
    { name: 'Dot Below', cat: 'fun', convert: t => addCombining(t, DOT_BL) },
    { name: 'Ring Above', cat: 'fun', convert: t => addCombining(t, RING) },
    { name: 'Bold + Strikethrough', cat: 'fun', convert: t => addCombining(convertMap(t, MAPS.bold, MAPS_UP.bold), STRIKE) },
    { name: 'Aesthetic + Strike', cat: 'fun', convert: t => addCombining(convertMap(t, MAPS.cursiveBold, MAPS_UP.cursiveBold), STRIKE) },
    { name: 'Italic + Underline', cat: 'fun', convert: t => addCombining(convertMap(t, MAPS.italic, MAPS_UP.italic), UNDERL) },
    { name: 'AlTeRnAtInG CaPs', cat: 'fun', convert: t => [...t].map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join('') },
    { name: 'rEvErSe AlTeRnAtInG', cat: 'fun', convert: t => [...t].map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('') },
    {
        name: 'Upside Down', cat: 'fun', convert: t => [...t].map(c => {
            const map = { a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ɓ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z', A: '∀', B: 'B', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I', J: 'ɾ', L: '˥', M: 'W', N: 'N', P: 'Ԁ', R: 'ɹ', T: '┴', U: '∩', V: 'Λ', W: 'M', Y: '⅄' };
            return map[c] || c;
        }).reverse().join('')
    },
    { name: 'Mirror', cat: 'fun', convert: t => [...t].reverse().join('') },
    { name: 'Spaced Out', cat: 'fun', convert: t => [...t].join(' ') },
    { name: 'Extra Spaced', cat: 'fun', convert: t => [...t].join('  ') },
];

// ---- DECORATIVE STYLES (wrap text) ----
const DECO_STYLES = [
    // Borders
    { name: '꧁ ꧂ Border', cat: 'deco', wrap: ['꧁', '꧂'] },
    { name: '【 】Square', cat: 'deco', wrap: ['【', '】'] },
    { name: '『 』Corner', cat: 'deco', wrap: ['『', '』'] },
    { name: '「 」Bracket', cat: 'deco', wrap: ['「', '」'] },
    { name: '《 》Double Angle', cat: 'deco', wrap: ['《', '》'] },
    { name: '〖 〗White Corner', cat: 'deco', wrap: ['〖', '〗'] },
    { name: '⟦ ⟧ Math', cat: 'deco', wrap: ['⟦', '⟧'] },
    { name: '❮ ❯ Arrow', cat: 'deco', wrap: ['❮', '❯'] },
    { name: '❝ ❞ Quote', cat: 'deco', wrap: ['❝', '❞'] },
    { name: '꒰ ꒱ Kawaii', cat: 'deco', wrap: ['꒰', '꒱'] },
    { name: '⌜ ⌝ Corner Box', cat: 'deco', wrap: ['⌜', '⌝'] },
    { name: '⎛ ⎞ Paren', cat: 'deco', wrap: ['⎛', '⎞'] },
    // Stars / gems
    { name: '✦ ✦ Star', cat: 'deco', wrap: ['✦', '✦'] },
    { name: '★ ★ Bold Star', cat: 'deco', wrap: ['★', '★'] },
    { name: '☆ ☆ Hollow Star', cat: 'deco', wrap: ['☆', '☆'] },
    { name: '✧ ✧ Sparkle', cat: 'deco', wrap: ['✧', '✧'] },
    { name: '✨ ✨ Glitter', cat: 'deco', wrap: ['✨', '✨'] },
    { name: '💫 💫 Dizzy', cat: 'deco', wrap: ['💫', '💫'] },
    { name: '⭐ ⭐ Star', cat: 'deco', wrap: ['⭐', '⭐'] },
    { name: '🌟 🌟 Glow', cat: 'deco', wrap: ['🌟', '🌟'] },
    // Hearts
    { name: '♡ ♡ Heart', cat: 'deco', wrap: ['♡', '♡'] },
    { name: '♥ ♥ Bold Heart', cat: 'deco', wrap: ['♥', '♥'] },
    { name: '❤ ❤ Red Heart', cat: 'deco', wrap: ['❤', '❤'] },
    { name: '💕 💕 Two Hearts', cat: 'deco', wrap: ['💕', '💕'] },
    { name: '💗 💗 Pink Heart', cat: 'deco', wrap: ['💗', '💗'] },
    { name: '💖 💖 Sparkling', cat: 'deco', wrap: ['💖', '💖'] },
    // Flowers / nature
    { name: '❀ ❀ Flower', cat: 'deco', wrap: ['❀', '❀'] },
    { name: '✿ ✿ Flower Alt', cat: 'deco', wrap: ['✿', '✿'] },
    { name: '🌸 🌸 Cherry', cat: 'deco', wrap: ['🌸', '🌸'] },
    { name: '🌷 🌷 Tulip', cat: 'deco', wrap: ['🌷', '🌷'] },
    { name: '🍀 🍀 Clover', cat: 'deco', wrap: ['🍀', '🍀'] },
    { name: '🌿 🌿 Leaf', cat: 'deco', wrap: ['🌿', '🌿'] },
    // Moon / cosmic
    { name: '🌙 🌙 Moon', cat: 'deco', wrap: ['🌙', '🌙'] },
    { name: '🌙✨ ✨🌙 Lunar', cat: 'deco', wrap: ['🌙✨', '✨🌙'] },
    { name: '⭐🌙 🌙⭐ Night', cat: 'deco', wrap: ['⭐🌙', '🌙⭐'] },
    { name: '◈ ◈ Diamond', cat: 'deco', wrap: ['◈', '◈'] },
    { name: '◆ ◆ Filled Diamond', cat: 'deco', wrap: ['◆', '◆'] },
    { name: '◇ ◇ Open Diamond', cat: 'deco', wrap: ['◇', '◇'] },
    { name: '• • Bullet', cat: 'deco', wrap: ['•', '•'] },
    { name: '· · Middle Dot', cat: 'deco', wrap: ['·', '·'] },
    // Aesthetic floats
    { name: '₊˚ ˚₊ Aesthetic', cat: 'deco', wrap: ['₊˚', '˚₊'] },
    { name: '·˚ ˚· Soft', cat: 'deco', wrap: ['·˚', '˚·'] },
    { name: '✦·˚ ˚·✦', cat: 'deco', wrap: ['✦·˚', '˚·✦'] },
    { name: '˚₊· ·₊˚ Float', cat: 'deco', wrap: ['˚₊·', '·₊˚'] },
    { name: '•*¨*• Vintage', cat: 'deco', wrap: ['•*¨*•', '•*¨*•'] },
    // Lines
    { name: '─── ─── Line', cat: 'deco', wrap: ['───', '───'] },
    { name: '━━━ ━━━ Thick', cat: 'deco', wrap: ['━━━', '━━━'] },
    { name: '•·• Line Dot', cat: 'deco', wrap: ['•·•', '•·•'] },
    { name: '≋≋ ≋≋ Wave', cat: 'deco', wrap: ['≋≋', '≋≋'] },
    { name: '~~ ~~ Tilde', cat: 'deco', wrap: ['~~', '~~'] },
    { name: '« » Guillemet', cat: 'deco', wrap: ['«', '»'] },
    { name: '» « Reverse', cat: 'deco', wrap: ['»', '«'] },
    { name: '→ ← Arrow', cat: 'deco', wrap: ['→', '←'] },
    { name: '⇒ ⇐ Double Arrow', cat: 'deco', wrap: ['⇒', '⇐'] },
    // Crown / royalty
    { name: '👑 👑 Crown', cat: 'deco', wrap: ['👑', '👑'] },
    { name: '♛ ♛ Chess Queen', cat: 'deco', wrap: ['♛', '♛'] },
    { name: '♔ ♔ Chess King', cat: 'deco', wrap: ['♔', '♔'] },
    // Emo / dark
    { name: '🖤 🖤 Dark Heart', cat: 'deco', wrap: ['🖤', '🖤'] },
    { name: '☠ ☠ Skull', cat: 'deco', wrap: ['☠', '☠'] },
    { name: '⛓ ⛓ Chain', cat: 'deco', wrap: ['⛓', '⛓'] },
    { name: '🥀 🥀 Dead Rose', cat: 'deco', wrap: ['🥀', '🥀'] },
    { name: '†  † Cross', cat: 'deco', wrap: ['†', '†'] },
    { name: '🌑 🌑 Dark Moon', cat: 'deco', wrap: ['🌑', '🌑'] },
    // Cute animals
    { name: '🐾 🐾 Paws', cat: 'deco', wrap: ['🐾', '🐾'] },
    { name: '🦋 🦋 Butterfly', cat: 'deco', wrap: ['🦋', '🦋'] },
    { name: '🐱 🐱 Cat', cat: 'deco', wrap: ['🐱', '🐱'] },
    // Aesthetic combo text
    { name: 'itsXname Style', cat: 'deco', wrap: ['its', ''] },
    { name: 'xName Style', cat: 'deco', wrap: ['x', 'x'] },
    { name: '_name_ Undercore', cat: 'deco', wrap: ['_', '_'] },
    { name: '.name. Dots', cat: 'deco', wrap: ['.', '.'] },
    { name: '-name- Dash', cat: 'deco', wrap: ['-', '-'] },
    { name: 'oName Style', cat: 'deco', wrap: ['o', ''] },
];

// ---- COMBINED FONT + DECO STYLES ----
const COMBO_STYLES = [
    { name: '꧁𝓝𝓪𝓶𝓮꧂ Cursive Border', cat: 'deco', convert: t => `꧁${convertMap(t, MAPS.cursiveBold, MAPS_UP.cursiveBold)}꧂` },
    { name: '【𝕯𝖆𝖗𝖐】Gothic Border', cat: 'gothic', convert: t => `【${convertMap(t, MAPS.gothicBold, MAPS_UP.gothicBold)}】` },
    { name: '✦𝓝𝓪𝓶𝓮✦ Script Star', cat: 'aesthetic', convert: t => `✦${convertMap(t, MAPS.cursiveBold, MAPS_UP.cursiveBold)}✦` },
    { name: '★ⓝⓐⓜⓔ★ Bubble Star', cat: 'cute', convert: t => `★${convertMap(t, MAPS.bubble, MAPS_UP.bubble)}★` },
    { name: '♡𝑵𝒂𝒎𝒆♡ Italic Heart', cat: 'aesthetic', convert: t => `♡${convertMap(t, MAPS.boldItalic, MAPS_UP.boldItalic)}♡` },
    { name: '🌸𝓝𝓪𝓶𝓮🌸 Cherry Script', cat: 'cute', convert: t => `🌸${convertMap(t, MAPS.cursiveBold, MAPS_UP.cursiveBold)}🌸` },
    { name: '🌙𝔫𝔞𝔪𝔢🌙 Gothic Moon', cat: 'gothic', convert: t => `🌙${convertMap(t, MAPS.fraktur, MAPS_UP.fraktur)}🌙` },
    { name: '₊˚𝒩𝒶𝓂𝑒˚₊ Float Script', cat: 'aesthetic', convert: t => `₊˚${convertMap(t, MAPS.script, MAPS_UP.script)}˚₊` },
    { name: '«𝗡𝗮𝗺𝗲» Sans Bold', cat: 'aesthetic', convert: t => `«${convertMap(t, MAPS.sansBold, MAPS_UP.sansBold)}»` },
    { name: '↬𝙉𝙖𝙢𝙚↫ Slant', cat: 'fun', convert: t => `↬${convertMap(t, MAPS.sansBoldItalic, MAPS_UP.sansBoldItalic)}↫` },
    { name: '꒰𝑵𝒂𝒎𝒆꒱ Italic Kawaii', cat: 'cute', convert: t => `꒰${convertMap(t, MAPS.boldItalic, MAPS_UP.boldItalic)}꒱` },
    { name: '🖤𝕹𝖆𝖒𝖊🖤 Dark Gothic', cat: 'gothic', convert: t => `🖤${convertMap(t, MAPS.gothicBold, MAPS_UP.gothicBold)}🖤` },
    { name: '❤𝐍𝐚𝐦𝐞❤ Bold Heart', cat: 'cute', convert: t => `❤${convertMap(t, MAPS.bold, MAPS_UP.bold)}❤` },
    { name: '✧˚𝓝𝓪𝓶𝓮˚✧ Glow', cat: 'aesthetic', convert: t => `✧˚${convertMap(t, MAPS.cursiveBold, MAPS_UP.cursiveBold)}˚✧` },
    { name: '【𝔑𝔞𝔪𝔢】Fraktur Box', cat: 'gothic', convert: t => `【${convertMap(t, MAPS.fraktur, MAPS_UP.fraktur)}】` },
    { name: '🌟𝙉𝙖𝙢𝙚🌟 Glow Italic', cat: 'aesthetic', convert: t => `🌟${convertMap(t, MAPS.sansBoldItalic, MAPS_UP.sansBoldItalic)}🌟` },
    { name: '♛𝐍𝐚𝐦𝐞♛ Royal Bold', cat: 'deco', convert: t => `♛${convertMap(t, MAPS.bold, MAPS_UP.bold)}♛` },
    { name: '꧁★𝓝𝓪𝓶𝓮★꧂ Ultimate', cat: 'deco', convert: t => `꧁★${convertMap(t, MAPS.cursiveBold, MAPS_UP.cursiveBold)}★꧂` },
    { name: '⛓𝕹𝖆𝖒𝖊⛓ Chain Gothic', cat: 'gothic', convert: t => `⛓${convertMap(t, MAPS.gothicBold, MAPS_UP.gothicBold)}⛓` },
    { name: '🦋𝒩𝒶𝓂𝑒🦋 Script Butterfly', cat: 'cute', convert: t => `🦋${convertMap(t, MAPS.script, MAPS_UP.script)}🦋` },
    { name: '·˚ⓝⓐⓜⓔ˚· Bubble Float', cat: 'cute', convert: t => `·˚${convertMap(t, MAPS.bubble, MAPS_UP.bubble)}˚·` },
    { name: '◈𝙣𝙖𝙢𝙚◈ Diamond Italic', cat: 'fun', convert: t => `◈${convertMap(t, MAPS.sansItalic, MAPS_UP.sansItalic)}◈` },
    { name: '─━𝗡𝗮𝗺𝗲━─ Sans Line', cat: 'aesthetic', convert: t => `─━${convertMap(t, MAPS.sansBold, MAPS_UP.sansBold)}━─` },
    { name: '🌑𝔫𝔞𝔪𝔢🌑 Dark Moon Frak', cat: 'gothic', convert: t => `🌑${convertMap(t, MAPS.fraktur, MAPS_UP.fraktur)}🌑` },
    { name: '✦·˚𝓝𝓪𝓶𝓮˚·✦ Sparkle', cat: 'aesthetic', convert: t => `✦·˚${convertMap(t, MAPS.cursiveBold, MAPS_UP.cursiveBold)}˚·✦` },
    { name: '🌸❤𝒩𝒶𝓂𝑒❤🌸 Cherry Heart', cat: 'cute', convert: t => `🌸❤${convertMap(t, MAPS.script, MAPS_UP.script)}❤🌸` },
    { name: '《𝓝𝓪𝓶𝓮》Angle Script', cat: 'aesthetic', convert: t => `《${convertMap(t, MAPS.cursiveBold, MAPS_UP.cursiveBold)}》` },
    { name: '†𝕬𝖓𝖌𝖊𝖑† Gothic Cross', cat: 'gothic', convert: t => `†${convertMap(t, MAPS.gothicBold, MAPS_UP.gothicBold)}†` },
    { name: '꒰🌙𝒩𝒶𝓂𝑒🌙꒱ Kawaii Moon', cat: 'cute', convert: t => `꒰🌙${convertMap(t, MAPS.script, MAPS_UP.script)}🌙꒱` },
    { name: '「𝔫𝔞𝔪𝔢」Fraktur Corner', cat: 'gothic', convert: t => `「${convertMap(t, MAPS.fraktur, MAPS_UP.fraktur)}」` },
    { name: '❝𝓝𝓪𝓶𝓮❞ Cursive Quote', cat: 'aesthetic', convert: t => `❝${convertMap(t, MAPS.cursiveBold, MAPS_UP.cursiveBold)}❞` },
];

// Build ALL styles array
let ALL_STYLES = [];
FONT_STYLES.forEach(s => ALL_STYLES.push({ ...s, type: 'font' }));
DECO_STYLES.forEach(s => ALL_STYLES.push({ ...s, type: 'deco' }));
COMBO_STYLES.forEach(s => ALL_STYLES.push({ ...s, type: 'combo' }));

// ---- STATE ----
let currentText = '';
let currentCat = 'all';
let visibleCount = 10;
const BATCH_SIZE = 10;

// ---- RENDER ----
function renderCards(text) {
    const grid = document.getElementById('fontgen-grid');
    if (!grid) return;
    const display = text.trim() || '';
    const filtered = currentCat === 'all' ? ALL_STYLES : ALL_STYLES.filter(s => s.cat === currentCat);
    const showing = filtered.slice(0, visibleCount);

    document.getElementById('fontgen-count').textContent = `${filtered.length} styles`;

    if (!display) {
        grid.innerHTML = `<div class="fontgen-empty"><span class="fontgen-empty-icon">✍️</span>Type something above to preview all font styles!</div>`;
        updateShowMore(filtered.length);
        return;
    }

    grid.innerHTML = showing.map((style, i) => {
        let converted = '';
        try {
            if (style.type === 'font') {
                converted = style.convert(display);
            } else if (style.type === 'deco') {
                converted = style.wrap[0] + display + style.wrap[1];
            } else {
                converted = style.convert(display);
            }
        } catch (e) { converted = display; }

        return `<div class="font-card" data-index="${i}">
      <span class="font-card-label">${style.name}</span>
      <div class="font-card-text">${converted}</div>
      <button class="font-card-copy" onclick="copyFont(this, '${encodeURIComponent(converted)}')" data-val="${encodeURIComponent(converted)}">Copy</button>
    </div>`;
    }).join('');

    updateShowMore(filtered.length);
}

function updateShowMore(total) {
    const btn = document.getElementById('fontgen-showmore');
    if (!btn) return;
    if (visibleCount >= total || !currentText.trim()) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'inline-flex';
        btn.textContent = 'Show More';
    }
}

function showMore() {
    visibleCount += BATCH_SIZE;
    renderCards(currentText);
}

// ---- COPY ----
function copyFont(btn, encoded) {
    const text = decodeURIComponent(encoded);
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
        }, 1800);
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
    });
}

// ---- CONVERT ----
function convertFonts() {
    const input = document.getElementById('fontgen-input');
    if (!input) return;
    currentText = input.value;
    renderCards(currentText);
}

// ---- CLEAR ----
function clearInput() {
    const input = document.getElementById('fontgen-input');
    if (input) { input.value = ''; input.focus(); }
    currentText = '';
    renderCards('');
}

// ---- FILTER ----
function setCategory(cat) {
    currentCat = cat;
    visibleCount = BATCH_SIZE;
    document.querySelectorAll('.fontgen-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.cat === cat);
    });
    renderCards(currentText);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('fontgen-input');
    if (input) {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') convertFonts();
        });
    }
    renderCards('');
});