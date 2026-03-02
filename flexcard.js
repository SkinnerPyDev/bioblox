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

function calculateTier(value, ageInYears) {
    if (value > 100000 || ageInYears > 10) return { name: '<span class="tier-icon">👑</span> MYTHIC', class: 'mythic' };
    if (value > 10000 || ageInYears > 5) return { name: '<span class="tier-icon">⭐</span> LEGENDARY', class: 'legendary' };
    if (value > 1000 || ageInYears > 2) return { name: '<span class="tier-icon">💎</span> RARE', class: 'rare' };
    return { name: '<span class="tier-icon">🟢</span> COMMON', class: '' };
}

// Generate deterministic random numbers based on username string (for private inventory simulation)
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

        // 4. Fetch 3D Avatar Image
        let avatarUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3C/svg%3E";
        try {
            // Using body shot for the flex card style
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

        // Calculate dynamic/simulated values since actual inventory values are private
        const ageInYears = (new Date() - data.joinDate) / (1000 * 60 * 60 * 24 * 365.25);

        // Deterministic simulation based on username
        const randBase = seededRandom(data.username);

        // Stats Simulation - kept reasonable so tiers distribute properly
        let projectedValue = Math.floor(randBase * 80000) + (ageInYears * 5000);
        let projectedItems = Math.floor(seededRandom(data.username + "items") * 1500) + 50;

        // If they are brand new, nerfed stats
        if (ageInYears < 0.2) {
            projectedValue = Math.floor(projectedValue * 0.05);
            projectedItems = Math.floor(projectedItems * 0.1);
        }

        const tier = calculateTier(projectedValue, ageInYears);

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
        document.getElementById('stat-value').textContent = '💰 ' + formatNumber(Math.floor(projectedValue));
        document.getElementById('stat-items').textContent = '🎒 ' + formatNumber(projectedItems);
        document.getElementById('stat-friends').textContent = '👥 ' + formatNumber(data.followersCount);

        // Simulated Rarest Items Pool
        const rareItemsPool = [
            "Dominus Infernus", "Valkyrie Helm", "Sparkle Time Fedora", "Korblox Deathspeaker",
            "Headless Horseman", "Classic Fedora", "Clockwork's Headphones", "Super Super Happy Face",
            "Redvalk", "Ice Valkyrie", "Dominus Rex", "Dominus Aureus", "Workclock Headphones",
            "Playful Vampire", "Prankster", "Neon Green Beautiful Hair", "Silver King of the Night"
        ];

        // Pick 3 deterministic rare items
        const item1 = rareItemsPool[Math.floor(seededRandom(data.username + "1") * rareItemsPool.length)];
        const item2 = rareItemsPool[Math.floor(seededRandom(data.username + "2") * rareItemsPool.length)];
        const item3 = rareItemsPool[Math.floor(seededRandom(data.username + "3") * rareItemsPool.length)];

        document.getElementById('item-1').textContent = item1;
        document.getElementById('item-2').textContent = item2;
        document.getElementById('item-3').textContent = item3;

        // Populate Mini Badges
        const badgesContainer = document.getElementById('mini-badges');
        badgesContainer.innerHTML = '';

        if (ageInYears >= 5) {
            badgesContainer.innerHTML += `<div class="badge-pill badge-og">⏰ OG Player</div>`;
        } else if (ageInYears >= 2) {
            badgesContainer.innerHTML += `<div class="badge-pill badge-veteran">🏛️ Veteran</div>`;
        }

        if (projectedValue >= 100000) {
            badgesContainer.innerHTML += `<div class="badge-pill badge-rich">💎 Rich</div>`;
        }

        if (projectedItems >= 1000) {
            badgesContainer.innerHTML += `<div class="badge-pill badge-collector">🛍️ Collector</div>`;
        }

        // Add a default badge if empty
        if (badgesContainer.innerHTML === '') {
            badgesContainer.innerHTML = `<div class="badge-pill">⭐ Roblex Verified</div>`;
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

    // 3. Make the bottom panel solid dark instead of glassy transparent
    const bottomPanel = cardEl.querySelector('.card-bottom-panel');
    if (bottomPanel) {
        saved.push({ el: bottomPanel, prop: 'background', val: bottomPanel.style.background });
        bottomPanel.style.background = 'rgba(30, 32, 40, 0.95)';
    }

    // 4. Make tier chip background slightly more opaque
    const tierChip = cardEl.querySelector('.tier-chip');
    if (tierChip) {
        saved.push({ el: tierChip, prop: 'background', val: tierChip.style.background });
        tierChip.style.background = 'rgba(255, 255, 255, 0.25)';
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
    return html2canvas(cardEl, HTML2CANVAS_OPTIONS).then(canvas => {
        restoreCardAfterCapture(saved);
        return canvas;
    }).catch(err => {
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
