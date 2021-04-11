import { debounce } from './debounce.js'
import { AppendSingleRequest } from './AppendSingleRequest.js'
import dataService from './dataService.js'
import {validateData} from './validateData.js'
const SUPERAdmin_ID = '1995112'
export const state = {
  sortBy: 'VotedFisrt',
  searchTerm: '',
  filterBy: 'all',
  userID: '',
  IsSuperUser: false
}
document.addEventListener('DOMContentLoaded', function () {
  const frmElm = document.getElementById('DataToBePosted')
  const FilterElms = document.querySelectorAll('[id*=Sort_By_]')
  const searchBox = document.getElementById('search_Box')
  const FilterByElms = document.querySelectorAll('[id*=Filter_By_]')
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
      dataService.getAllVideoReqs(state.sortBy, state.searchTerm, state.filterBy)
      this.classList.add('active')
      if (state.sortBy === 'TopVotedFisrt') {
        document.getElementById('Sort_By_new').classList.remove('active')
      }
      else {
        document.getElementById('Sort_By_Top').classList.remove('active')
      }
    })
  })

  FilterByElms.forEach(elm => {
    elm.addEventListener('click', function (e) {
      e.preventDefault()
      state.filterBy = e.target.getAttribute('id').split('_')[2]
      FilterByElms.forEach(option => option.classList.remove('active'))
      this.classList.add('active')
      dataService.getAllVideoReqs(state.sortBy, state.searchTerm, state.filterBy)
    })
  })
  console.log(FilterByElms)
  searchBox.addEventListener('input', debounce((e) => {
    state.searchTerm = e.target.value
    dataService.getAllVideoReqs(state.sortBy, state.searchTerm, state.filterBy)
  }, 1100)
  )
  dataService.getAllVideoReqs()


  frmElm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(frmElm)
    formData.append('author_id', state.userID)
    validateData(formData)
    dataService.AddVidReq(formData).then((data) => {
      AppendSingleRequest(data, state, true)
    })
  })
})