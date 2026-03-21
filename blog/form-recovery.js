/**
 * ELP Cargo — Abandoned Form Recovery
 *
 * Tracks form field input across blog pages. When a user starts filling a form
 * but leaves without submitting, shows a recovery banner on their next visit.
 * If an email was captured, sends it to /api/contact as "abandoned-form" source.
 *
 * Privacy: only activates after user interacts with a form field.
 * Auto-included on: calculator, case-*, lead-magnet, tracking, roi-calculator pages.
 */
(function() {
    'use strict';

    var STORAGE_KEY = 'elp_form_recovery';
    var BANNER_DISMISSED_KEY = 'elp_recovery_dismissed';
    var SENT_KEY = 'elp_recovery_sent';

    // ── Utility ──────────────────────────────────────────────────
    function getStorage() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch(e) {
            return null;
        }
    }

    function setStorage(data) {
        try {
            data.updated = Date.now();
            data.page = window.location.pathname;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch(e) {}
    }

    function clearStorage() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(BANNER_DISMISSED_KEY);
        } catch(e) {}
    }

    function isDismissed() {
        try {
            var ts = localStorage.getItem(BANNER_DISMISSED_KEY);
            if (!ts) return false;
            // Re-show after 24 hours
            return (Date.now() - parseInt(ts)) < 86400000;
        } catch(e) {
            return false;
        }
    }

    function wasSent(email) {
        try {
            var sent = JSON.parse(localStorage.getItem(SENT_KEY) || '{}');
            return !!sent[email];
        } catch(e) {
            return false;
        }
    }

    function markSent(email) {
        try {
            var sent = JSON.parse(localStorage.getItem(SENT_KEY) || '{}');
            sent[email] = Date.now();
            localStorage.setItem(SENT_KEY, JSON.stringify(sent));
        } catch(e) {}
    }

    // ── Form Tracking ────────────────────────────────────────────
    var formInteracted = false;
    var capturedData = {};

    function trackForms() {
        // Find all input, select, textarea in forms or standalone
        var fields = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea, select');

        for (var i = 0; i < fields.length; i++) {
            (function(field) {
                field.addEventListener('input', function() {
                    formInteracted = true;
                    var key = field.id || field.name || field.placeholder || ('field_' + i);
                    capturedData[key] = field.value;

                    // Check if this is an email field
                    if (field.type === 'email' || /email/i.test(field.id || field.name || field.placeholder || '')) {
                        capturedData._email = field.value;
                    }
                    if (field.type === 'tel' || /phone|tel/i.test(field.id || field.name || field.placeholder || '')) {
                        capturedData._phone = field.value;
                    }
                    if (/name|имя/i.test(field.id || field.name || field.placeholder || '')) {
                        capturedData._name = field.value;
                    }

                    // Save partial data
                    setStorage(capturedData);
                });

                field.addEventListener('focus', function() {
                    formInteracted = true;
                });
            })(fields[i]);
        }

        // Track form submissions to clear recovery data
        var forms = document.querySelectorAll('form');
        for (var j = 0; j < forms.length; j++) {
            forms[j].addEventListener('submit', function() {
                clearStorage();
            });
        }

        // Also track custom submit buttons (non-form buttons with onclick)
        var submitBtns = document.querySelectorAll('[onclick*="submit"], .btn-submit, [type="submit"]');
        for (var k = 0; k < submitBtns.length; k++) {
            submitBtns[k].addEventListener('click', function() {
                // Delay clear to let the submit handler run first
                setTimeout(clearStorage, 2000);
            });
        }
    }

    // ── Beforeunload — send abandoned email ──────────────────────
    function setupAbandonDetection() {
        window.addEventListener('beforeunload', function() {
            if (!formInteracted) return;

            var data = getStorage();
            if (!data || !data._email) return;

            var email = data._email.trim();
            if (!email || email.indexOf('@') < 0) return;
            if (wasSent(email)) return;

            // Send beacon with partial form data
            try {
                var payload = JSON.stringify({
                    source: 'abandoned-form',
                    email: email,
                    name: data._name || '',
                    phone: data._phone || '',
                    page: window.location.pathname,
                    timestamp: new Date().toISOString()
                });
                navigator.sendBeacon('/api/contact', payload);
                markSent(email);
            } catch(e) {}
        });
    }

    // ── Recovery Banner ──────────────────────────────────────────
    function showRecoveryBanner(savedData) {
        if (isDismissed()) return;

        var banner = document.createElement('div');
        banner.id = 'elp-recovery-banner';
        banner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0d1525;border:1px solid rgba(139,92,246,.3);border-radius:12px;padding:16px 24px;display:flex;align-items:center;gap:16px;z-index:9999;box-shadow:0 8px 32px rgba(0,0,0,.4);max-width:500px;width:calc(100% - 40px);font-family:Inter,-apple-system,sans-serif;animation:elpSlideUp .4s ease;';

        // Add animation
        var style = document.createElement('style');
        style.textContent = '@keyframes elpSlideUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
        document.head.appendChild(style);

        var text = document.createElement('div');
        text.style.cssText = 'flex:1;color:rgba(255,255,255,.88);font-size:.9em;line-height:1.4;';
        text.innerHTML = '<strong style="color:#A78BFA;">Вы не завершили заявку</strong><br><span style="color:rgba(255,255,255,.55);font-size:.85em;">Продолжить заполнение?</span>';

        var btnContinue = document.createElement('button');
        btnContinue.textContent = 'Продолжить';
        btnContinue.style.cssText = 'background:linear-gradient(135deg,#8B5CF6,#A78BFA);border:none;border-radius:8px;padding:8px 20px;color:white;font-size:.85em;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit;';
        btnContinue.addEventListener('click', function() {
            prefillForms(savedData);
            banner.remove();
        });

        var btnClose = document.createElement('button');
        btnClose.textContent = '\u00d7';
        btnClose.style.cssText = 'background:none;border:none;color:rgba(255,255,255,.4);font-size:1.4em;cursor:pointer;padding:0 4px;line-height:1;';
        btnClose.addEventListener('click', function() {
            banner.remove();
            try { localStorage.setItem(BANNER_DISMISSED_KEY, Date.now().toString()); } catch(e) {}
        });

        banner.appendChild(text);
        banner.appendChild(btnContinue);
        banner.appendChild(btnClose);
        document.body.appendChild(banner);
    }

    // ── Prefill Forms ────────────────────────────────────────────
    function prefillForms(savedData) {
        if (!savedData) return;

        var fields = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea');

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var key = field.id || field.name || field.placeholder || ('field_' + i);

            // Try to match by key
            if (savedData[key]) {
                field.value = savedData[key];
                field.dispatchEvent(new Event('input', { bubbles: true }));
                continue;
            }

            // Try to match by type
            if ((field.type === 'email' || /email/i.test(key)) && savedData._email) {
                field.value = savedData._email;
                field.dispatchEvent(new Event('input', { bubbles: true }));
            } else if ((field.type === 'tel' || /phone|tel/i.test(key)) && savedData._phone) {
                field.value = savedData._phone;
                field.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (/name|имя/i.test(key) && savedData._name) {
                field.value = savedData._name;
                field.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        // Scroll to first form
        var firstForm = document.querySelector('form, .lead-form, .form-box, .calc-card');
        if (firstForm) {
            firstForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // ── Init ─────────────────────────────────────────────────────
    function init() {
        // Check for saved recovery data from a previous visit
        var savedData = getStorage();
        var isReturningVisitor = savedData && savedData.updated && savedData._email;

        // Different page than where they left?
        var samePage = savedData && savedData.page === window.location.pathname;

        if (isReturningVisitor && !samePage) {
            // Show recovery banner after a short delay
            setTimeout(function() {
                showRecoveryBanner(savedData);
            }, 2000);
        }

        // Set up tracking on current page forms
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                trackForms();
                setupAbandonDetection();
            });
        } else {
            trackForms();
            setupAbandonDetection();
        }
    }

    // Expose for external use
    window.ELPFormRecovery = {
        init: init,
        clear: clearStorage,
        getData: getStorage
    };

    init();
})();
