import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8765';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// auth
export const loginApi = async (email,password) => {
    try{
        const loginRequest = {
            email: email,
            password: password,
        }
        const response = await axiosInstance.post('user-service/auth/login', loginRequest);
        return response.data;
    } catch (error){
        console.error('Error logging in:', error);
        toast.error('Login failed');
    }
}

export const registerApi = async (email, password, fullName) =>{
    try{
        const registerRequest = {
            email: email,
            password: password,
            fullName: fullName,
        }
        const response = await axiosInstance.post('user-service/auth/register', registerRequest);
        return response.data;
    } catch (error){
        console.error('Error registering:', error);
        toast.error('Registration failed');
    }
}

export const getUser = async () => {
    try{
        const response = await axiosInstance.get(`user-service/user`,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to fetch user');
    }
}


// teams
export const getTeams = async (userId) => {
    try{
        const response = await axiosInstance.get(`user-service/user/${userId}/team`,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching teams:', error);
        toast.error('Failed to fetch teams');
    }
}

export const getTeamById = async (teamId) => {
    try{
        const response = await axiosInstance.get(`user-service/teams/${teamId}`,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching team:', error);
        toast.error('Failed to fetch team');
    }
}

// project
export const getProjects = async (teamId) => {
    try{
        const response = await axiosInstance.get(`project-service/project/teams/${teamId}/projects`,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to fetch projects');
    }
}
export const getProjectById = async (projectId) => {
    try{
        const response = await axiosInstance.get(`project-service/project/${projectId}`,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Failed to fetch project');
    }
} 


// task
export const addTask = async (projectId, task) => {
    try{
        const response = await axiosInstance.post(`project-service/task/projects/${projectId}/task`, task,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding task:', error);
        toast.error('Failed to add task');
    }
}

export const updateTask = async (taskId, task) => {
    try{
        const response = await axiosInstance.put(`project-service/task/${taskId}`, task,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task');
    }
}

export const assignSprint = async (taskId, sprintId) => {
    try{
        const response = await axiosInstance.post(`project-service/task/sprint/${sprintId}/task/${taskId}`,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error assigning task to sprint:', error);
        toast.error('Failed to assign task to sprint');
    }
}

// sprint
export const addSprint = async (projectId, sprint) => {
    try{
        const response = await axiosInstance.post(`project-service/sprint/projects/${projectId}/sprint`, sprint,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding sprint:', error);
        toast.error('Failed to add sprint');
    }
}

