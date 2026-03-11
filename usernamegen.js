/* ═══════════════════════════════════════════
   BioBlox - Roblox Username Generator Engine
   ═══════════════════════════════════════════ */

// ── Name databases ──
const NAME_PARTS = {
    boy: {
        short: ['Ace', 'Rex', 'Kai', 'Leo', 'Zak', 'Max', 'Jay', 'Fox', 'Ash', 'Axe', 'Jax', 'Vin', 'Dex', 'Rye', 'Kit', 'Nox', 'Blaze', 'Storm', 'Edge', 'Hex', 'Raze', 'Nash', 'Dax', 'Flint', 'Knox'],
        medium: ['Shadow', 'Hunter', 'Blaze', 'Phoenix', 'Dante', 'Cipher', 'Reaper', 'Striker', 'Vortex', 'Titan', 'Ryker', 'Falcon', 'Gunner', 'Diesel', 'Maverick', 'Bandit', 'Cobalt', 'Drift', 'Onyx', 'Raptor', 'Caden', 'Lancer', 'Stealth', 'Griffin', 'Saber'],
        long: ['Darknight', 'Shadowstrike', 'Thunderbolt', 'Nighthawk', 'Stormrider', 'Ironwolf', 'Blazemaster', 'Frostbite', 'Deathraze', 'Voidwalker', 'Ghostrider', 'Steelclaw', 'Nightshade', 'Dragonfire', 'Bloodhound', 'Starbreaker', 'Icebreaker', 'Skullking', 'Firestorm', 'Warbringer']
    },
    girl: {
        short: ['Mia', 'Zoe', 'Ava', 'Ivy', 'Kia', 'Lia', 'Nia', 'Bea', 'Sky', 'Fay', 'Gem', 'Joy', 'Rue', 'Eve', 'Lux', 'Nyx', 'Luna', 'Rose', 'Lily', 'Aria', 'Sage', 'Fern', 'Jade', 'Nova', 'Wren'],
        medium: ['Sakura', 'Aurora', 'Melody', 'Violet', 'Seline', 'Crystal', 'Blossom', 'Starlet', 'Celeste', 'Willow', 'Harmony', 'Scarlet', 'Serenity', 'Jasmine', 'Mystique', 'Dreamer', 'Sparkle', 'Moonlit', 'Rosegold', 'Sunbeam', 'Velvet', 'Poppy', 'Raven', 'Clover', 'Dahlia'],
        long: ['Moonlight', 'Stardancer', 'Butterflyx', 'Sunshinegirl', 'Crystalheart', 'Blossomqueen', 'Nightbloom', 'Galaxygirl', 'Dreamweaver', 'Enchantress', 'Starshine', 'Moonpetal', 'Celestialrose', 'Diamondglow', 'Roseprincess', 'Angeldust', 'Silkystorm', 'Fairydust', 'Midnightrose', 'Lavendersky']
    },
    neutral: {
        short: ['Zyn', 'Nox', 'Pix', 'Ori', 'Zen', 'Ari', 'Sol', 'Rio', 'Lex', 'Woe', 'Haze', 'Riot', 'Void', 'Echo', 'Loot', 'Byte', 'Glitch', 'Ember', 'Frost', 'Flux', 'Rune', 'Sage', 'Ghost', 'Warp', 'Neon'],
        medium: ['Cosmic', 'Zenith', 'Cipher', 'Nebula', 'Vertex', 'Prism', 'Phantom', 'Enigma', 'Pyrite', 'Quartz', 'Obsidian', 'Tempest', 'Eclipse', 'Voltage', 'Crimson', 'Paradox', 'Solstice', 'Stellar', 'Mirage', 'Catalyst', 'Fusion', 'Radiant', 'Mystic', 'Aether', 'Plasma'],
        long: ['Starchaser', 'Voidrunner', 'Neonpulse', 'Pixeldrift', 'Stormcloud', 'Dreamcatcher', 'Mindbreaker', 'Shadowmeld', 'Skywalker', 'Ghostflame', 'Starweaver', 'Darkphoton', 'Nightflicker', 'Cosmicblaze', 'Thunderclap', 'Cyberflux', 'Galacticorb', 'Eclipseray', 'Quantumleap', 'Lightrunner']
    }
};

