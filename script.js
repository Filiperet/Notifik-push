document.getElementById('notifyForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;
  const icon = document.getElementById('icon').value || 'https://cdn-icons-png.flaticon.com/512/1827/1827370.png';

  if (!("Notification" in window)) {
    alert("Este navegador não suporta notificações!");
  } else if (Notification.permission === "granted") {
    new Notification(title, { body, icon });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body, icon });
      }
    });
  }
});
