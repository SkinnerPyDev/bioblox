const WORKER_URL = 'https://robox.skinnerdev.workers.dev/';

// --- Utility Functions ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function calculateTier(ageInYears, flexScore) {
    if (flexScore > 85 || ageInYears > 10) return { name: '<span class="tier-icon">👑</span> MYTHIC', class: 'mythic' };
    if (flexScore > 60 || ageInYears > 5) return { name: '<span class="tier-icon">⭐</span> LEGENDARY', class: 'legendary' };
    if (flexScore > 30 || ageInYears > 2) return { name: '<span class="tier-icon">💎</span> RARE', class: 'rare' };
    return { name: '<span class="tier-icon">🟢</span> COMMON', class: '' };
}

// Convert flex score (0-99) to full star display (1-5 stars)
function flexToStars(score) {
    let count;
    if (score >= 80) count = 5;
    else if (score >= 65) count = 4;
    else if (score >= 45) count = 3;
    else if (score >= 25) count = 2;
    else count = 1;
    return '★'.repeat(count) + '☆'.repeat(5 - count);
}

// Consistent per-user random numbers
function seededRandom(seedStr) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
        hash |= 0;
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
}

// --- Theme Management ---
function setTheme(element) {
    // Remove active state
    document.querySelectorAll('.theme-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    // Get selected theme
    const themeName = element.getAttribute('data-theme');

    // Apply to flex card
    const card = document.getElementById('flex-card');
    card.className = 'flex-card'; // Reset
    card.classList.add('theme-' + themeName);
}

// --- API Fetching via Worker ---
async function fetchRobloxData(username) {
    try {
        // 1. Resolve Username to User ID
        const searchRes = await fetch(`${WORKER_URL}proxy?url=${encodeURIComponent('https://users.roblox.com/v1/users/search?keyword=' + username + '&limit=10')}`);
        const searchData = await searchRes.json();
        const userMatch = searchData.data?.find(u => u.name.toLowerCase() === username.toLowerCase());

        if (!userMatch) {
            throw new Error("User not found!");
        }

        const userId = userMatch.id;

        // 2. Fetch User Profile Info (Join Date)
        const profileRes = await fetch(`${WORKER_URL}proxy?url=${encodeURIComponent('https://users.roblox.com/v1/users/' + userId)}`);
        const profileData = await profileRes.json();

        // 3. Fetch Followers Count
        let followersCount = 0;
        try {
            const followersRes = await fetch(`${WORKER_URL}proxy?url=${encodeURIComponent('https://friends.roblox.com/v1/users/' + userId + '/followers/count')}`);
            const followersData = await followersRes.json();
            followersCount = followersData.count || 0;
        } catch (e) { console.warn("Could not fetch followers count", e); }

        // 4. Fetch Friends Count
        let friendsCount = 0;
        try {
            const friendsRes = await fetch(`${WORKER_URL}proxy?url=${encodeURIComponent('https://friends.roblox.com/v1/users/' + userId + '/friends/count')}`);
            const friendsData = await friendsRes.json();
            friendsCount = friendsData.count || 0;
        } catch (e) { console.warn("Could not fetch friends count", e); }

        // 5. Fetch 3D Avatar Image
        let avatarUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3C/svg%3E";
        try {
            const avatarRes = await fetch(`${WORKER_URL}proxy?url=${encodeURIComponent('https://thumbnails.roblox.com/v1/users/avatar?userIds=' + userId + '&size=352x352&format=Png&isCircular=false')}`);
            const avatarData = await avatarRes.json();
            if (avatarData.data && avatarData.data[0].state === 'Completed') {
                avatarUrl = avatarData.data[0].imageUrl;
            }
        } catch (e) { console.warn("Could not fetch avatar", e); }

        return {
            userId: userId,
            displayName: profileData.displayName || profileData.name,
            username: profileData.name,
            joinDate: new Date(profileData.created),
            followersCount: followersCount,
            friendsCount: friendsCount,
            avatarUrl: avatarUrl
        };

    } catch (error) {
        console.error("Roblox API Error:", error);
        throw error;
    }
}

// --- Card Generation Logic ---
async function generateFlexCard() {
    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value.trim();
    const errorMsg = document.getElementById('error-msg');
    const overlay = document.getElementById('loading-overlay');

    if (!username) {
        errorMsg.textContent = "Please enter a username!";
        errorMsg.style.display = 'block';
        return;
    }

    errorMsg.style.display = 'none';
    overlay.classList.add('active');

    try {
        const data = await fetchRobloxData(username);

        const ageInYears = (new Date() - data.joinDate) / (1000 * 60 * 60 * 24 * 365.25);
        const randBase = seededRandom(data.username);

        // --- FLEX SCORE (based on REAL data, log-scaled for fair distribution) ---
        // Account Age: 0-30 pts (log scale)
        const agePts = Math.min(30, Math.floor(Math.log2(ageInYears + 1) * 7));

        // Followers: 0-35 pts (log scale — millions of followers = max)
        const followerPts = Math.min(35, Math.floor(Math.log10(data.followersCount + 1) * 4.5));

        // Friends: 0-20 pts (log scale)
        const friendPts = Math.min(20, Math.floor(Math.log10(data.friendsCount + 1) * 8.5));

        // Small random variance: 0-15 pts
        const randomPts = Math.floor(randBase * 15);

        // Total: cap at 99
        let flexScore = Math.min(99, agePts + followerPts + friendPts + randomPts);

        // Age-based minimum floor (badges should match stars)
        if (ageInYears >= 10 && flexScore < 80) flexScore = 80 + Math.floor(randBase * 5);
        else if (ageInYears >= 5 && flexScore < 65) flexScore = 65 + Math.floor(randBase * 5);
        else if (ageInYears >= 2 && flexScore < 45) flexScore = 45 + Math.floor(randBase * 5);
        else if (ageInYears >= 1 && flexScore < 25) flexScore = 25 + Math.floor(randBase * 5);
        if (flexScore < 10) flexScore = 10;

        // Drip Level: derived from flex score + age for big impressive number
        let dripLevel = Math.floor((flexScore * 500) + (ageInYears * 3000) + (data.followersCount * 0.5));

        const tier = calculateTier(ageInYears, flexScore);

        // Populate Top Info
        document.getElementById('card-username').textContent = '@' + data.displayName;
        document.getElementById('card-join-date').innerHTML = `⭐ Member Since ${data.joinDate.getFullYear()}`;
        document.getElementById('card-avatar').src = data.avatarUrl;

        const tierEl = document.getElementById('card-tier');
        tierEl.className = 'tier-chip ' + tier.class;
        if (data.displayName.length > 14) {
            tierEl.classList.add('small-badge');
        }
        tierEl.innerHTML = tier.name;

        // Populate Stats Panel
        const stars = flexToStars(flexScore);
        document.getElementById('stat-value').textContent = stars;
        document.getElementById('stat-items').textContent = '💧 ' + formatNumber(Math.floor(dripLevel));
        document.getElementById('stat-friends').textContent = '👥 ' + formatNumber(data.followersCount);

        // --- FUN ACHIEVEMENT TITLES (per-user consistent, always unique) ---
        const achievementPool = [
            'Certified Drip 💧', 'Built Different 🔥', 'Main Character ✨', 'Boss Mode 👑',
            'Unstoppable ⚡', 'Vibe Master 🎶', 'Legendary Aura ⭐', 'Diamond Hands 💎',
            'Style Icon 💅', 'Shadow Lord 🌙', 'Clout King 📸', 'Pixel King 🎮',
            'Ice Cold ❄️', 'Elite Gamer 🏆', 'Drip God 💧', 'Power Player 💪',
            'Fan Favorite ❤️', 'Smooth Operator 🕺', 'Night Owl 🦉', 'Rising Star 🌟',
            'Alpha Wolf 🐺', 'Speed Demon 🏎️', 'Big Brain 🧠', 'Golden Child 🏅',
            'Crowd Favorite 🎉', 'Top Tier 🔝', 'Pure Fire 🔥', 'Chill Vibes 🌊'
        ];

        // Pick 3 unique achievements
        const pool = [...achievementPool];
        const picked = [];
        for (let p = 0; p < 3; p++) {
            const idx = Math.floor(seededRandom(data.username + 'ach' + p) * pool.length);
            picked.push(pool[idx]);
            pool.splice(idx, 1);
        }

        document.getElementById('item-1').textContent = picked[0];
        document.getElementById('item-2').textContent = picked[1];
        document.getElementById('item-3').textContent = picked[2];

        // --- MINI BADGES (mix of real + fun) ---
        const badgesContainer = document.getElementById('mini-badges');
        badgesContainer.innerHTML = '';

        // Real: based on actual account age
        if (ageInYears >= 5) {
            badgesContainer.innerHTML += `<div class="badge-pill badge-og">⏰ OG Player</div>`;
        } else if (ageInYears >= 2) {
            badgesContainer.innerHTML += `<div class="badge-pill badge-veteran">🏛️ Veteran</div>`;
        }

        // Fun: based on flex score
        if (flexScore >= 70) {
            badgesContainer.innerHTML += `<div class="badge-pill badge-rich">💎 Elite</div>`;
        } else if (flexScore >= 40) {
            badgesContainer.innerHTML += `<div class="badge-pill badge-rich">🔥 Hot</div>`;
        }

        // Fun: based on drip level
        if (dripLevel >= 50000) {
            badgesContainer.innerHTML += `<div class="badge-pill badge-collector">💧 Drip Lord</div>`;
        }

        // Real: based on followers
        if (data.followersCount >= 1000) {
            badgesContainer.innerHTML += `<div class="badge-pill badge-collector">🌟 Famous</div>`;
        } else if (data.followersCount >= 100) {
            badgesContainer.innerHTML += `<div class="badge-pill badge-collector">🤝 Popular</div>`;
        }

        // Default badge if none earned
        if (badgesContainer.innerHTML === '') {
            badgesContainer.innerHTML = `<div class="badge-pill">⭐ Roblox Player</div>`;
        }

        // Show the card section and scroll to it
        document.getElementById('card-section').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('card-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

    } catch (e) {
        errorMsg.textContent = "Error: Could not find user or fetch data.";
        errorMsg.style.display = 'block';
    } finally {
        overlay.classList.remove('active');
    }
}

// Allow pressing Enter in the input field
document.getElementById('username-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        generateFlexCard();
    }
});

