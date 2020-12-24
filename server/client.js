function AppendSingleRequest(vidReQ) {
    const vidElm = document.createElement("div");
    vidElm.innerHTML = `<div class="card mb-3">
            <div class="card-body d-flex justify-content-between flex-row">
              <div class="d-flex flex-column">
                <h3>${vidReQ.topic_title}</h3>
                <p class="text-muted mb-2">${vidReQ.topic_details}</p>
                <p class="mb-0 text-muted">
                  ${ vidReQ.expected_result && `<strong>Expected results:</strong> ${vidReQ.expected_result}`}
                </p>
              </div>
              <div class="d-flex flex-column text-center">
                <a class="btn btn-link">🔺</a>
                <h3>0</h3>
                <a class="btn btn-link">🔻</a>
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
    return vidElm;
}

document.addEventListener('DOMContentLoaded', function () {
    const frmElm = document.getElementById('DataToBePosted')
    const vidReqListElm = document.getElementById('listOfRequests')
    fetch('http://localhost:7777/video-request').then(bold => bold.json()).then(data => {
        data.forEach((vidReQ) => {
            vidReqListElm.appendChild(AppendSingleRequest(vidReQ))
        })
    })
    frmElm.addEventListener('submit', (e) => {
      e.preventDefault()
        const formData = new FormData(frmElm)
        fetch('http://localhost:7777/video-request', { method: 'POST', body: formData }).then((blob)=>blob.json()).then((data) => {
          vidReqListElm.prepend(AppendSingleRequest(data))
        })
    })
})