const STYLE_TWEAKS = {
    aesthetic: ['cloud', 'dream', 'petal', 'blossom', 'moon', 'star', 'silk', 'mist', 'dawn', 'glow', 'haze', 'velvet', 'dew', 'flora', 'bloom', 'pearl', 'whisper', 'lush', 'willow', 'serene'],
    cool: ['blaze', 'storm', 'king', 'prime', 'elite', 'alpha', 'chief', 'boss', 'legend', 'ace', 'pro', 'clutch', 'goat', 'fierce', 'savage', 'supreme', 'slick', 'titan', 'apex', 'beast'],
    funny: ['noob', 'yeet', 'bruh', 'lol', 'dank', 'meme', 'sus', 'vibe', 'slay', 'oops', 'beans', 'taco', 'waffle', 'snack', 'noodle', 'pickle', 'banana', 'cheese', 'toast', 'nugget'],
    gamer: ['snipe', 'frag', 'pwn', 'gg', 'raid', 'loot', 'grind', 'clutch', 'spawn', 'rank', 'tryhard', 'bot', 'lag', 'rush', 'camp', 'nerf', 'buff', 'crit', 'respawn', 'combo'],
    edgy: ['dark', 'void', 'reaper', 'skull', 'blade', 'phantom', 'shadow', 'death', 'raven', 'night', 'grim', 'crypt', 'thorn', 'venom', 'wrath', 'doom', 'chaos', 'scar', 'fang', 'hex'],
    og: ['real', 'og', 'classic', 'old', 'rare', 'legend', 'vintage', 'retro', 'vet', 'day1', 'true', 'pure', 'raw', 'epic', 'mythic', 'ancient', 'original', 'golden', 'prime', 'first'],
    cute: ['bunny', 'kitty', 'puppy', 'honey', 'sugar', 'angel', 'peach', 'cherry', 'berry', 'cookie', 'cupcake', 'mochi', 'panda', 'teddy', 'sparkle', 'twinkle', 'boba', 'candy', 'pixie', 'fairy'],
    dark: ['abyss', 'obsidian', 'midnight', 'onyx', 'shade', 'wraith', 'specter', 'gloom', 'inferno', 'viper', 'abyss', 'eclipse', 'dusk', 'cinder', 'ash', 'noir', 'smoke', 'umbra', 'rust', 'ruin'],
    neutral: ['zen', 'flux', 'pulse', 'orbit', 'prism', 'wave', 'spark', 'drift', 'echo', 'shift', 'core', 'nova', 'link', 'sync', 'vibe', 'chill', 'breeze', 'flow', 'static', 'pixel']
};

const PREFIXES_BUILTIN = ['x', 'its', 'the', 'real', 'im', 'not', 'just', 'only', 'lil', 'big', 'that', 'yo', 'mr', 'ms', 'da'];
const SUFFIXES_BUILTIN = ['x', 'z', 'ii', 'yt', 'tv', 'fn', 'ttv', 'gg', 'xo', 'xx', 'rblx', 'hd', 'vip', 'god', 'jr'];

// ── Utility ──
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function randNum() { const styles = [() => Math.floor(Math.random() * 100), () => Math.floor(Math.random() * 10), () => Math.floor(Math.random() * 999 + 1), () => Math.floor(Math.random() * 9 + 1) + '' + Math.floor(Math.random() * 9 + 1)]; return styles[Math.floor(Math.random() * styles.length)](); }

// ── State ──
let selectedStyle = null;
let selectedGender = null;
let selectedLength = null;
let numbersOn = false;
let selectedPrefixes = [];
let selectedSuffixes = [];

// ── UI Handlers ──
function pickStyle(btn) {
    document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
    if (selectedStyle === btn.dataset.style) {
        selectedStyle = null;
    } else {
        btn.classList.add('active');
        selectedStyle = btn.dataset.style;
    }
}

function pickGender(btn) {
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
    if (selectedGender === btn.dataset.gender) {
        selectedGender = null;
    } else {
        btn.classList.add('active');
        selectedGender = btn.dataset.gender;
    }
}

function pickULength(btn) {
    document.querySelectorAll('.ulength-btn').forEach(b => b.classList.remove('active'));
    if (selectedLength === btn.dataset.ulength) {
        selectedLength = null;
    } else {
        btn.classList.add('active');
        selectedLength = btn.dataset.ulength;
    }
}

