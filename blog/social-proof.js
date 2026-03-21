/**
 * Social Proof Widget for ELP Cargo Blog
 * Shows rotating notification cards in bottom-left corner.
 * Only shows on blog article pages (not crm.html, case-*.html, lead-magnet.html, guide-*.html).
 */
(function() {
    'use strict';

    // Don't show on excluded pages
    var path = window.location.pathname;
    if (
        path.indexOf('/crm.html') !== -1 ||
        path.match(/\/case-[^/]*\.html/) ||
        path.indexOf('/lead-magnet.html') !== -1 ||
        path.match(/\/guide-[^/]*\.html/)
    ) {
        return;
    }

    var messages = [
        "ООО \u00ABПрямая фура\u00BB запросила расчёт доставки из Китая \u2014 2 мин назад",
        "87 компаний доверяют ELP Cargo свои грузы",
        "Последняя доставка: Италия \u2192 Москва, 0 царапин",
        "100+ тонн доставлено в этом месяце",
        "ООО \u00ABКосмоТрейд\u00BB получила коммерческое предложение \u2014 15 мин назад"
    ];

    var currentIndex = 0;
    var isVisible = true;
    var container, card, closeBtn;

    // Create styles
    var style = document.createElement('style');
    style.textContent = [
        '#sp-widget{position:fixed;bottom:24px;left:24px;z-index:9997;font-family:"Inter",-apple-system,sans-serif;}',
        '#sp-card{background:#1a1a2e;color:rgba(255,255,255,.88);padding:14px 40px 14px 16px;',
        'border-radius:10px;border-left:3px solid #8B5CF6;box-shadow:0 8px 32px rgba(0,0,0,.4);',
        'font-size:.85em;line-height:1.5;max-width:340px;transform:translateY(120%);opacity:0;',
        'transition:transform .4s cubic-bezier(.4,0,.2,1),opacity .4s ease;}',
        '#sp-card.sp-show{transform:translateY(0);opacity:1;}',
        '#sp-close{position:absolute;top:6px;right:10px;background:none;border:none;',
        'color:rgba(255,255,255,.4);font-size:16px;cursor:pointer;padding:2px 4px;line-height:1;}',
        '#sp-close:hover{color:rgba(255,255,255,.7);}',
        '#sp-dot{display:inline-block;width:8px;height:8px;background:#8B5CF6;border-radius:50%;',
        'margin-right:8px;vertical-align:middle;animation:sp-pulse 2s infinite;}',
        '@keyframes sp-pulse{0%,100%{opacity:1;}50%{opacity:.4;}}',
        '@media(max-width:480px){#sp-widget{left:12px;right:12px;bottom:12px;}',
        '#sp-card{max-width:none;}}'
    ].join('\n');
    document.head.appendChild(style);

    // Create DOM
    container = document.createElement('div');
    container.id = 'sp-widget';

    card = document.createElement('div');
    card.id = 'sp-card';

    closeBtn = document.createElement('button');
    closeBtn.id = 'sp-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.onclick = function() {
        isVisible = false;
        card.classList.remove('sp-show');
        setTimeout(function() { container.style.display = 'none'; }, 400);
    };

    card.appendChild(closeBtn);
    container.appendChild(card);
    document.body.appendChild(container);

    function showMessage(index) {
        if (!isVisible) return;
        card.classList.remove('sp-show');
        setTimeout(function() {
            var dot = '<span id="sp-dot"></span>';
            card.innerHTML = dot + messages[index];
            card.appendChild(closeBtn);
            card.classList.add('sp-show');
        }, 400);
    }

    // Initial delay before first show
    setTimeout(function() {
        showMessage(0);
        setInterval(function() {
            currentIndex = (currentIndex + 1) % messages.length;
            showMessage(currentIndex);
        }, 8000);
    }, 3000);
})();
