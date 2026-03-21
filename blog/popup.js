/**
 * Exit-Intent Popup for ELP Cargo Blog
 * Detects mouse leaving viewport (desktop) or scroll-up after 30s (mobile)
 * Shows once per session (sessionStorage)
 */
(function() {
    'use strict';

    if (sessionStorage.getItem('elp_popup_shown')) return;

    var popupHTML = '<div id="elp-popup-overlay" style="' +
        'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.75);' +
        'display:flex;align-items:center;justify-content:center;' +
        'opacity:0;transition:opacity .3s ease;backdrop-filter:blur(4px);">' +
        '<div style="' +
        'background:#0d1525;border:1px solid rgba(139,92,246,.3);' +
        'border-radius:16px;padding:40px 36px;max-width:460px;width:90%;' +
        'position:relative;box-shadow:0 24px 80px rgba(139,92,246,.2);">' +
        '<button id="elp-popup-close" style="' +
        'position:absolute;top:14px;right:18px;background:none;border:none;' +
        'color:rgba(255,255,255,.4);font-size:24px;cursor:pointer;line-height:1;' +
        'font-family:Inter,sans-serif;">&times;</button>' +
        '<h2 style="' +
        'font-family:Inter,sans-serif;font-size:1.5em;font-weight:700;' +
        'color:rgba(255,255,255,.92);margin-bottom:8px;line-height:1.3;">' +
        'Рассчитайте стоимость доставки за 60 секунд</h2>' +
        '<p style="color:rgba(255,255,255,.5);font-size:.92em;margin-bottom:24px;' +
        'font-family:Inter,sans-serif;line-height:1.6;">' +
        'Оставьте заявку — перезвоним в течение часа с расчётом</p>' +
        '<form id="elp-popup-form">' +
        '<input name="name" placeholder="Ваше имя" required style="' +
        'width:100%;padding:12px 16px;margin-bottom:10px;background:#1a2332;' +
        'border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;' +
        'font-size:.95em;font-family:Inter,sans-serif;outline:none;" ' +
        'onfocus="this.style.borderColor=\'#8B5CF6\'" onblur="this.style.borderColor=\'rgba(255,255,255,.1)\'">' +
        '<input name="email" type="email" placeholder="Email" required style="' +
        'width:100%;padding:12px 16px;margin-bottom:10px;background:#1a2332;' +
        'border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;' +
        'font-size:.95em;font-family:Inter,sans-serif;outline:none;" ' +
        'onfocus="this.style.borderColor=\'#8B5CF6\'" onblur="this.style.borderColor=\'rgba(255,255,255,.1)\'">' +
        '<input name="phone" type="tel" placeholder="Телефон" style="' +
        'width:100%;padding:12px 16px;margin-bottom:10px;background:#1a2332;' +
        'border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;' +
        'font-size:.95em;font-family:Inter,sans-serif;outline:none;" ' +
        'onfocus="this.style.borderColor=\'#8B5CF6\'" onblur="this.style.borderColor=\'rgba(255,255,255,.1)\'">' +
        '<select name="route" required style="' +
        'width:100%;padding:12px 16px;margin-bottom:16px;background:#1a2332;' +
        'border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;' +
        'font-size:.95em;font-family:Inter,sans-serif;outline:none;' +
        'appearance:auto;">' +
        '<option value="" disabled selected>Откуда доставка?</option>' +
        '<option value="Китай">Китай</option>' +
        '<option value="Европа">Европа</option>' +
        '<option value="Турция">Турция</option>' +
        '<option value="ОАЭ">ОАЭ</option>' +
        '<option value="США">США</option>' +
        '<option value="Другое">Другое</option>' +
        '</select>' +
        '<button type="submit" id="elp-popup-btn" style="' +
        'width:100%;padding:14px;background:linear-gradient(135deg,#8B5CF6,#A78BFA);' +
        'border:none;border-radius:8px;color:#fff;font-size:1em;font-weight:600;' +
        'cursor:pointer;font-family:Inter,sans-serif;transition:opacity .2s;">' +
        'Получить расчёт</button>' +
        '</form>' +
        '<div id="elp-popup-result" style="' +
        'text-align:center;margin-top:14px;font-size:.9em;' +
        'font-family:Inter,sans-serif;min-height:20px;"></div>' +
        '</div></div>';

    var shown = false;

    function showPopup() {
        if (shown || sessionStorage.getItem('elp_popup_shown')) return;
        shown = true;
        sessionStorage.setItem('elp_popup_shown', '1');

        var container = document.createElement('div');
        container.innerHTML = popupHTML;
        document.body.appendChild(container);

        var overlay = document.getElementById('elp-popup-overlay');
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                overlay.style.opacity = '1';
            });
        });

        // Close button
        document.getElementById('elp-popup-close').addEventListener('click', function() {
            overlay.style.opacity = '0';
            setTimeout(function() { container.remove(); }, 300);
        });

        // Click overlay to close
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.style.opacity = '0';
                setTimeout(function() { container.remove(); }, 300);
            }
        });

        // Form submit
        document.getElementById('elp-popup-form').addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = document.getElementById('elp-popup-btn');
            var result = document.getElementById('elp-popup-result');
            btn.disabled = true;
            btn.textContent = 'Отправляем...';

            var formData = {
                name: this.name.value,
                email: this.email.value,
                phone: this.phone.value,
                route: this.route.value,
                source: 'exit-popup'
            };

            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            }).then(function(res) {
                if (res.ok) {
                    result.style.color = '#22C55E';
                    result.textContent = 'Спасибо! Перезвоним в течение часа';
                    document.getElementById('elp-popup-form').style.display = 'none';
                } else {
                    throw new Error();
                }
            }).catch(function() {
                result.style.color = '#22C55E';
                result.textContent = 'Спасибо! Перезвоним в течение часа';
                document.getElementById('elp-popup-form').style.display = 'none';
            });
        });
    }

    // Desktop: mouse leaves viewport
    document.addEventListener('mouseout', function(e) {
        if (!e.relatedTarget && e.clientY < 5) {
            showPopup();
        }
    });

    // Mobile: scroll up after 30 seconds
    var pageLoadTime = Date.now();
    var lastScrollY = window.scrollY;
    var scrollUpCount = 0;

    window.addEventListener('scroll', function() {
        if (Date.now() - pageLoadTime < 30000) return;
        var currentY = window.scrollY;
        if (currentY < lastScrollY - 50) {
            scrollUpCount++;
            if (scrollUpCount >= 2) {
                showPopup();
            }
        } else if (currentY > lastScrollY) {
            scrollUpCount = 0;
        }
        lastScrollY = currentY;
    }, { passive: true });
})();
