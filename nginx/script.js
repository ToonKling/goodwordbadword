const wordText = document.getElementById('word-text');
const leaderboard = document.getElementById('leaderboard');

let currentWord = null;

const loadNewWord = async () => {
  const response = await fetch(`http://toonkli.ng/words/random`);
  const nextWord = await response.json();
  currentWord = nextWord;
  const nextWordText = nextWord['word'];

  wordText.innerHTML = nextWordText;
  refreshLeaderboard();
}

loadNewWord()

const vote = async (rating) => {
  await fetch(`http://toonkli.ng/words/${currentWord['id']}/rating?rating=${rating}`, {
    method: "POST"
  });
  await loadNewWord();
}

const refreshLeaderboard = async () => {
  const response = await fetch(`http://toonkli.ng/words/leaderboard`);
  const leaderboardJson = await response.json();

  leaderboard.innerHTML = '';
  leaderboardJson.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.word}</td>
      <td>${item.avg}</td>
    `;
    leaderboard.appendChild(row);
  });
}

