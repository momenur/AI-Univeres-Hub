const loadAiUniverse = async () => {
  const url = `https://openapi.programming-hero.com/api/ai/tools`
  const res = await fetch(url);
  const data = await res.json();
  displayAiUniverse(data.data.tools);
}
const displayAiUniverse = ai => {
  const aiContainer = document.getElementById('ai-container');
  ai.forEach(ai => {
    const aiDiv = document.createElement('div');
    aiDiv.classList.add('col');
    aiDiv.innerHTML = `
    <div class="card h-100">
    <img src="${ai.image}" class="card-img-top p-4" alt="..." style="height: 250px;">
    <div class="card-body">
      <h5 class="card-title">Features</h5>
      <ol>
        <li>${ai.features[0]}</li>
        <li>${ai.features[1]}</li>
        <li>${ai.features[2]}</li>
      </ol>
    </div>
    <div class="card-footer">
    <h5>${ai.name}</h5>
    <div class="d-flex justify-content-between">
    <div>
      <p><i class="fa-solid fa-calendar-days me-2"></i>  ${ai.published_in}</p>
    </div>
    <div>
    <i class="fa-solid fa-arrow-right text-warning pe-2 fs-3"></i>
    </div>
  </div>
    </div>
  </div>
    `;
    aiContainer.appendChild(aiDiv);
  })
}
loadAiUniverse();

const sortData = () => {
  data = data.sort((itemOne, itemTwo) => new Date(itemOne.published_in) - new Date(itemTwo.published_in));
  displayAiUniverse()
};