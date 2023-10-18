import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

import { apiUrls } from "@/utils/constants";
import type {DataLibRes} from "@/models/dataLib";
import type {anyObj} from "@/types/objTypes";
import {arrToObj} from "@/utils/utils";

export const API_BASE_URL = "/api";

const post = async (endpoint: string, data: object) => {
    try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

const get = async (endpoint: string, data: object) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};

const getImageData = async (data: object) => await post('/mlib/img/get_layout_imgs', data);

const changeImgIndex = async (data: object) => await post(apiUrls.MOVE_INDEX_IMG, data);

const deleteImage = async (data: object) => await post('/mlib/img/remove_img', data);

// input : Array of data lib rest
const getCompareValue = async (dataArr: string[]) => {
    const postData: anyObj = arrToObj(dataArr);
    const res = await post("/data_lib/get_data", postData)
    const resData: DataLibRes = res.data;
    return resData;
};

// export const getPjData = async () => {
//     const res = await post('/get_pjs_filter',{projects:true})
//     console.log(res)
// }
// await getPjData()
export { getImageData, changeImgIndex, deleteImage, getCompareValue, post, get };
