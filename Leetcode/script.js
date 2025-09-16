const form = document.getElementById('add-problem-form');
const problemList = document.getElementById('problem-list');

// Load from local storage
let problems = JSON.parse(localStorage.getItem('problems')) || [];

function renderProblems() {
  problemList.innerHTML = '';
  problems.forEach((problem, index) => {
    const el = document.createElement('div');
    el.innerHTML = `
      <h3><a href="${problem.link}" target="_blank">${problem.title}</a></h3>
      <p>${problem.notes}</p>
      <p>Time Spent: ${problem.timeSpent || 0} min</p>
      <button onclick="startTimer(${index})">Start Timer</button>
      <button onclick="stopTimer(${index})">Stop Timer</button>
      <hr>
    `;
    problemList.appendChild(el);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const link = document.getElementById('link').value;
  const notes = document.getElementById('notes').value;

  problems.push({ title, link, notes, timeSpent: 0 });
  localStorage.setItem('problems', JSON.stringify(problems));
  renderProblems();
  form.reset();
});

let timers = {};

function startTimer(index) {
  if (!timers[index]) {
    timers[index] = Date.now();
    alert('Timer started!');
  }
}

function stopTimer(index) {
  if (timers[index]) {
    const duration = Math.floor((Date.now() - timers[index]) / 60000);
    problems[index].timeSpent += duration;
    delete timers[index];
    localStorage.setItem('problems', JSON.stringify(problems));
    renderProblems();
    alert(`Time added: ${duration} min`);
  }
}

renderProblems();
