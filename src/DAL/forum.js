import { baseUrl } from "../utils/serverRouting"
//GET
const getProjectsThreadsComments = async projectId => {
    try {
        const res = await fetch(`${baseUrl}/forum/${projectId}`)
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

//POST
const addNewThread = async newThreadData => {
    try {
        const res = await fetch(`${baseUrl}/forum/thread`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newThreadData),
            credentials: 'include'
        })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

const addNewComment = async newCommentData => {
    try {
        const res = await fetch(`${baseUrl}/forum/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCommentData),
            credentials: 'include'
        })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export { getProjectsThreadsComments, addNewThread, addNewComment }