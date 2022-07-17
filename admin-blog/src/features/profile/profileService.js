import axios from 'axios';

const API_URL = '/api/profile/'


const getProfile = async (token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data

}

const updateProfile = async (profileId, profileData, token)=>{
    
    profileData.delete('profileId')
    const config = {
        headers: {
            Authorization:`Bearer ${token}`,
            'content-type': 'multipart/form-data'
        }
    }

    const response = await axios.put(API_URL+profileId, profileData ,config)

    return response.data

}



const profileService = {
    getProfile,
    updateProfile
}

export default profileService;