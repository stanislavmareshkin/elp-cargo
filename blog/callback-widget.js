/**
 * Callback Widget for ELP Cargo Blog
 * Floating phone button (bottom-left) with callback request form
 */
(function() {
    'use strict';

    // --- Styles ---
    var style = document.createElement('style');
    style.textContent = [
        '@keyframes elp-cb-slidein{0%{opacity:0;transform:translateX(-80px)}100%{opacity:1;transform:translateX(0)}}',
        '@keyframes elp-cb-pulse{0%{box-shadow:0 0 0 0 rgba(139,92,246,.5)}70%{box-shadow:0 0 0 16px rgba(139,92,246,0)}100%{box-shadow:0 0 0 0 rgba(139,92,246,0)}}',
        '@keyframes elp-cb-fadein{0%{opacity:0;transform:scale(.9)}100%{opacity:1;transform:scale(1)}}',

        '#elp-cb-btn{position:fixed;bottom:24px;left:24px;z-index:9990;' +
            'width:60px;height:60px;border-radius:50%;' +
            'background:linear-gradient(135deg,#8B5CF6,#6366F1);' +
            'border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
            'box-shadow:0 4px 20px rgba(139,92,246,.4);' +
            'animation:elp-cb-pulse 2s infinite;' +
            'opacity:0;pointer-events:none;transition:transform .2s ease;}',
        '#elp-cb-btn.elp-visible{opacity:1;pointer-events:auto;animation:elp-cb-slidein .5s ease forwards,elp-cb-pulse 2s 1s infinite;}',
        '#elp-cb-btn:hover{transform:scale(1.1);}',
        '#elp-cb-btn svg{width:28px;height:28px;fill:#fff;}',

        '#elp-cb-tooltip{position:fixed;bottom:90px;left:24px;z-index:9989;' +
            'background:#1a1a3e;color:rgba(255,255,255,.88);padding:10px 16px;' +
            'border-radius:10px;font-family:system-ui,sans-serif;font-size:.85em;' +
            'box-shadow:0 4px 16px rgba(0,0,0,.4);border:1px solid rgba(99,102,241,.2);' +
            'opacity:0;transform:translateY(8px);transition:opacity .3s,transform .3s;' +
            'pointer-events:none;white-space:nowrap;}',
        '#elp-cb-tooltip.elp-visible{opacity:1;transform:translateY(0);}',

        '#elp-cb-overlay{position:fixed;inset:0;z-index:9995;background:rgba(0,0,0,.6);' +
            'display:none;align-items:center;justify-content:center;' +
            'backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);}',
        '#elp-cb-overlay.elp-open{display:flex;}',

        '#elp-cb-modal{background:#13132b;border:1px solid rgba(99,102,241,.15);' +
            'border-radius:12px;padding:32px 28px 28px;width:360px;max-width:92vw;' +
            'position:relative;animation:elp-cb-fadein .25s ease;' +
            'font-family:system-ui,-apple-system,sans-serif;color:#e0e0e0;}',

        '#elp-cb-close{position:absolute;top:12px;right:14px;background:none;border:none;' +
            'color:rgba(255,255,255,.5);font-size:22px;cursor:pointer;line-height:1;' +
            'padding:4px 8px;transition:color .2s;}',
        '#elp-cb-close:hover{color:#fff;}',

        '#elp-cb-modal h3{margin:0 0 6px;font-size:1.25em;font-weight:700;color:#fff;}',
        '#elp-cb-modal p.elp-cb-sub{margin:0 0 20px;font-size:.9em;color:rgba(255,255,255,.5);}',

        '#elp-cb-modal input{display:block;width:100%;box-sizing:border-box;' +
            'background:#1a1a3e;border:1px solid rgba(99,102,241,.2);border-radius:8px;' +
            'padding:12px 14px;font-size:1em;color:#e0e0e0;margin-bottom:12px;' +
            'font-family:system-ui,sans-serif;outline:none;transition:border-color .2s;}',
        '#elp-cb-modal input:focus{border-color:#8B5CF6;}',
        '#elp-cb-modal input::placeholder{color:rgba(255,255,255,.3);}',

        '#elp-cb-submit{display:block;width:100%;padding:14px;border:none;border-radius:8px;' +
            'background:linear-gradient(135deg,#8B5CF6,#6366F1);color:#fff;font-size:1em;' +
            'font-weight:600;cursor:pointer;transition:opacity .2s,transform .1s;' +
            'font-family:system-ui,sans-serif;}',
        '#elp-cb-submit:hover{opacity:.9;}',
        '#elp-cb-submit:active{transform:scale(.98);}',
        '#elp-cb-submit:disabled{opacity:.5;cursor:not-allowed;}',

        '#elp-cb-success{text-align:center;padding:20px 0;}',
        '#elp-cb-success svg{width:48px;height:48px;margin-bottom:12px;}',
        '#elp-cb-success p{margin:0;font-size:1.05em;color:#e0e0e0;line-height:1.5;}',

        '#elp-cb-error{color:#f87171;font-size:.85em;margin:-4px 0 10px;display:none;}',

        '@media(max-width:480px){' +
            '#elp-cb-btn{bottom:16px;left:16px;width:52px;height:52px;}' +
            '#elp-cb-btn svg{width:24px;height:24px;}' +
            '#elp-cb-tooltip{bottom:76px;left:16px;font-size:.8em;}' +
            '#elp-cb-modal{padding:24px 20px 20px;}' +
        '}'
    ].join('');
    document.head.appendChild(style);

    // --- Phone SVG icon ---
    var phoneSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 ' +
        '11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 ' +
        '1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>';

    var checkSvg = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="12" cy="12" r="10" stroke="#8B5CF6" stroke-width="2"/>' +
        '<path d="M8 12l2.5 2.5L16 9" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    // --- Create floating button ---
    var btn = document.createElement('button');
    btn.id = 'elp-cb-btn';
    btn.innerHTML = phoneSvg;
    btn.setAttribute('aria-label', 'Заказать обратный звонок');

    var tooltip = document.createElement('div');
    tooltip.id = 'elp-cb-tooltip';
    tooltip.textContent = 'Перезвоним за 5 минут';

    // --- Create modal overlay ---
    var overlay = document.createElement('div');
    overlay.id = 'elp-cb-overlay';
    overlay.innerHTML =
        '<div id="elp-cb-modal">' +
            '<button id="elp-cb-close" aria-label="Закрыть">&times;</button>' +
            '<h3>Обратный звонок</h3>' +
            '<p class="elp-cb-sub">Перезвоним в течение 5 минут</p>' +
            '<form id="elp-cb-form">' +
                '<input type="tel" id="elp-cb-phone" placeholder="+7 (___) ___-__-__" required autocomplete="tel">' +
                '<input type="text" id="elp-cb-name" placeholder="Ваше имя (необязательно)" autocomplete="given-name">' +
                '<div id="elp-cb-error"></div>' +
                '<button type="submit" id="elp-cb-submit">Перезвоним за 5 минут</button>' +
            '</form>' +
        '</div>';

    document.body.appendChild(btn);
    document.body.appendChild(tooltip);
    document.body.appendChild(overlay);

    // --- Phone mask +7 (XXX) XXX-XX-XX ---
    var phoneInput = document.getElementById('elp-cb-phone');

    function formatPhone(digits) {
        // digits = only digits after 7
        var d = digits;
        var result = '+7';
        if (d.length > 0) result += ' (' + d.substring(0, 3);
        if (d.length >= 3) result += ') ' + d.substring(3, 6);
        if (d.length >= 6) result += '-' + d.substring(6, 8);
        if (d.length >= 8) result += '-' + d.substring(8, 10);
        return result;
    }

    function getRawDigits(val) {
        var all = val.replace(/\D/g, '');
        // Remove leading 7 or 8
        if (all.length > 0 && (all[0] === '7' || all[0] === '8')) {
            all = all.substring(1);
        }
        return all.substring(0, 10);
    }

    phoneInput.addEventListener('input', function() {
        var digits = getRawDigits(this.value);
        this.value = formatPhone(digits);
    });

    phoneInput.addEventListener('focus', function() {
        if (!this.value) {
            this.value = '+7 ';
        }
    });

    phoneInput.addEventListener('keydown', function(e) {
        // Allow backspace to work naturally but reformat
        if (e.key === 'Backspace') {
            var digits = getRawDigits(this.value);
            if (digits.length > 0) {
                e.preventDefault();
                digits = digits.substring(0, digits.length - 1);
                this.value = digits.length > 0 ? formatPhone(digits) : '+7 ';
            } else {
                e.preventDefault();
            }
        }
    });

    // --- Modal open/close ---
    var modalShownThisSession = sessionStorage.getItem('elp-cb-shown') === '1';

    function openModal() {
        overlay.classList.add('elp-open');
        sessionStorage.setItem('elp-cb-shown', '1');
        modalShownThisSession = true;
    }

    function closeModal() {
        overlay.classList.remove('elp-open');
    }

    btn.addEventListener('click', function() {
        openModal();
    });

    document.getElementById('elp-cb-close').addEventListener('click', closeModal);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // --- Form submit ---
    var form = document.getElementById('elp-cb-form');
    var errorDiv = document.getElementById('elp-cb-error');
    var submitBtn = document.getElementById('elp-cb-submit');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        errorDiv.style.display = 'none';

        var digits = getRawDigits(phoneInput.value);
        if (digits.length !== 10) {
            errorDiv.textContent = 'Введите корректный номер телефона';
            errorDiv.style.display = 'block';
            return;
        }

        var phone = '+7' + digits;
        var name = document.getElementById('elp-cb-name').value.trim();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        var payload = {
            phone: phone,
            source: 'callback-widget',
            page: location.href
        };
        if (name) payload.name = name;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://blog.elpcargo.ru/api/contact', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                showSuccess();
            } else {
                errorDiv.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Перезвоним за 5 минут';
            }
        };
        xhr.onerror = function() {
            errorDiv.textContent = 'Ошибка сети. Попробуйте ещё раз.';
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Перезвоним за 5 минут';
        };
        xhr.send(JSON.stringify(payload));
    });

    function showSuccess() {
        var modal = document.getElementById('elp-cb-modal');
        var closeBtn = document.getElementById('elp-cb-close');
        // Replace modal content with success
        while (modal.firstChild) modal.removeChild(modal.firstChild);
        modal.appendChild(closeBtn);
        var successDiv = document.createElement('div');
        successDiv.id = 'elp-cb-success';
        successDiv.innerHTML = checkSvg + '<p>Спасибо! Перезвоним<br>в течение 5 минут</p>';
        modal.appendChild(successDiv);

        // Store in localStorage to avoid repeated annoyance
        try { localStorage.setItem('elp-cb-sent', '1'); } catch(e) {}

        // Auto-close after 3 seconds
        setTimeout(closeModal, 3000);
    }

    // --- Show button after 3s with slide-in ---
    var alreadySent = false;
    try { alreadySent = localStorage.getItem('elp-cb-sent') === '1'; } catch(e) {}

    setTimeout(function() {
        btn.classList.add('elp-visible');
        // Show tooltip briefly (only if not already submitted and not shown this session)
        if (!alreadySent && !modalShownThisSession) {
            setTimeout(function() {
                tooltip.classList.add('elp-visible');
                setTimeout(function() {
                    tooltip.classList.remove('elp-visible');
                }, 4000);
            }, 800);
        }
    }, 3000);

})();
