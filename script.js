// Функция нормализации номера
function normalizePhone(phone) {
  // Удаляем всё, кроме цифр
  let cleaned = phone.replace(/\D/g, '');

  // Если начинается с 8, заменяем на 7
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

// Функция поиска данных
async function searchData() {
  const phoneInput = document.getElementById('phoneInput').value;
  const resultDiv = document.getElementById('result');

  // Нормализуем введённый номер
  const normalizedPhone = normalizePhone(phoneInput);

  try {
    // Загружаем данные из JSON
    const response = await fetch('data.json');
    const data = await response.json();

    // Ищем запись с совпадающим номером
    const user = data.find(item => item.phone === normalizedPhone);

    if (user) {
      resultDiv.innerHTML = `
      <h2>Данные найдены:</h2>
      <p><strong>ФИО:</strong> ${user.name}</p>
      <p><strong>Тип клиента:</strong> ${user.type_client}</p>
      <p><strong>Предпочтения:</strong> ${user.preferences}</p>
      <p><strong>Грейд:</strong> ${user.grade}</p>
      <p><strong>Коментарий:</strong> ${user.commentary}</p>
    `;
    } else {
      resultDiv.innerHTML = '<p>Номер не найден!</p>';
    }
  } catch (error) {
    resultDiv.innerHTML = '<p>Ошибка загрузки данных. Попробуйте позже.</p>';
    console.error('Ошибка:', error);
  }
}
