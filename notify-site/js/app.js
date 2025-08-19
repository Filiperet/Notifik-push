// app.js - Notificações Personalizadas
(function(){
  const $ = (s)=>document.querySelector(s);
  const log = (msg)=>{
    const line = document.createElement('div');
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    $('#log').prepend(line);
  };

  let uploadedIconURL = null;

  // Inputs
  const title = $('#title');
  const body = $('#body');
  const iconUrl = $('#iconUrl');
  const iconFile = $('#iconFile');
  const delay = $('#delay');
  const badge = $('#badge');
  const tag = $('#tag');
  const silent = $('#silent');
  const requireInteraction = $('#requireInteraction');

  const previewIcon = $('#previewIcon');
  const previewTitle = $('#previewTitle');
  const previewBody = $('#previewBody');

  // Permission
  $('#btn-permission').addEventListener('click', async () => {
    if (!('Notification' in window)) {
      log('Este navegador não suporta notificações.');
      alert('Seu navegador não suporta a API de Notificações.');
      return;
    }
    const res = await Notification.requestPermission();
    log('Permissão: ' + res);
  });

  // Handle icon upload
  iconFile.addEventListener('change', () => {
    const file = iconFile.files?.[0];
    if (file) {
      if (uploadedIconURL) URL.revokeObjectURL(uploadedIconURL);
      uploadedIconURL = URL.createObjectURL(file);
      previewIcon.src = uploadedIconURL;
      log('Ícone enviado atualizado no preview.');
    }
  });

  function currentIcon() {
    if (uploadedIconURL) return uploadedIconURL;
    if (iconUrl.value) return iconUrl.value;
    return 'assets/default-icon.png';
  }

  function buildOptions() {
    const opts = {
      body: body.value || '',
      icon: currentIcon(),
      badge: badge.value || undefined,
      tag: tag.value || undefined,
      renotify: !!tag.value,
      silent: !!silent.checked,
      requireInteraction: !!requireInteraction.checked,
      data: { createdAt: Date.now() }
    };
    return opts;
  }

  function preview() {
    previewTitle.textContent = title.value || 'Título da Notificação';
    previewBody.textContent = body.value || 'Mensagem da notificação aparecerá aqui.';
    previewIcon.src = currentIcon();
  }

  $('#btn-preview').addEventListener('click', preview);
  $('#btn-clear').addEventListener('click', () => {
    [title, body, iconUrl, delay, badge, tag].forEach(i => i.value = '');
    silent.checked = false;
    requireInteraction.checked = false;
    if (uploadedIconURL) {
      URL.revokeObjectURL(uploadedIconURL);
      uploadedIconURL = null;
    }
    preview();
    log('Formulário limpo.');
  });

  async function notifyNow() {
    if (!('Notification' in window)) {
      log('Navegador sem suporte a Notification API.');
      alert('Seu navegador não suporta a API de Notificações.');
      return;
    }
    const perm = Notification.permission;
    if (perm !== 'granted') {
      const req = await Notification.requestPermission();
      if (req !== 'granted') {
        log('Permissão negada.');
        alert('Você precisa permitir notificações.');
        return;
      }
    }

    try {
      const options = buildOptions();
      const n = new Notification(title.value || 'Nova notificação', options);
      n.onclick = () => {
        log('Usuário clicou na notificação.');
        window.focus();
        n.close();
      };
      log('Notificação enviada.');
    } catch (e) {
      log('Falha ao notificar: ' + (e?.message || e));
      console.error(e);
      alert('Falha ao enviar notificação: ' + e);
    }
  }

  $('#btn-notify').addEventListener('click', () => {
    const ms = parseInt(delay.value || '0', 10);
    if (ms > 0) {
      log('Agendando em ' + ms + ' ms...');
      setTimeout(notifyNow, ms);
    } else {
      notifyNow();
    }
  });

  // Init preview
  preview();
})();
