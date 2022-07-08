import axios from 'axios';

const API_URL = '/api/posts/'

const createPost = async (postData, token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`,
            'content-type': 'multipart/form-data'
        }
    }

    const response = await axios.post(API_URL, postData, config)

    return response.data

}

const getPosts = async (token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data

}

const deletePost = async (postId, token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL+postId, config)

    return response.data

}

const updatePost = async (postId, postData, token)=>{
    
    postData.delete('postId')
    const config = {
        headers: {
            Authorization:`Bearer ${token}`,
            'content-type': 'multipart/form-data'
        }
    }

    const response = await axios.put(API_URL+postId, postData ,config)

    return response.data

}

const updateCategory = async (categoryData, token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`,
            'content-type': 'multipart/form-data'
        }
    }
    const response = await axios.put(API_URL+'category', categoryData, config)
    return response.data
}

const updateTag = async (tagData, token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`,
            'content-type': 'multipart/form-data'
        }
    }
    const response = await axios.put(API_URL+'tag', tagData, config)
    return response.data
}

const deleteTag = async (tagData, token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`,
            'content-type': 'multipart/form-data'
        },
        data: tagData
    }
    const response = await axios.delete(API_URL+'tag', config)
    return response.data
}



const postService = {
    createPost,
    getPosts,
    deletePost,
    updatePost,
    updateCategory,
    updateTag,
    deleteTag,
}

export default postService;