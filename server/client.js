const vidReqListElm = document.getElementById('listOfRequests')
const SUPERAdmin_ID = '1995112'
const state = {
  sortBy: 'VotedFisrt',
  searchTerm: '',
  userID: '',
  IsSuperUser: false
}

function AppendSingleRequest(vidReQ, isPrepend) {
  const vidElm = document.createElement("div");
  vidElm.innerHTML = `<div class="card mb-3">
            ${state.IsSuperUser ? `<div class="card-header">
            <div class="row">
              <div class="col-lg-2">
                <div class="form-group">
                  <select id="admin_Change_Status_${vidReQ._id}">
                    <option value="New">New</option>
                    <option value="Planned">Planned</option>
                    <option value="done">done</option>
                  </select>
                </div>
              </div>
              <div class="col-lg-9">
                <div class="input-group mb-3 ${vidReQ.status !== 'done' ? 'd-none' : ''}" id="Admin_video_res_Container_${vidReQ._id}">
                  <input type="text" class="form-control" placeholder="Recipient's username"
                    aria-label="Recipient's username" aria-describedby="basic-addon2" id="Admin_video_res_${vidReQ._id}">
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" id="Admin_Save_video_${vidReQ._id}">save</button>
                  </div>
                </div>
              </div>
              <div class="col-lg-1" style="padding: 0;">
                <button class="btn btn-danger" type="button" style="width:100%" id="Admin_delete_video_${vidReQ._id}">Delete</button>
              </div>
            </div>
          </div>` : ''}
            <div class="card-body d-flex justify-content-between flex-row">
              <div class="d-flex flex-column">
                <h3>${vidReQ.topic_title}</h3>
                <p class="text-muted mb-2">${vidReQ.topic_details}</p>
                <p class="mb-0 text-muted">
                  ${vidReQ.expected_result && `<strong>Expected results:</strong> ${vidReQ.expected_result}`}
                </p>
              </div>
              <div class="d-flex flex-column text-center">
                <a class="btn btn-link" id="Votes_ups_${vidReQ._id}">🔺</a>
                <h3 id="scores${vidReQ._id}">${vidReQ.votes.ups.length - vidReQ.votes.downs.length}</h3>
                <a class="btn btn-link" id="Votes_downs_${vidReQ._id}">🔻</a>
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


  const AdminChangeElm = document.getElementById(`admin_Change_Status_${vidReQ._id}`)
  const AdminInputVideoElm = document.getElementById(`Admin_video_res_${vidReQ._id}`)
  const AdminSaveVideoElm = document.getElementById(`Admin_Save_video_${vidReQ._id}`)
  const AdminDeleteVideoElm = document.getElementById(`Admin_delete_video_${vidReQ._id}`)
  const AdminvidresContainerVideoElm = document.getElementById(`Admin_video_res_Container_${vidReQ._id}`)

  if (state.IsSuperUser) {
    AdminChangeElm.value = vidReQ.status
    AdminInputVideoElm.value = vidReQ.video_ref.link

    AdminChangeElm.addEventListener('change', (e) => {
      e.preventDefault()
      if (e.target.value === 'done') {
        AdminvidresContainerVideoElm.classList.remove('d-none')
      }
      else {
        AdminvidresContainerVideoElm.classList.add('d-none')
        UpdateVidoeStatus(vidReQ._id, e.target.value)
      }
    })
    AdminSaveVideoElm.addEventListener('click', (e) => {
      e.preventDefault()
      if (!AdminInputVideoElm.value) {
        AdminInputVideoElm.classList.add('is-invalid')
        AdminInputVideoElm.addEventListener('input', () => AdminInputVideoElm.classList.remove('is-invalid'))
        return;
      }
      UpdateVidoeStatus(vidReQ._id, 'done', AdminInputVideoElm.value)
    })
    AdminDeleteVideoElm.addEventListener('click', (e) => {
      e.preventDefault()
      const isSure = confirm(`Are you sure you want to delete that video ${vidReQ.topic_title}`)
      if (isSure) {
        fetch('http://localhost:7777/video-request', {
          method: "DELETE",
          headers: { "content-type": "Application/JSON" },
          body: JSON.stringify({ id: vidReQ._id })
        }).then((blob) => blob.json()).then(res => {
          window.location.reload()
        })
      }
    })
  }

  ApplyVoteStyle(vidReQ._id, vidReQ.votes)

  const scoresElm = document.getElementById(`scores${vidReQ._id}`)
  const votesElms = document.querySelectorAll(`[id^=Votes_][id$=_${vidReQ._id}]`)

  votesElms.forEach(elm => elm.addEventListener('click', function (e) {
    e.preventDefault()
    const [, vote_type, id] = e.target.getAttribute('id').split('_')
    fetch('http://localhost:7777/video-request/vote', {
      method: "PUT",
      headers: { "content-type": "Application/JSON" },
      body: JSON.stringify({ id, vote_type, user_id: state.userID })
    }).then((blob) => blob.json()).then(res => {
      scoresElm.innerText = res.ups.length - res.downs.length
      ApplyVoteStyle(vidReQ._id, res, vote_type)
    })

  }))
}
function ApplyVoteStyle(vidReQ_id, VoteList, vote_type) {
  const Votes_upsElm = document.getElementById(`Votes_ups_${vidReQ_id}`)
  const Votes_downsElm = document.getElementById(`Votes_downs_${vidReQ_id}`)

  if(state.IsSuperUser)
  {
    Votes_upsElm.style.opacity='0.5'
    Votes_upsElm.style.cursor='not-allowed'
    Votes_downsElm.style.opacity='0.5'
    Votes_downsElm.style.cursor='not-allowed'
    return;
  }
  if (!vote_type) {
    if (VoteList.ups.includes(state.userID)) {
      vote_type = 'ups'
    }
    else if (VoteList.downs.includes(state.userID)) {
      vote_type = 'downs'
    }
    else {
      return
    }
  }
  
  const VoteDirElem = vote_type === 'ups' ? Votes_upsElm : Votes_downsElm
  const OtherDirElem = vote_type === 'ups' ? Votes_downsElm : Votes_upsElm

  if (VoteList[vote_type].includes(state.userID)) {
    VoteDirElem.style.opacity = 1
    OtherDirElem.style.opacity = '.5'
  }
  else {
    OtherDirElem.style.opacity = 1
  }

}
function getAll(sortBy = 'VotedFisrt', searchTerm = '') {
  fetch(`http://localhost:7777/video-request?GetBy=${sortBy}&SearchTerm=${searchTerm}`).then(bold => bold.json()).then(data => {
    vidReqListElm.innerText = ''
    data.forEach((vidReQ) => {
      AppendSingleRequest(vidReQ)
    })
  })
}
function debounce(fn, time) {
  let timeout;
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, arguments), time)
  }

}
function validateData(formData) {
  // const author_name = formData.get('author_name')
  // const author_email = formData.get('author_email')
  const topic_title = formData.get('topic_title')
  const topic_details = formData.get('topic_details')
  // if (!author_name) {    
  //   document.querySelector('[name=author_name]').classList.add('is-invalid');
  // }
  // const emailPattern=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  // if (!author_email || !emailPattern.test(author_email)) {
  //   document.querySelector('[name=author_email]').classList.add('is-invalid');
  // }
  if (!topic_title || topic_title.length > 30) {
    document.querySelector('[name=topic_title]').classList.add('is-invalid');
  }
  if (!topic_details) {
    document.querySelector('[name=topic_details]').classList.add('is-invalid');
  }
  const allInvalidElems = document.getElementById('DataToBePosted').querySelectorAll('.is-invalid')
  if (allInvalidElems.length) {
    allInvalidElems.forEach((elem) => {
      elem.addEventListener('input', function () {
        this.classList.remove('is-invalid')
      })
    })
    return;
  }

}
function UpdateVidoeStatus(id, status, resVideo) {
  fetch('http://localhost:7777/video-request', {
    method: "PUT",
    headers: { "content-type": "Application/JSON" },
    body: JSON.stringify({ id, status, resVideo })
  }).then((blob) => blob.json()).then(res => {
    window.location.reload()
  })
}
document.addEventListener('DOMContentLoaded', function () {
  const frmElm = document.getElementById('DataToBePosted')
  const FilterElms = document.querySelectorAll('[id*=Sort_By_]')
  const searchBox = document.getElementById('search_Box')
  const formloginElm = document.querySelector('.login-form')
  const mainconentElm = document.querySelector('.main-conent')
  if (window.location.search) {
    state.userID = new URLSearchParams(window.location.search).get('id')

    if (state.userID == SUPERAdmin_ID) {
      state.IsSuperUser = true
      document.querySelector('.normal-user-content').classList.add('d-none')
    }

    formloginElm.classList.add('d-none')
    mainconentElm.classList.remove('d-none')

  }
  FilterElms.forEach((elem) => {
    elem.addEventListener('click', function (e) {
      e.preventDefault()
      state.sortBy = this.querySelector('input').value
      getAll(state.sortBy, state.searchTerm)
      this.classList.add('active')
      if (state.sortBy === 'TopVotedFisrt') {
        document.getElementById('Sort_By_new').classList.remove('active')
      }
      else {
        document.getElementById('Sort_By_Top').classList.remove('active')
      }
    })
  })

  searchBox.addEventListener('input', debounce((e) => {
    state.searchTerm = e.target.value
    getAll(state.sortBy, state.searchTerm)
  }, 1100)
  )
  getAll()


  frmElm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(frmElm)
    formData.append('author_id', state.userID)
    validateData(formData)
    fetch('http://localhost:7777/video-request', { method: 'POST', body: formData }).then((blob) => blob.json()).then((data) => {
      AppendSingleRequest(data, true)
    })
  })
})