// --- Exporting / Downloading ---
function getCardElement() {
    return document.getElementById('flex-card'); /* Capture exact boundaries to fix html2canvas clipping bugs */
}

const HTML2CANVAS_OPTIONS = {
    backgroundColor: null,
    scale: 2, // High resolution
    useCORS: true, // Required for avatar images from Roblox CDN
    logging: false,
    width: 290, // Force strict canvas width to prevent overflowing child expansion bugs
    height: 560 // Force strict canvas height
};

// --- html2canvas fix: temporarily disable unsupported CSS ---
// backdrop-filter, -webkit-backdrop-filter, and inset box-shadow
// all render as dark artifacts in html2canvas.
function prepareCardForCapture(cardEl) {
    const saved = [];

    // 1. Fix the main card inset box-shadow
    saved.push({ el: cardEl, prop: 'boxShadow', val: cardEl.style.boxShadow });
    cardEl.style.boxShadow = 'none';

    // 2. Fix all elements inside the card that use backdrop-filter
    const allEls = cardEl.querySelectorAll('*');
    allEls.forEach(el => {
        const cs = getComputedStyle(el);

        // Save and remove backdrop-filter (renders as black in html2canvas)
        if (cs.backdropFilter && cs.backdropFilter !== 'none') {
            saved.push({ el, prop: 'backdropFilter', val: el.style.backdropFilter });
            saved.push({ el, prop: 'webkitBackdropFilter', val: el.style.webkitBackdropFilter });
            el.style.backdropFilter = 'none';
            el.style.webkitBackdropFilter = 'none';
        }
    });

    // 3. Frosted Glass Compensation
    // Since html2canvas can't render backdrop-filter blur, we need to simulate
    // the frosted glass effect. Instead of solid black, we use a semi-transparent
    // version of the card's actual theme background blended with a dark overlay.
    // This produces a result visually close to what the browser shows.
    const bottomPanel = cardEl.querySelector('.card-bottom-panel');
    if (bottomPanel) {
        saved.push({ el: bottomPanel, prop: 'background', val: bottomPanel.style.background });

        // Get the card's computed background (theme gradient or solid color)
        const cardBg = getComputedStyle(cardEl).backgroundColor;
        // Parse the RGB values from the computed background
        const rgbMatch = cardBg.match(/(\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            // Darken the theme color and apply at ~0.65 opacity for a frosted look
            const dr = Math.floor(r * 0.35);
            const dg = Math.floor(g * 0.35);
            const db = Math.floor(b * 0.35);
            bottomPanel.style.background = `rgba(${dr}, ${dg}, ${db}, 0.75)`;
        } else {
            // Fallback: use a softer dark overlay (not solid black)
            bottomPanel.style.background = 'rgba(20, 15, 40, 0.65)';
        }
    }

    const tierChip = cardEl.querySelector('.tier-chip');
    if (tierChip) {
        saved.push({ el: tierChip, prop: 'background', val: tierChip.style.background });
        // Use same theme-tinted approach for the tier badge
        const cardBg2 = getComputedStyle(cardEl).backgroundColor;
        const rgbMatch2 = cardBg2.match(/(\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch2) {
            const r2 = parseInt(rgbMatch2[1]);
            const g2 = parseInt(rgbMatch2[2]);
            const b2 = parseInt(rgbMatch2[3]);
            const dr2 = Math.floor(r2 * 0.4);
            const dg2 = Math.floor(g2 * 0.4);
            const db2 = Math.floor(b2 * 0.4);
            tierChip.style.background = `rgba(${dr2}, ${dg2}, ${db2}, 0.6)`;
        } else {
            tierChip.style.background = 'rgba(20, 15, 40, 0.5)';
        }
    }

    return saved;
}

function restoreCardAfterCapture(saved) {
    saved.forEach(({ el, prop, val }) => {
        el.style[prop] = val;
    });
}

function captureCard(cardEl) {
    const saved = prepareCardForCapture(cardEl);

    // Save and reset any CSS transform (mobile scale causes blank space in capture)
    const origTransform = cardEl.style.transform;
    const origTransformOrigin = cardEl.style.transformOrigin;
    cardEl.style.transform = 'none';
    cardEl.style.transformOrigin = 'top left';

    return html2canvas(cardEl, HTML2CANVAS_OPTIONS).then(canvas => {
        // Restore transform
        cardEl.style.transform = origTransform;
        cardEl.style.transformOrigin = origTransformOrigin;
        restoreCardAfterCapture(saved);

        // Crop canvas to exact card dimensions (removes any extra space)
        const cropW = 290 * HTML2CANVAS_OPTIONS.scale;
        const cropH = 560 * HTML2CANVAS_OPTIONS.scale;
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = cropW;
        croppedCanvas.height = cropH;
        const ctx = croppedCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, cropW, cropH, 0, 0, cropW, cropH);
        return croppedCanvas;
    }).catch(err => {
        cardEl.style.transform = origTransform;
        cardEl.style.transformOrigin = origTransformOrigin;
        restoreCardAfterCapture(saved);
        throw err;
    });
}

function downloadCard() {
    const cardEl = getCardElement();
    const btn = document.getElementById('btn-download');
    const originalText = btn.innerHTML;

    btn.innerHTML = '⏳ Generating Image...';
    btn.disabled = true;

    captureCard(cardEl).then(canvas => {
        const link = document.createElement('a');
        link.download = `bioblox-${document.getElementById('card-username').textContent.replace('@', '')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        btn.innerHTML = '✅ Downloaded!';
        showToast('Card downloaded successfully!');

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    }).catch(err => {
        console.error("Canvas Error:", err);
        btn.innerHTML = originalText;
        btn.disabled = false;
        showToast('Failed to generate image. Try again.');
    });
}

function shareCard() {
    const cardEl = getCardElement();
    const btn = document.getElementById('btn-share');
    const originalText = btn.innerHTML;

    btn.innerHTML = '⏳ Copying...';
    btn.disabled = true;

    captureCard(cardEl).then(canvas => {
        canvas.toBlob(blob => {
            try {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(() => {
                    btn.innerHTML = '✅ Copied to Clipboard!';
                    showToast('Image copied! Paste anywhere.');
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }, 2000);
                });
            } catch (err) {
                console.error(err);
                btn.innerHTML = originalText;
                btn.disabled = false;
                showToast('Clipboard API not supported on your browser.');
            }
        });
    });
}

function shareTo(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out my Roblox Flex Card generated on BioBlox! 🔥");

    let shareUrl = '';
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    else if (platform === 'reddit') shareUrl = `https://reddit.com/submit?url=${url}&title=${text}`;
    else {
        showToast('Download the card first to share on ' + platform + '!');
        return;
    }

    window.open(shareUrl, '_blank');
}

