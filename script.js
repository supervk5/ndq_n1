// Для Google Sheets (используйте API)
async function searchData() {
  const phone = document.getElementById('phoneInput').value;
  const resultDiv = document.getElementById('result');

  // Здесь должен быть запрос к вашей базе данных
  // Пример для JSON-файла на GitHub:
  const response = await fetch('https://raw.githubusercontent.com/supervk5/ndq_n1/main/data.json');
  const data = await response.json();

  const user = data.find(item => item.phone === phone);

  if (user) {
    resultDiv.innerHTML = `
      <h2>Данные найдены:</h2>
      <p><strong>ФИО:</strong> ${user.name}</p>
      <p><strong>День рождения:</strong> ${user.birthday}</p>
      <p><strong>Предпочтения:</strong> ${user.preferences}</p>
      <p><strong>Возраст:</strong> ${user.age}</p>
      <p><strong>Любимый цвет:</strong> ${user.favorite_color}</p>
    `;
  } else {
    resultDiv.innerHTML = '<p>Номер не найден!</p>';
  }
}