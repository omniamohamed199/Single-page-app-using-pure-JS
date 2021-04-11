import { ApplyVoteStyle } from './ApplyVoteStyle.js'
import dataService from './dataService.js'
const vidReqListElm = document.getElementById('listOfRequests')
function bindAdminActions(id,title,VideoRef,state,status) {
  const AdminChangeElm = document.getElementById(`admin_Change_Status_${id}`)
  const AdminInputVideoElm = document.getElementById(`Admin_video_res_${id}`)
  const AdminSaveVideoElm = document.getElementById(`Admin_Save_video_${id}`)
  const AdminDeleteVideoElm = document.getElementById(`Admin_delete_video_${id}`)
  const AdminvidresContainerVideoElm = document.getElementById(`Admin_video_res_Container_${id}`)

  if (state.IsSuperUser) {
    AdminChangeElm.value = status
    AdminInputVideoElm.value = VideoRef.link

    AdminChangeElm.addEventListener('change', (e) => {
      e.preventDefault()
      if (e.target.value === 'done') {
        AdminvidresContainerVideoElm.classList.remove('d-none')
      }
      else {
        AdminvidresContainerVideoElm.classList.add('d-none')
        dataService.UpdateVidoeStatus(id, e.target.value)
      }
    })
    AdminSaveVideoElm.addEventListener('click', (e) => {
      e.preventDefault()
      if (!AdminInputVideoElm.value) {
        AdminInputVideoElm.classList.add('is-invalid')
        AdminInputVideoElm.addEventListener('input', () => AdminInputVideoElm.classList.remove('is-invalid'))
        return;
      }
      dataService.UpdateVidoeStatus(id, 'done', AdminInputVideoElm.value)
    })
    AdminDeleteVideoElm.addEventListener('click', (e) => {
      e.preventDefault()
      const isSure = confirm(`Are you sure you want to delete that video ${title}`)
      if (isSure) {
        dataService.deleteVideoReq(id)
      }
    })
  }

}
function getAdminDom(id, status) {
  return `<div class="card-header">
  <div class="row">
    <div class="col-lg-2">
      <div class="form-group">
        <select id="admin_Change_Status_${id}">
          <option value="New">New</option>
          <option value="Planned">Planned</option>
          <option value="done">done</option>
        </select>
      </div>
    </div>
    <div class="col-lg-9">
      <div class="input-group mb-3 ${status !== 'done' ? 'd-none' : ''}" id="Admin_video_res_Container_${id}">
        <input type="text" class="form-control" placeholder="Recipient's username"
          aria-label="Recipient's username" aria-describedby="basic-addon2" id="Admin_video_res_${id}">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" id="Admin_Save_video_${id}">save</button>
        </div>
      </div>
    </div>
    <div class="col-lg-1" style="padding: 0;">
      <button class="btn btn-danger" type="button" style="width:100%" id="Admin_delete_video_${id}">Delete</button>
    </div>
  </div>
</div>`
}
function formateDate(date) {
  return new Date(date).toLocaleDateString()
}
function bindvoteActions(id,status,state) {
  
  const votesElms = document.querySelectorAll(`[id^=Votes_][id$=_${id}]`)

  votesElms.forEach(elm => {
    if (state.IsSuperUser || status === 'done') {
      return;
    }
    elm.addEventListener('click', function (e) {
      e.preventDefault()
      const [, vote_type, id] = e.target.getAttribute('id').split('_')

      dataService.updatevotes(id, vote_type, state.userID, status, state)


    })
  })
}
export function AppendSingleRequest(vidReQ, state, isPrepend) {
  const vidElm = document.createElement("div");
  const { _id: id,
    status,
    topic_title: title,
    topic_details: details,
    video_ref: VideoRef,
    votes,
    submit_date: SubmitDate,
    author_name: Author
    , target_level: Level } = vidReQ
  const statusClass =
    status === 'done' ?
      'text-success' :
      status === 'Planned' ?
        'text-primary' : ''
  const voteScore = votes.ups.length - votes.downs.length
  vidElm.innerHTML = `<div class="card mb-3">
              ${state.IsSuperUser ? getAdminDom(id, status) : ''}
              <div class="card-body d-flex justify-content-between flex-row">
                <div class="d-flex flex-column">
                  <h3>${title}</h3>
                  <p class="text-muted mb-2">${details}</p>
                  <p class="mb-0 text-muted">
                    ${vidReQ.expected_result && `<strong>Expected results:</strong> ${vidReQ.expected_result}`}
                  </p>
                </div>
                ${status === 'done' ? `<div class="ml-auto mr-3">
                <iframe width="240" height="135" src="https://www.youtube.com/embed/${VideoRef.link}" 
                 frameborder="0" allowfullscreen></iframe>
                </div>` : ''}
                
                <div class="d-flex flex-column text-center">
                  <a class="btn btn-link" id="Votes_ups_${id}">🔺</a>
                  <h3 id="scores${id}">${voteScore}</h3>
                  <a class="btn btn-link" id="Votes_downs_${id}">🔻</a>
                </div>
              </div>
              <div class="card-footer d-flex flex-row justify-content-between">
                <div>
                  <span class="${statusClass}"> ${status.toUpperCase()} ${status === 'done' ? formateDate(VideoRef.date) : ''}</span>
                  &bullet; added by <strong>${Author}</strong> on
                  <strong>${formateDate(SubmitDate)}</strong>
                </div>
                <div class="d-flex justify-content-center flex-column 408ml-auto mr-2">
                  <div class="badge badge-success">
                  ${Level}
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

  bindAdminActions(id,title,VideoRef,state,status)
  ApplyVoteStyle(id, votes,status === 'done', state)
  bindvoteActions(id,status,state)
}