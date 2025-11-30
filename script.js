function normalizePhone(phone) {
  let cleaned = phone.replace(/\D/g, '');
  
  // Если номер начинается с 8, заменяем на 7
  if (cleaned.startsWith('8')) {
    cleaned = '7' + cleaned.slice(1);
  }
  
  // Если длина 10 цифр — добавляем 7 в начало
  if (cleaned.length === 10) {
    cleaned = '7' + cleaned;
  }
  
  // Оставляем только 11 цифр (7 + 10 цифр)
  return cleaned.slice(0, 11);
}

async function searchData() {
  const phoneInput = document.getElementById('phoneInput').value;
  const resultDiv = document.getElementById('result');

  // Проверка на пустой ввод
  if (!phoneInput.trim()) {
    resultDiv.innerHTML = '<p class="error-message">Введите номер телефона</p>';
    resultDiv.style.display = 'block';
    return;
  }

  const normalizedPhone = normalizePhone(phoneInput);

  try {
    // Загрузка данных из JSON
    const response = await fetch('data.json');
    
    // Проверка статуса ответа
    if (!response.ok) {
      throw new Error('Не удалось загрузить данные');
    }
    
    const data = await response.json();

    // Поиск пользователя по нормализованному номеру
    const user = data.find(item => item.phone === normalizedPhone);

    if (user) {
      // Формирование карточки пользователя
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
            <p class="user-birthday">Тип клиента: ${user.type_client}</p>
            
            <div class="info-item">
              <span class="info-label">Грейд:</span>
              <span class="info-value">${user.grade}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Предпочтения:</span>
              <span class="info-value">${user.preferences}</span>
            </div>
			
			<div class="info-item">
              <span class="info-label">Коментарий:</span>
              <span class="info-value">${user.commentary}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Телефон:</span>
              <span class="info-value">+${normalizedPhone}</span>
            </div>
          </div>
        </div>
      `;
      
      // Показываем контейнер с результатом
      resultDiv.style.display = 'block';
    } else {
      // Пользователь не найден
      resultDiv.innerHTML = '<p class="error-message">Номер не найден в базе данных</p>';
      resultDiv.style.display = 'block';
    }
  } catch (error) {
    console.error('Ошибка при поиске:', error);
    resultDiv.innerHTML = `<p class="error-message">Ошибка: ${error.message}</p>`;
    resultDiv.style.display = 'block';
  }
}

// Добавляем обработчик нажатия Enter в поле ввода
document.getElementById('phoneInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    searchData();
  }
});