function toggleNumbers(btn) {
    numbersOn = !numbersOn;
    btn.classList.toggle('active', numbersOn);
    btn.querySelector('.toggle-label').textContent = numbersOn ? 'Numbers On' : 'No Numbers';
}

function togglePrefix(btn) {
    const val = btn.dataset.prefix;
    btn.classList.toggle('active');
    if (selectedPrefixes.includes(val)) {
        selectedPrefixes = selectedPrefixes.filter(p => p !== val);
    } else {
        selectedPrefixes.push(val);
    }
}

function toggleSuffix(btn) {
    const val = btn.dataset.suffix;
    btn.classList.toggle('active');
    if (selectedSuffixes.includes(val)) {
        selectedSuffixes = selectedSuffixes.filter(s => s !== val);
    } else {
        selectedSuffixes.push(val);
    }
}

// ── Core Generation ──
function generateOneUsername() {
    // Pick gender pool
    const genders = selectedGender ? [selectedGender] : ['boy', 'girl', 'neutral'];
    const gender = pick(genders);

    // Pick length pool
    const lengths = selectedLength ? [selectedLength] : ['short', 'medium', 'long'];
    const length = pick(lengths);

    // Get base name
    let base = pick(NAME_PARTS[gender][length]);

    // Mix in style words sometimes
    if (selectedStyle && Math.random() > 0.3) {
        const styleWord = pick(STYLE_TWEAKS[selectedStyle]);
        const patterns = [
            () => styleWord + cap(base),
            () => base + cap(styleWord),
            () => styleWord + base,
            () => cap(styleWord) + cap(base),
        ];
        base = pick(patterns)();
    } else if (!selectedStyle && Math.random() > 0.6) {
        const randomStyleKey = pick(Object.keys(STYLE_TWEAKS));
        const styleWord = pick(STYLE_TWEAKS[randomStyleKey]);
        if (Math.random() > 0.5) {
            base = styleWord + cap(base);
        } else {
            base = base + cap(styleWord);
        }
    }

    // Custom word from input
    const customWord = document.getElementById('inp-custom-word').value.trim();
    if (customWord) {
        const insertPatterns = [
            () => customWord + cap(base),
            () => base + cap(customWord),
            () => cap(customWord) + cap(base),
            () => base + customWord,
        ];
        base = pick(insertPatterns)();
    }

    // Prefix
    let prefix = '';
    if (selectedPrefixes.length > 0) {
        prefix = pick(selectedPrefixes);
    }

    // Suffix
    let suffix = '';
    if (selectedSuffixes.length > 0 && Math.random() > 0.4) {
        suffix = pick(selectedSuffixes);
    }

    // Assemble
    let username = '';
    if (prefix) {
        username = prefix + cap(base);
    } else {
        username = base;
    }
    if (suffix) {
        username = username + suffix;
    }

    // Numbers
    if (numbersOn && Math.random() > 0.3) {
        username = username + randNum();
    }

    // Enforce Roblox username rules: 3-20 chars, only letters/numbers/_
    username = username.replace(/[^a-zA-Z0-9_x]/g, '');
    if (username.length > 20) username = username.substring(0, 20);
    if (username.length < 3) username = username + pick(['Pro', 'GG', 'YT', 'XD']);

    return username;
}

function generateUsernames() {
    const count = 56; // 7 cols x 8 rows
    const grid = document.getElementById('username-grid');
    const section = document.getElementById('results-section');

    // Generate unique usernames
    const usernamesSet = new Set();
    let attempts = 0;
    while (usernamesSet.size < count && attempts < 500) {
        usernamesSet.add(generateOneUsername());
        attempts++;
    }
    const usernames = Array.from(usernamesSet);

    // Build grid HTML
    grid.innerHTML = usernames.map(u => `
        <div class="uname-card">
            <span class="uname-text">${u}</span>
            <button class="uname-copy-btn" onclick="copyUsername(this, '${u.replace(/'/g, "\\'")}')" title="Copy username">📋</button>
        </div>
    `).join('');

    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copyUsername(btn, text) {
    navigator.clipboard.writeText(text).then(function () {
        btn.textContent = '✅';
        btn.classList.add('copied');
        setTimeout(function () {
            btn.textContent = '📋';
            btn.classList.remove('copied');
        }, 2000);
    });
}



