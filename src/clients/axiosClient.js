// import tokenKey from "./tokenKey";
import axios from "axios";

const baseDomain = "https://admin.qazaq.taxi";
const baseURL = `${baseDomain}/api/`;

export default axios.create({
    baseURL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});
