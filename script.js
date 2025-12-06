function normalizePhone(phone) {
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('8')) {
    cleaned = '7' + cleaned.slice(1);
  }
  
  if (cleaned.length === 10) {
    cleaned = '7' + cleaned;
  }
  
  return cleaned.slice(0, 11);
}

function formatDate(dateStr) {
  const [day, month, year] = dateStr.split('.');
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

function getStatusClass(value) {
  const num = parseFloat(value.replace('%', ''));
  if (num >= 80) return 'status-good';
  if (num >= 50) return 'status-warning';
  return 'status-critical';
}

async function searchData() {
  const phoneInput = document.getElementById('phoneInput').value;
  const resultDiv = document.getElementById('result');

  resultDiv.style.display = 'none';
  resultDiv.innerHTML = '';

  if (!phoneInput.trim()) {
    resultDiv.innerHTML = '<p class="error-message">Введите номер телефона</p>';
    resultDiv.style.display = 'block';
    return;
  }

  const normalizedPhone = normalizePhone(phoneInput);

  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Не удалось загрузить данные');

    const data = await response.json();
    const user = data.find(item => item.phone === normalizedPhone);

    if (user) {
      const messengersList = user.messengers?.length
        ? user.messengers.join(', ')
        : 'не указаны';

      const cinemasList = user.online_cinemas?.length
        ? user.online_cinemas.join(', ')
        : 'не указаны';

      resultDiv.innerHTML = `
        <div class="user-card">
          <div class="photo-container">
            <img
              src="${user.photo}"
              alt="${user.name}"
              onerror="this.src='https://via.placeholder.com/180?text=No+Photo'; this.alt='Фото отсутствует';"
              class="user-photo"
            >
          </div>
          <div class="info-container">
            <h2 class="user-name">${user.name}</h2>

            <div class="info-item">
              <span class="info-label">Номер телефона:</span>
              <span class="info-value">+${normalizedPhone}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Количество номеров:</span>
              <span class="info-value">${user.number_count}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Приложение MM:</span>
              <span class="info-value">${user.mm_app}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Дата последнего обращения:</span>
              <span class="info-value">${formatDate(user.last_contact)}</span>
            </div>

            <div class="info-item">
              <span class="info-label">День рождения:</span>
              <span class="info-value">${user.birthday}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Регион:</span>
              <span class="info-value">${user.region}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Лучший стандарт связи:</span>
              <span class="info-value">
                <span class="network-icon">${user.best_network.replace('G', '')}</span>
                ${user.best_network}
              </span>
            </div>

            <div class="info-item">
              <span class="info-label">Модель устройства:</span>
              <span class="info-value">${user.device_model}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Доля времени в сети 4G:</span>
              <div class="progress-container">
                <div class="progress">
                  <div class="progress-fill" style="width: ${user['4g_share'].replace('%', '')}%"></div>
                </div>
                <span class="${getStatusClass(user['4g_share'])}">${user['4g_share']}</span>
              </div>
            </div>

            <div class="info-item">
              <span class="info-label">Доля времени не в сети:</span>
              <div class="progress-container">
                <div class="progress">
                  <div class="progress-fill" style="width: ${user.offline_share.replace('%', '')}%"></div>
                </div>
                <span class="${getStatusClass(user.offline_share)}">${user.offline_share}</span>
              </div>
            </div>

            <div class="info-item">
              <span class="info-label">Мессенджеры:</span>
              <span class="info-value">${messengersList}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Онлайн‑кинотеатры:</span>
              <span class="info-value">${cinemasList}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Тип клиента:</span>
              <span class="info-value">${user.type_client}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Грейд:</span>
              <span class="info-value">${user.grade}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Предпочтения:</span>
              <span class="info-value">${user.preferences}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Комментарий:</span>
              <span class="info-value">${user.commentary}</span>
            </div>
          </div>
        </div>
      `;

      const card = resultDiv.querySelector('.user-card');
      card.classList.add('show');
      resultDiv.style.display = 'block';
    } else {
      resultDiv.innerHTML = '<p class="error-message">Номер не найден в базе данных</p>';
      resultDiv.style.display = 'block';
    }
  } catch (error) {
    console.error('Ошибка при поиске:', error);
    resultDiv.innerHTML = `<p class="error-message">Ошибка: ${error.message}</p>`;
    resultDiv.style.display = 'block';
  }
}

document.getElementById('phoneInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    searchData();
  }
});
