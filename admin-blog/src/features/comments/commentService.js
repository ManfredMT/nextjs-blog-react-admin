import axios from 'axios';

const API_URL = '/api/comments/'



const getComments = async (token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL+'all', config)

    return response.data

}

const deleteComment = async (commentId, token)=>{
    const config = {
        headers: {
            Authorization:`Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL+commentId, config)

    return response.data

}

const updateComment = async (commentId, commentData, token)=>{
    
    commentData.commentId=undefined;
    const config = {
        headers: {
            Authorization:`Bearer ${token}`,
            
        }
    }

    const response = await axios.put(API_URL+commentId, commentData ,config)

    return response.data

}



const commentService = {
    
    getComments,
    deleteComment,
    updateComment
}

export default commentService;