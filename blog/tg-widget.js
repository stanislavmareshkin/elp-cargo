/**
 * Telegram Chat Widget for ELP Cargo
 * Floating button with pulse animation, opens @ELP_Cargobot
 */
(function() {
    'use strict';

    var style = document.createElement('style');
    style.textContent = '' +
        '@keyframes elp-tg-pulse{0%{box-shadow:0 0 0 0 rgba(139,92,246,.5)}' +
        '70%{box-shadow:0 0 0 18px rgba(139,92,246,0)}100%{box-shadow:0 0 0 0 rgba(139,92,246,0)}}' +
        '#elp-tg-widget{position:fixed;bottom:24px;right:24px;z-index:9990;' +
        'width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#8B5CF6,#A78BFA);' +
        'border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
        'box-shadow:0 4px 20px rgba(139,92,246,.4);transition:transform .2s ease,box-shadow .2s ease;' +
        'animation:elp-tg-pulse 2s infinite;opacity:0;transform:scale(0.5);' +
        'transition:opacity .4s ease,transform .4s ease;}' +
        '#elp-tg-widget.elp-visible{opacity:1;transform:scale(1);}' +
        '#elp-tg-widget:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(139,92,246,.5);' +
        'animation:none;}' +
        '#elp-tg-widget svg{width:28px;height:28px;fill:#fff;}' +
        '#elp-tg-tooltip{position:fixed;bottom:90px;right:24px;z-index:9989;' +
        'background:#1a2332;color:rgba(255,255,255,.88);padding:10px 16px;' +
        'border-radius:10px;font-family:Inter,sans-serif;font-size:.85em;' +
        'box-shadow:0 4px 16px rgba(0,0,0,.4);border:1px solid rgba(139,92,246,.2);' +
        'opacity:0;transform:translateY(8px);transition:opacity .3s,transform .3s;' +
        'pointer-events:none;white-space:nowrap;}' +
        '#elp-tg-tooltip.elp-visible{opacity:1;transform:translateY(0);}';
    document.head.appendChild(style);

    // Telegram paper plane SVG
    var svgIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M11.994 2C6.472 2 2 6.477 2 12.004 2 17.527 6.472 22 ' +
        '11.994 22 17.522 22 22 17.527 22 12.004 22 6.477 17.522 2 11.994 ' +
        '2zm5.326 5.5L15.54 17.1c-.13.58-.47.72-.96.45l-2.65-1.95-1.28 ' +
        '1.23c-.14.14-.26.26-.53.26l.19-2.71 4.93-4.46c.21-.19-.05-.3-.33-.11L8.85 ' +
        '13.81l-2.6-.81c-.57-.18-.58-.57.12-.84l10.16-3.92c.47-.17.88.11.73.84z"/></svg>';

    var btn = document.createElement('button');
    btn.id = 'elp-tg-widget';
    btn.innerHTML = svgIcon;
    btn.setAttribute('aria-label', 'Написать в Telegram');
    btn.addEventListener('click', function() {
        window.open('https://t.me/ELP_Cargobot', '_blank');
    });

    var tooltip = document.createElement('div');
    tooltip.id = 'elp-tg-tooltip';
    tooltip.textContent = 'Напишите нам в Telegram';

    document.body.appendChild(btn);
    document.body.appendChild(tooltip);

    // Show after 5 seconds
    setTimeout(function() {
        btn.classList.add('elp-visible');
        // Show tooltip briefly
        setTimeout(function() {
            tooltip.classList.add('elp-visible');
            setTimeout(function() {
                tooltip.classList.remove('elp-visible');
            }, 4000);
        }, 800);
    }, 5000);
})();
