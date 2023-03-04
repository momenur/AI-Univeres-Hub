const cardContainer = document.getElementById("card-container");
const loadMoreButton = document.getElementById("loadMore");

const baseEndpoint = 'https://openapi.programming-hero.com/api'

let allData = []
let isLoadAllData = false

const innerFeatures = (features) => {
  let innerHTML = ''
  features.map(item => {
    innerHTML += `<li>${item}</li>`
  })
  return innerHTML
}

const renderModalData = (item) => {
  const cardsContainer = document.getElementById('modalBody')
  let innerHTMLData = `<div class="col-sm-6">
                <div class="card h-100">
                  <div style="background: #f2ecec" class="card-body">
                    <h5>${item.description}</h5>
                    <div class="d-flex">
                      <div class="card" style="padding:6px; margin: 6px;">
                        Free of Cost/Basic
                      </div>
                      <div class="card" style="padding:6px; margin: 6px;">
                        Free of Cost/Pro
                      </div>
                      <div class="card" style="padding:6px; margin: 6px;">
                        Free of Cost/Enterprise
                      </div>
                    </div>

                    <div class="d-flex d-flex justify-content-between">
                      <div >
                        <h6 class="card-title">Features</h6>
                        <ul style="font-size: small; color: dimgray;">
                        ${innerFeatures(item.features)}
                        </ul>
                      </div>
                      <div>
                        <h6 class="card-title">Integration</h6>
                        <ul style="font-size: small; color: dimgray;">
                        ${item.integrations ? innerFeatures(item.integration) : 'No data found'}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="card h-100">
                  <img src=${item.image}
                    class="card-img-top" alt="..." style="height: 250px;">
                  <div align="center">
                    <h6 class="card-title">Can you give any example?</h6>
                    <p>No! Not yet! Take a break</p>
                  </div>
                </div>
              </div>`
  cardsContainer.innerHTML = innerHTMLData
}

const showToolModal = (id) => {
  fetch(`${baseEndpoint}/ai/tool/${id}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderModalData(allData.find(item => item.id == id))
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then(data => {
      renderModalData(data?.data)
    })
    .catch((error) => console.error("FETCH ERROR:", error));
}


const renderAllCard = (data = []) => {
  const cardsContainer = document.querySelector(".tools-container");
  let innerHTMLData = ''
  data.map(item => {
    innerHTMLData += `
    <div class="col">
        <div class="card h-100">
          <img src=${item.image} class="card-img-top" alt="...">
          <div class="card-body">
            <h6 class="card-title">Features</h6>
            <ol style="padding-left: 16px; font-size: small; color: dimgray;">
            ${innerFeatures(item.features)}
            </ol>
            <div>
              <h6 class="card-title">${item.name}</h6>
              <p class="card-title">${item.published_in}</p>
            <div>
           <div>
            <button data-bs-toggle="modal" onClick="showToolModal(${item.id})" data-bs-target="#showSingleTool"> <i class="fa fa-hand-o-right" aria-hidden="true"></i>
            </button>
          </div>
          </div>
        </div>
      </div>
      </div>
      </div>

      `
  })
  cardsContainer.innerHTML = innerHTMLData
}


const fetchToolsDataAndDisplay = (loadAllData = false) => {
  isLoadAllData = loadAllData
  if (allData.length) {
    const toolsData = loadAllData ? allData : allData.slice(0, 6)
    renderAllCard(toolsData || [])
    if (loadAllData) {
      document.getElementById("loadMore").style.display = "none";
    }
  } else {
    fetch(`${baseEndpoint}/ai/tools`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("NETWORK RESPONSE ERROR");
        }
      })
      .then(data => {
        allData = data?.data?.tools
        const toolsData = loadAllData ? data?.data?.tools : data?.data?.tools.slice(0, 6)
        renderAllCard(toolsData || [])
        if (loadAllData) {
          document.getElementById("loadMore").style.display = "none";
        }
      })
      .catch((error) => console.error("FETCH ERROR:", error));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchToolsDataAndDisplay();
})


const handleSortData = () => {
  allData = allData.sort((itemOne, itemTwo) => new Date(itemOne.published_in) - new Date(itemTwo.published_in));
  fetchToolsDataAndDisplay(isLoadAllData)
}