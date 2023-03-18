const form = document.querySelector('#search-form');
const resultsDiv = document.querySelector('#results');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const location = form.elements.location.value;
  const expertise = form.elements.expertise.value;
  const response = await fetch(`/api/search?location=${location}&expertise=${expertise}`);
  const results = await response.json();
  resultsDiv.innerHTML = '';
  for (const result of results) {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${result.name}</h3>
      <p>${result.email}</p>
      <p>${result.location}</p>
      <p>${result.expertise}</p>
      <p>${result.availability}</p>
    `;
    resultsDiv.appendChild(div);
  }
});