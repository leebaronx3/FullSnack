import { baseUrl } from "../utils/serverRouting"

const getDifficultyLevelsList = async () => {
    try {
        const res = await fetch(`${baseUrl}/staticdata/difficultylevels`)
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

const getGenderList = async () => {
    try {
        const res = await fetch(`${baseUrl}/staticdata/gender`)
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

const getOccupationsList = async () => {
    try {
        const res = await fetch(`${baseUrl}/staticdata/occupations`)
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

const getRequiredTechsList = async () => {
    try {
        const res = await fetch(`${baseUrl}/staticdata/requiredtechs`)
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

const getNotificationsTypesList = async () => {
    try {
        const res = await fetch(`${baseUrl}/staticdata/notificationstypes`)
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export { getDifficultyLevelsList, getGenderList, getOccupationsList, getRequiredTechsList, getNotificationsTypesList }