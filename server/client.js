const vidReqListElm = document.getElementById('listOfRequests')
function AppendSingleRequest(vidReQ, isPrepend) {
  const vidElm = document.createElement("div");
  vidElm.innerHTML = `<div class="card mb-3">
            <div class="card-body d-flex justify-content-between flex-row">
              <div class="d-flex flex-column">
                <h3>${vidReQ.topic_title}</h3>
                <p class="text-muted mb-2">${vidReQ.topic_details}</p>
                <p class="mb-0 text-muted">
                  ${vidReQ.expected_result && `<strong>Expected results:</strong> ${vidReQ.expected_result}`}
                </p>
              </div>
              <div class="d-flex flex-column text-center">
                <a class="btn btn-link" id="Votes_ups${vidReQ._id}">🔺</a>
                <h3 id="scores${vidReQ._id}">${vidReQ.votes.ups - vidReQ.votes.downs}</h3>
                <a class="btn btn-link" id="Votes_downs${vidReQ._id}">🔻</a>
              </div>
            </div>
            <div class="card-footer d-flex flex-row justify-content-between">
              <div>
                <span class="text-info"> ${vidReQ.status.toUpperCase()}</span>
                &bullet; added by <strong>${vidReQ.author_name}</strong> on
                <strong>${new Date(vidReQ.submit_date).toLocaleDateString()}</strong>
              </div>
              <div class="d-flex justify-content-center flex-column 408ml-auto mr-2">
                <div class="badge badge-success">
                ${vidReQ.target_level}
                </div>
              </div>
            </div>
          </div>`
  if (isPrepend) {
    vidReqListElm.prepend(vidElm)
  }
  else {
    vidReqListElm.appendChild(vidElm)
  }



  const Votes_upsElm = document.getElementById(`Votes_ups${vidReQ._id}`)
  const Votes_downsElm = document.getElementById(`Votes_downs${vidReQ._id}`)
  const scoresElm = document.getElementById(`scores${vidReQ._id}`)
  Votes_upsElm.addEventListener("click", (e) => {
    fetch('http://localhost:7777/video-request/vote', {
      method: "PUT",
      headers: { "content-type": "Application/JSON" },
      body: JSON.stringify({ id: vidReQ._id, vote_type: "ups" })
    }).then((blob) => blob.json()).then(res => {
      scoresElm.innerText = res.ups - res.downs
    })
  })
  Votes_downsElm.addEventListener("click", (e) => {
    fetch('http://localhost:7777/video-request/vote', {
      method: "PUT",
      headers: { "content-type": "Application/JSON" },
      body: JSON.stringify({ id: vidReQ._id, vote_type: "downs" })
    }).then((blob) => blob.json()).then(res => {
      scoresElm.innerText = res.ups - res.downs
    })
  })

}
function getAll(sortBy = 'VotedFisrt') {
  fetch(`http://localhost:7777/video-request?GetBy=${sortBy}`).then(bold => bold.json()).then(data => {
    vidReqListElm.innerText = ''
    data.forEach((vidReQ) => {
      AppendSingleRequest(vidReQ)
    })
  })
}
document.addEventListener('DOMContentLoaded', function () {
  const frmElm = document.getElementById('DataToBePosted')
  const FilterElms = document.querySelectorAll('[id*=Sort_By_]')
  FilterElms.forEach((elem) => {
    elem.addEventListener('click', function (e) {
      e.preventDefault()
      const sortBy = this.querySelector('input').value
      getAll(sortBy)
      this.classList.add('active')
      if (sortBy === 'TopVotedFisrt') {
        document.getElementById('Sort_By_new').classList.remove('active')
      }
      else {
        document.getElementById('Sort_By_new').classList.remove('active')
      }
    })
  })
  getAll()

  frmElm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(frmElm)
    fetch('http://localhost:7777/video-request', { method: 'POST', body: formData }).then((blob) => blob.json()).then((data) => {
      AppendSingleRequest(data, true)
    })
  })
})