import Axios from "@/clients/axiosGisClient";
import { gisKey } from "@/clients/gisKey";

const key = `&key=${gisKey}`;

export default {
    getSuggests(search, location) {
        return Axios.get(`/suggests?q=${search}&location=${location}${key}`);
    },
    getGeocode(address) {
        return Axios.get(
            `/items/geocode?q=${address}&fields=items.point${key}`
        );
    },
};
