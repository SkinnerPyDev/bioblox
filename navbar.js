// navbar.js — Shared navbar component for all BioBlox pages
(function () {
    // Detect path prefix for subdirectory pages (e.g. blog/)
    var prefix = document.documentElement.dataset.navPrefix || '';

    // Build the navbar HTML
    var navHTML =
        '<nav>' +
            '<a href="' + prefix + '/" class="logo">' +
                '<img src="' + prefix + 'logo.webp" alt="BioBlox - Free Roblox Bio Ideas Generator" style="height: 90px; width: auto; object-fit: contain; margin: -20px 0;">' +
            '</a>' +
            '<ul class="nav-links">' +
                '<li><a href="' + prefix + '/" data-nav="index">Bio Generator</a></li>' +
                '<li><a href="' + prefix + 'flexcard-generator" data-nav="flexcard">Flex Card</a></li>' +
                '<li class="nav-dropdown" data-nav-dropdown>' +
                    '<a data-nav="tools">Tools ▾</a>' +
                    '<ul class="nav-dropdown-menu">' +
                        '<li><a href="' + prefix + 'roblox-username-generator" data-nav="username">🎮 Username Generator</a></li>' +
                        '<li><a href="' + prefix + 'roblox-font-generator" data-nav="font">✨ Font Generator</a></li>' +
                        '<li><a href="' + prefix + 'roblox-profile-viewer" data-nav="profileviewer">🔍 Profile Viewer</a></li>' +
                    '</ul>' +
                '</li>' +
                '<li><a href="' + prefix + 'blog" data-nav="blog">Blog</a></li>' +
            '</ul>' +
            '<div class="mobile-menu"><span></span><span></span><span></span></div>' +
        '</nav>';

    // Insert navbar into the placeholder
    var placeholder = document.getElementById('navbar');
    if (placeholder) {
        placeholder.outerHTML = navHTML;
    }

    // Determine which nav link should be active
    var path = window.location.pathname.replace(/\\/g, '/');
    var page = path.split('/').pop() || '/';

    var activeMap = {
        '/': 'index',
        'flexcard-generator': 'flexcard',
        'roblox-username-generator': 'username',
        'roblox-font-generator': 'font',
        'roblox-profile-viewer': 'profileviewer',
        'blog': 'blog'
    };

    var activeKey = activeMap[page];

    // Blog post pages (inside blog/ folder) should highlight "Blog"
    if (!activeKey && prefix === '../') {
        activeKey = 'blog';
    }

    if (activeKey) {
        var activeLink = document.querySelector('[data-nav="' + activeKey + '"]');
        if (activeLink) {
            activeLink.classList.add('active');
        }
        // If a tool sub-page is active, also highlight the Tools parent
        if (activeKey === 'username' || activeKey === 'font' || activeKey === 'profileviewer') {
            var toolsLink = document.querySelector('[data-nav="tools"]');
            if (toolsLink) toolsLink.classList.add('active');
        }
    }

    // Mobile Menu Toggle (simple dropdown, no overlay)
    var mobileMenu = document.querySelector('.mobile-menu');
    var navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function (e) {
            e.stopPropagation();
            navLinks.classList.toggle('mobile-open');
        });

        // Close on nav link click (only links with href, not dropdown triggers)
        var links = navLinks.querySelectorAll('a[href]');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function () {
                navLinks.classList.remove('mobile-open');
            });
        }

        // Close on click outside
        document.addEventListener('click', function (e) {
            if (!navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
                navLinks.classList.remove('mobile-open');
            }
        });
    }

    // Tools dropdown toggle (mobile)
    var toolsDropdown = document.querySelector('[data-nav-dropdown]');
    if (toolsDropdown) {
        var toolsTrigger = toolsDropdown.querySelector('[data-nav="tools"]');
        if (toolsTrigger) {
            toolsTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                toolsDropdown.classList.toggle('open');
            });
        }
    }

    // Set year in footer
    var footerSpan = document.querySelector('footer span');
    if (footerSpan) {
        footerSpan.innerHTML = '&copy; ' + new Date().getFullYear() + ' bioblox.fun';
    }
})();
