import request from './request'

export const GetHomeAPI = () => request.get('/api/');

export const PostloginAPI = (params) => request.post('/api/login',params)

export const DeluserAPI = (params) => request.delete(`/api/user/${params}`)

export const GetuserAPI = () => request.get('api/user')

export const GetroleAPI = (params) => request.get('/api/role',params)

export const EdituserAPI = (id,data) => request.post(`/api/user/${id}`,data)

export const ResetuserAPI = (id) => request.post(`/api/restpassword/${id}`)

export const EditpasswordAPI = (params) => request.post('/api/editpassword',params)

export const EditdingdanAPI = (id,params) => request.post(`/api/dingdan/${id}`,params)

export const AdduserAPI = (params) => request.post('/api/user',params)

export const ViewcailiaoAPI = (params) => request.post('api/viewcailiao',params)

export const ViewxiaoleixingAPI = (params) => request.get(`api/viewcailiao/${params}`)

export const ViewnewAPI = () => request.get('/api/viewcailiao')

export const DeletecailiaoAPI = (params) => request.delete(`/api/cailiao/${params}`)

export const GetcailiaoAPI = (params) => request.get(`/api/cailiao/${params}`)

export const DellightAPI = (params) => request.delete(`/api/light/${params}`)

export const AddcailiaoAPI = (params) => request.post('/api/cailiao',params)

export const EditcailiaoAPI = (id,params) => request.post(`/api/editcailiao/${id}`,params)

export const EditlightAPI = (id,params) => request.post(`/api/light/${id}`,params)

export const GetlightAPI = (id) => request.get(`/api/light/${id}`)

export const Newbaozhuang = (id,params) => request.post(`/api/baozhuang/${id}`,params)

export const Getbaozhuang = (id) => request.get(`/api/baozhuang/${id}`)

export const Deletebaozhuang = (id) => request.delete(`/api/baozhuang/${id}`)

export const Editbaozhuang = (id,params) => request.put(`/api/baozhuang/${id}`,params)

export const GetpictureAPI = (params) => request.put('/api/uploadpicture/',params)

export const AddpictureAPI = (params) => request.post('/api/uploadpicture/',params)

export const DelpictureAPI = (params) => request.post(`/api/delpicture/`,params)

export const AddlightAPI = (params) => request.post('/api/light',params)

export const GetdingdanAPI = () => request.get('/api/dingdan')

export const GetdingdanpageAPI = (params) => request.post('/api/dingdanpage',params)

export const GetsupplierAPI = () => request.get('/api/supplier')

export const GetsupplierpageAPI = (params) => request.post('/api/supplierpage',params)

export const ViewcailiaoshijianAPI = (id,params) => request.post(`/api/sviewcailiao/${id}`,params)

export const Viewcailiaoshijian2API = (id) => request.get(`/api/sviewcailiao/${id}`)

export const CatcailiaoAPI = () => request.get('/api/viewcailiao')

export const DelsupplierAPI = (id) => request.delete(`/api/supplier/${id}`)

export const EditsupplierAPI = (id,params) => request.post(`/api/supplier/${id}`,params)

export const AddsupplierAPI = (params) => request.post('/api/supplier',params)

export const GetcustomerAPI = () => request.get('/api/customer')

export const GetcustomerpageAPI = (params) => request.post('/api/customerpage',params)

export const DeldingdanAPI = (id) => request.delete(`/api/dingdan/${id}`)

export const AdddingdanAPI = (params) => request.post(`/api/dingdan`,params)

export const ViewdingdanAPI = (id) => request.get(`/api/dingdanview/${id}`)

export const EditcustomerAPI = (id,params) => request.post(`/api/customer/${id}`,params)

export const AddcustomerAPI = (params) => request.post('/api/customer',params)

export const DelcustomerAPI = (id) => request.delete(`api/customer/${id}`)

export const ShenheAPI = (id,params) => request.post(`api/shenhe/${id}`,params)

export const ViewmingxiacailiaoAPI = (params) => request.post(`api/mingxiacailiao`,params)

export const ViewmingxiacailiaopageAPI = (id,params) => request.post(`api/mingxiacailiao/${id}`,params)

export const YanzhengcodeAPI = () => request.get('/api/yanzheng',{responseType: 'arraybuffer'})

export const ZhanshiAPI = () => request.get('/api/zhanshi')

export const Zhanshi2API = () => request.post('/api/zhanshi')

export const Zhanshi3API = () => request.put('/api/zhanshi')

export const Zhanshi4API = () => request.get('/api/zhanshitotal')

export const GetludannameAPI = () => request.get('/api/config')

export const BijiaAPI = (id,params) => request.post(`/api/bijia/${id}`,params)