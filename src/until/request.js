import axios from "axios";
import router from '../router/index'
import {url} from "./upload";


const instance = axios.create({
    baseURL: url,
    timeout: 5000,
    headers: {'Content-Type': 'application/json'}
  })

instance.interceptors.request.use(config =>{
    if(sessionStorage.token){
        config.headers.Authorization = 'Bearer '+JSON.parse(sessionStorage.token)
    }
    return config
},err =>{
    return Promise.reject(err =>{console.log(err);})
});


instance.interceptors.response.use(res =>{
    return res
},err =>{
    if (err.response){
        switch (err.response.status) {
            case 401:
                router.push({
                    path:'/'
                })
        }
    }
    return Promise.reject(err.response.data)
});

export default instance
