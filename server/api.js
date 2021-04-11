const apiURL='http://localhost:7777'
export default {
    VidReq: {
        get: (sortBy, searchTerm, filterBy) => {
            return fetch(`${apiURL}/video-request?GetBy=${sortBy}&SearchTerm=${searchTerm}&filterBy=${filterBy}`).then(bold => bold.json())
        },
        Post: (formData) => {
            return fetch(`${apiURL}/video-request`, { method: 'POST', body: formData }).then((blob) => blob.json())
        },
        Update: (id, status, resVideo) => {
            return fetch(`${apiURL}/video-request`, {
                method: "PUT",
                headers: { "content-type": "Application/JSON" },
                body: JSON.stringify({ id, status, resVideo })
            }).then((blob) => blob.json())
        },
        delete: (id) => {
            return fetch(`${apiURL}/video-request`, {
                method: "DELETE",
                headers: { "content-type": "Application/JSON" },
                body: JSON.stringify({ id })
            })
        },
    },
    votes: {
        update: (id, vote_type, user_id) => {
            return fetch(`${apiURL}/video-request/vote`, {
                method: "PUT",
                headers: { "content-type": "Application/JSON" },
                body: JSON.stringify({ id, vote_type, user_id})
            }).then((blob) => blob.json())
        }
    }
}