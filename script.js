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
      // Формируем список мессенджеров
      const messengersList = user.messengers.length 
        ? user.messengers.join(', ')
        : 'не указаны';

      // Формируем список онлайн‑кинотеатров
      const cinemasList = user.online_cinemas.length
        ? user.online_cinemas.join(', ')
        : 'не указаны';

      // Собираем HTML карточки пользователя
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
              <span class="info-value">${user.last_contact}</span>
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
              <span class="info-value">${user.best_network}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Модель устройства:</span>
              <span class="info-value">${user.device_model}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Доля времени в сети 4G:</span>
              <span class="info-value">${user['4g_share']}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Доля времени не в сети:</span>
              <span class="info-value">${user.offline_share}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Мессенджеры:</span>
              <span class="info-value">${messengersList}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Онлайн‑кинотеатры:</span>
              <span class="info-value">${cinemasList}</span>
            </div>
          </div>
        </div>
      `;

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

// Обработчик Enter
document.getElementById('phoneInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    searchData();
  }
});
