/* Form Bridge — intercepts form submissions on elpcargo.ru and sends to blog.elpcargo.ru/api/contact */
(function() {
  'use strict';
  document.addEventListener('submit', function(e) {
    var form = e.target;
    if (!form || form.dataset.bridged) return;
    form.dataset.bridged = '1';

    var data = { name: '', contact: '', message: '' };
    var inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(function(inp) {
      var val = (inp.value || '').trim();
      if (!val) return;
      var n = (inp.name || inp.placeholder || inp.type || '').toLowerCase();
      if (n.match(/name|имя|фио/) && !data.name) data.name = val;
      else if (n.match(/email|mail|почт|phone|тел|контакт|contact/) && !data.contact) data.contact = val;
      else if (n.match(/message|сообщ|comment|коммент|textarea/) || inp.tagName === 'TEXTAREA') data.message = val;
    });

    if (!data.name && !data.contact) {
      // Fallback: first input = name, second = contact
      if (inputs.length >= 2) {
        data.name = inputs[0].value || '';
        data.contact = inputs[1].value || '';
      }
      if (inputs.length >= 3 && !data.message) data.message = inputs[2].value || '';
    }

    if (!data.contact && !data.name) return;
    data.message = data.message || 'Заявка с главной страницы elpcargo.ru';

    try {
      fetch('https://blog.elpcargo.ru/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(function() {});
    } catch (err) {}
  }, true);
})();
