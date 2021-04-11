export function ApplyVoteStyle(vidReQ_id, VoteList, IsDisabled, state,vote_type) {
    const Votes_upsElm = document.getElementById(`Votes_ups_${vidReQ_id}`)
    const Votes_downsElm = document.getElementById(`Votes_downs_${vidReQ_id}`)
  
    if (state.IsSuperUser || IsDisabled) {
      Votes_upsElm.style.opacity = '0.5'
      Votes_upsElm.style.cursor = 'not-allowed'
      Votes_downsElm.style.opacity = '0.5'
      Votes_downsElm.style.cursor = 'not-allowed'
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