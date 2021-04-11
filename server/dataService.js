import { AppendSingleRequest } from './AppendSingleRequest.js'
import { state } from './client.js'
import api from './api.js'
import {ApplyVoteStyle} from'./ApplyVoteStyle.js'
export default {
    AddVidReq: (formData) => {
        return api.VidReq.Post(formData)
    },
    UpdateVidoeStatus: (id, status, resVideo) => {
        return api.VidReq.Update(id, status, resVideo).then(_ => {
            window.location.reload()
        })
    },
    deleteVideoReq: (id) => {
        return api.VidReq.delete(id).then((blob) => blob.json()).then(_ => {
            window.location.reload()
        })
    },
    getAllVideoReqs: (
        sortBy = 'VotedFisrt',
        searchTerm = '',
        filterBy = 'all',
        localstate = state
    ) => {
        const vidReqListElm = document.getElementById('listOfRequests')
        api.VidReq.get(sortBy, searchTerm, filterBy).then(data => {
            vidReqListElm.innerText = ''
            data.forEach((vidReQ) => {
                AppendSingleRequest(vidReQ, localstate)
            })
        })
    }
    ,
    updatevotes: (id, vote_type, user_id,vidReQstatus,state) => {
        const scoresElm = document.getElementById(`scores${id}`)
        api.votes.update(id, vote_type, user_id).then(res => {
            scoresElm.innerText = res.ups.length - res.downs.length
            ApplyVoteStyle(id, res, vidReQstatus === 'done', state, vote_type)
        })
    }
}