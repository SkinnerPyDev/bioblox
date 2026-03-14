// profileviewer.js — Roblox Profile Viewer logic
(function () {
    'use strict';

    // ── RoTunnel base URLs (CORS-friendly proxy for Roblox APIs) ──
    var USERS_API = 'https://users.rotunnel.com';
    var THUMBNAILS_API = 'https://thumbnails.rotunnel.com';
    var FRIENDS_API = 'https://friends.rotunnel.com';

    // ── DOM refs ──
    var searchInput = document.getElementById('pv-input');
    var searchBtn = document.getElementById('pv-search-btn');
    var loadingEl = document.getElementById('pv-loading');
    var errorEl = document.getElementById('pv-error');
    var errorMsg = document.getElementById('pv-error-msg');
    var resultEl = document.getElementById('pv-result');

    // Result elements
    var avatarImg = document.getElementById('pv-avatar');
    var displayNameEl = document.getElementById('pv-display-name-text');
    var verifiedBadge = document.getElementById('pv-verified');
    var usernameEl = document.getElementById('pv-username-text');
    var userIdEl = document.getElementById('pv-user-id-text');
    var bioTextEl = document.getElementById('pv-bio-text');
    var friendsNum = document.getElementById('pv-friends-num');
    var followersNum = document.getElementById('pv-followers-num');
    var followingNum = document.getElementById('pv-following-num');
    var joinDateEl = document.getElementById('pv-join-date');
    var accountAgeEl = document.getElementById('pv-account-age');
    var lastOnlineEl = document.getElementById('pv-last-online');
    var bannedEl = document.getElementById('pv-banned');
    var prevNamesList = document.getElementById('pv-prev-names-list');
    var robloxLink = document.getElementById('pv-roblox-link');
    var shareBtn = document.getElementById('pv-share-btn');

    // ── Helpers ──
    function formatNumber(n) {
        if (n === null || n === undefined) return '-';
        if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        return n.toLocaleString();
    }

    function formatDate(iso) {
        if (!iso) return 'Unknown';
        var d = new Date(iso);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }

    function calcAccountAge(iso) {
        if (!iso) return 'Unknown';
        var created = new Date(iso);
        var now = new Date();
        var years = now.getFullYear() - created.getFullYear();
        var months = now.getMonth() - created.getMonth();
        if (months < 0) { years--; months += 12; }
        if (years > 0) return years + (years === 1 ? ' year' : ' years') + (months > 0 ? ', ' + months + (months === 1 ? ' month' : ' months') : '');
        if (months > 0) return months + (months === 1 ? ' month' : ' months');
        var days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        return days + (days === 1 ? ' day' : ' days');
    }

    function showState(state) {
        loadingEl.classList.toggle('visible', state === 'loading');
        errorEl.classList.toggle('visible', state === 'error');
        resultEl.classList.toggle('visible', state === 'result');
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        showState('error');
    }

    // ── API fetch helper ──
    function apiFetch(url, options) {
        return fetch(url, options || {}).then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        });
    }

    // ── Main search function ──
    function searchProfile(username) {
        username = (username || '').trim();
        if (!username) { searchInput.focus(); return; }

        // Update URL without reload
        var newUrl = window.location.pathname + '?u=' + encodeURIComponent(username);
        history.replaceState(null, '', newUrl);

        showState('loading');
        searchBtn.disabled = true;

        // Step 1: Resolve username → userId
        apiFetch(USERS_API + '/v1/usernames/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
        })
        .then(function (data) {
            if (!data.data || data.data.length === 0) {
                throw new Error('NOT_FOUND');
            }
            var userId = data.data[0].id;

            // Step 2: Fetch all data in parallel
            return Promise.all([
                apiFetch(USERS_API + '/v1/users/' + userId),
                apiFetch(THUMBNAILS_API + '/v1/users/avatar?userIds=' + userId + '&size=720x720&format=Png&isCircular=false'),
                apiFetch(FRIENDS_API + '/v1/users/' + userId + '/friends/count'),
                apiFetch(FRIENDS_API + '/v1/users/' + userId + '/followers/count'),
                apiFetch(FRIENDS_API + '/v1/users/' + userId + '/followings/count'),
                apiFetch(USERS_API + '/v1/users/' + userId + '/username-history?limit=10&sortOrder=Desc')
            ]);
        })
        .then(function (results) {
            var user = results[0];
            var thumbData = results[1];
            var friendsData = results[2];
            var followersData = results[3];
            var followingData = results[4];
            var historyData = results[5];

            // Avatar
            var avatarUrl = '';
            if (thumbData.data && thumbData.data.length > 0 && thumbData.data[0].imageUrl) {
                avatarUrl = thumbData.data[0].imageUrl;
            }
            avatarImg.src = avatarUrl || '';
            avatarImg.alt = user.displayName + ' Roblox avatar';

            // Names
            displayNameEl.textContent = user.displayName || user.name;
            usernameEl.textContent = '@' + user.name;
            userIdEl.textContent = 'ID: ' + user.id;

            // Verified
            if (user.hasVerifiedBadge) {
                verifiedBadge.style.display = 'inline-grid';
                verifiedBadge.innerHTML = '✓';
            } else {
                verifiedBadge.style.display = 'none';
            }

            // Bio
            if (user.description && user.description.trim()) {
                bioTextEl.textContent = user.description;
                bioTextEl.className = 'pv-h-bio-text';
            } else {
                bioTextEl.textContent = 'This user has no bio.';
                bioTextEl.className = 'pv-h-bio-text pv-bio-empty';
            }

            // Stats
            friendsNum.textContent = formatNumber(friendsData.count);
            followersNum.textContent = formatNumber(followersData.count);
            followingNum.textContent = formatNumber(followingData.count);

            // Info items
            joinDateEl.textContent = formatDate(user.created);
            accountAgeEl.textContent = calcAccountAge(user.created);
            lastOnlineEl.textContent = user.lastOnline ? formatDate(user.lastOnline) : 'Hidden';

            // Banned status
            if (user.isBanned) {
                bannedEl.textContent = '⚠️ Banned';
                bannedEl.style.color = '#f87171';
            } else {
                bannedEl.textContent = 'Active';
                bannedEl.style.color = '#34d399';
            }

            // Previous usernames
            prevNamesList.innerHTML = '';
            if (historyData.data && historyData.data.length > 0) {
                historyData.data.forEach(function (item) {
                    var chip = document.createElement('span');
                    chip.className = 'pv-prev-name-chip';
                    chip.textContent = '↩ ' + item.name;
                    prevNamesList.appendChild(chip);
                });
                prevNamesList.parentElement.style.display = 'block';
            } else {
                prevNamesList.innerHTML = '<span class="pv-no-prev-names">No previous usernames</span>';
                prevNamesList.parentElement.style.display = 'block';
            }

            // Action links
            robloxLink.href = 'https://www.roblox.com/users/' + user.id + '/profile';

            // Share button
            shareBtn.onclick = function () {
                var shareUrl = window.location.origin + window.location.pathname + '?u=' + encodeURIComponent(user.name);
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareUrl).then(function () {
                        shareBtn.innerHTML = '✅ Link Copied!';
                        setTimeout(function () { shareBtn.innerHTML = '🔗 Share Profile'; }, 2000);
                    });
                } else {
                    prompt('Copy this link:', shareUrl);
                }
            };

            showState('result');
            // Scroll to result
            resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(function (err) {
            if (err.message === 'NOT_FOUND') {
                showError('No Roblox account found with username "' + username + '". Check the spelling and try again.');
            } else {
                showError('Something went wrong while fetching the profile. Please try again in a moment.');
            }
            console.error('Profile Viewer Error:', err);
        })
        .finally(function () {
            searchBtn.disabled = false;
        });
    }

    // ── Event listeners ──
    window.searchProfile = searchProfile;

    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            searchProfile(searchInput.value);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') searchProfile(searchInput.value);
        });
    }

    // ── URL parameter auto-search ──
    var params = new URLSearchParams(window.location.search);
    var autoUser = params.get('u') || params.get('user') || params.get('username');
    if (autoUser) {
        searchInput.value = autoUser;
        // Small delay so page renders first
        setTimeout(function () { searchProfile(autoUser); }, 300);
    }
})();
