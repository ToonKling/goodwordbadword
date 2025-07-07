const wordText = document.getElementById('word-text');
const leaderboardBody = document.getElementById('leaderboard-body');
const url = "__API_BASE_URL__"

let currentWord = null;

const loadNewWord = async () => {
  const response = await fetch(`${url}/words/random`);
  const nextWord = await response.json();
  currentWord = nextWord;
  const nextWordText = nextWord['word'];

  wordText.innerHTML = nextWordText;
  refreshLeaderboard();
}

loadNewWord()

const vote = async (rating) => {
  await fetch(`${url}/words/${currentWord['id']}/rating?rating=${rating}`, {
    method: "POST"
  });
  await loadNewWord();
}

const refreshLeaderboard = async () => {
  const response = await fetch(`${url}/words/leaderboard`);
  const leaderboardJson = await response.json();

  leaderboardBody.innerHTML = '';
  leaderboardJson.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.word}</td>
      <td>${item.avg}</td>
    `;
    leaderboardBody.appendChild(row);
  });
}

