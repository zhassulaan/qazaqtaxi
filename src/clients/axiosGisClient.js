import axios from "axios";

const baseDomain = "https://catalog.api.2gis.com";
const baseURL = `${baseDomain}/3.0/`;

export default axios.create({
    baseURL,
});
