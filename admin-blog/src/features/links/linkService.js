import axios from 'axios';

const API_URL = '/api/links/'

const createLink = async (linkData, token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`,
            'content-type': 'multipart/form-data'
        }
    }

    const response = await axios.post(API_URL, linkData, config)

    return response.data

}

const getLinks = async (token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data

}

const deleteLink = async (linkId, token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL+linkId, config)

    return response.data

}

const updateLink = async (linkId, linkData, token)=>{
    
    linkData.delete('linkId')
    const config = {
        headers: {
            Authorization:`Bearer ${token}`,
            'content-type': 'multipart/form-data'
        }
    }

    const response = await axios.put(API_URL+linkId, linkData ,config)

    return response.data

}



const linkService = {
    createLink,
    getLinks,
    deleteLink,
    updateLink
}

export default linkService;