const cardContainer = document.getElementById("card-container");
const loadMoreButton = document.getElementById("loadMore");

const baseEndpoint = 'https://openapi.programming-hero.com/api'

let allData = []
let isLoadAllData = false
let modalLoading = false

const innerFeatures = (array = []) => {
  let innerHTML = ''
  if (array.length) {
    array.map(item => {
      innerHTML += `<li>${item}</li>`
    })
  } else innerHTML = 'No data found'
  return innerHTML
}

const innerModalFeatures = (features) => {
  let innerHTML = ''

  for (const item in features) {
    innerHTML += `<li>${features[item].feature_name}</li>`
  }

  return innerHTML
}
//  Prise Funtionlalitys 

const pricingFeature = (pricing) => {
  let innerHTML = ''
  pricing.map((item, index) => {
    const price = parseInt(item.price) !== 0
    let plan = ''

    if (!index) plan = 'of Cost/Basic'
    else if (index == 1) plan = 'of Cost/Pro'
    else plan = 'Free of Cost /Enterprise'

    innerHTML += `<div class="card" style="padding:6px; margin: 6px;">
                   ${item.plan}  ${price ? item.price : plan}
                   </div>`
  })
  return innerHTML
}
//  modal Show data
const renderModalData = (item) => {
  console.log({ item })
  const cardsContainer = document.getElementById('modalBody')
  let innerHTMLData = `<div class="col-sm-6">
                <div class="card h-100">
                  <div style="background: #f2ecec" class="card-body">
                    <h5>${item.description}</h5>
                    <div class="d-flex">
                    ${pricingFeature(item.pricing)}
                    </div>

                    <div class="d-flex d-flex justify-content-between">
                      <div >
                        <h6 class="card-title">Features</h6>
                        <ul style="font-size: small; color: dimgray;">
                        ${innerModalFeatures(item.features)}
                        </ul>
                      </div>
                      <div>
                        <h6 class="card-title">Integration</h6>
                        <ul style="font-size: small; color: dimgray;">
                        ${innerFeatures(item.integrations)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="card h-100">
                  <img src=${item.image_link[0]}
                    class="card-img-top" alt="...">
                    <p class="top-right"}>${item.accuracy.score * 100}% accuracy</p>
                  <div align="center">
                    <h6 class="card-title">${item.input_output_examples[0]?.input}</h6>
                    <p>${item.input_output_examples[0]?.output}</p>
                  </div>
                </div>
              </div>`
  cardsContainer.innerHTML = innerHTMLData
}

const showToolModal = (id) => {
  const toolId = id <= 9 ? `0${id}` : id
  fetch(`${baseEndpoint}/ai/tool/${toolId}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {

        renderModalData(allData.find(item => item.id == id))
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then(data => {
      console.log({ data })
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
  document.getElementById('loading').style.display = ""

  if (allData.length) {
    const toolsData = loadAllData ? allData : allData.slice(0, 6)
    renderAllCard(toolsData || [])
    if (loadAllData) {
      document.getElementById("loadMore").style.display = "none";
      document.getElementsByClassName('loading').style.display = "none";
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
        document.getElementById('loading').style.display = "none";
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
