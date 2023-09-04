import Axios from "@/clients/axiosClient";

const resource = "/user";

export default {
    getCars(payload) {
        return Axios.post(`${resource}/cars`, payload);
    },

    getCards() {
        return Axios.get(`${resource}/get-cards`);
    },

    addCard(payload) {
        return Axios.post(`${resource}/save-card`, payload);
    },

    findDriver(payload) {
        return Axios.post(`${resource}/driver`, payload);
    },

    getDriverData(id) {
        return Axios.get(`${resource}/driver/${id}`);
    },

    confirmBooking(payload) {
        return Axios.post(`${resource}/confirm`, payload);
    },

    checkDropArea(payload) {
        // const payload = {
        //     service_type: service_type,
        //     area_id: area_id,
        //     latitude: latitude,
        //     longitude: longitude,
        // };
        return Axios.post(`${resource}/check-droplocation/area`, payload);
    },

    checkoutRide(payload) {
        // const payload = {
        //     area: area,
        //     later_time: later_time, // null
        //     service_package_id: service_package_id, // null
        //     pickup_longitude: pickup_longitude,
        //     vehicle_type: vehicle_type,
        //     total_drop_location: total_drop_location, // 1
        //     service_type: service_type, // 1
        //     pickup_latitude: pickup_latitude,
        //     later_date: later_date, // null
        //     booking_type: booking_type, // 1
        //     pick_up_location: pick_up_location, // name
        //     segment_id: segment_id, // 1
        //     number_of_rider: number_of_rider, // 0
        //     drop_location: [
        //         {
        //             stop: stop, // 1
        //             drop_latitude: drop_latitude,
        //             drop_longitude: drop_longitude,
        //             drop_location: drop_location, // name
        //             status: status, // 1
        //         },
        //     ],
        // };
        return Axios.post(`${resource}/checkout`, payload);
    },

    checkoutPayment(payload) {
        // const payload = {
        //  checkout: checkout,
        //  payment_method_id: payment_method_id,
        // };
        return Axios.post(`${resource}/checkout-payment`, payload);
    },

    confirmBooking(payload) {
        // const payload = {
        //     segment_id: segment_id,
        //     checkout: checkout
        // }
        return Axios.post(`${resource}/confirm`, payload);
    },

    getBookingDetails(id) {
        return Axios.post(`${resource}/booking/details`, {
            booking_id: id,
        });
    },

    checkBookingStatus(id) {
        return Axios.post(`/check-booking-status`, {
            booking_id: id,
        });
    },

    cancelPreBooking(id) {
        return Axios.post(`${resource}/booking/autocancel`, {
            booking_id: id,
            cancel_reason_id: 54,
        });
    },

    cancelBooking(id) {
        return Axios.post(`${resource}/booking/cancel`, {
            booking_id: id,
            cancel_reason_id: 54,
        });
    },

    rateDriver(payload) {
        return Axios.post(`${resource}/rate-to-driver`, payload);
    },

    sendNavigatorLinks(payload) {
        return Axios.post(`${resource}/navigator-links`, payload);
    },

    getChat(id) {
        return Axios.post(`${resource}/chat`, {
            booking_id: id,
        });
    },

    sendChatMessage(id, message) {
        return Axios.post(`${resource}/chat/send_message`, {
            booking_id: id,
            message: message,
        });
    },
};
