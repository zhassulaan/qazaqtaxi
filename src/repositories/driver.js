import Axios from "@/clients/axiosClient";

const resource = "/driver";

export default {
    getDriverData() {
        return Axios.post(`${resource}/driverData`);
    },

    getVehicleData(id) {
        return Axios.post(`${resource}/slider-data`, {
            player_id: id,
        });
    },
    // todo check
    startWork(payload) {
        return Axios.post(`${resource}/online-offline`, {
            longitude: payload.longitude,
            latitude: payload.latitude,
            status: 1,
        });
    },
    // todo check
    stopWork(payload) {
        return Axios.post(`${resource}/online-offline`, {
            longitude: payload.longitude,
            latitude: payload.latitude,
            status: 2,
        });
    },

    // ???
    getNewOrder(payload) {
        return Axios.post(`${resource}/cars`, payload);
    },
    // todo check
    acceptNewOrder(payload) {
        // const payload = {
        //     latitude: 43.2517502,
        //     segment_slug: 'TAXI',
        //     segment_id: null,
        //     driver_vehicle_id: 293,
        //     booking_order_id: 955,
        //     status: ACCEPT,
        //     longitude: 76.9351677
        // }
        return Axios.post(`${resource}/booking-order-accept-reject`, payload);
    },
    // todo check
    getOrderInfo(payload) {
        // const payload = {
        //     latitude: 43.2517502,
        //     segment_slug: 'TAXI',
        //     accuracy: 18.315,
        //     booking_order_id: 955,
        //     longitude: 76.9351677
        // }
        return Axios.post(`${resource}/booking-order-info`, payload);
    },
    // todo check
    arrivedAtPickUp(payload) {
        // const payload = {
        //     latitude: 43.2516982,
        //     segment_slug: "TAXI",
        //     accuracy: 17.905,
        //     booking_order_id: 955,
        //     longitude: 76.935167,
        // };
        return Axios.post(`${resource}/arrived-at-pickup`, payload);
    },

    // todo check
    startOrder(payload) {
        // const payload = {
        //     send_meter_image: null,
        //     send_meter_value: null,
        //     latitude: 43.2517137,
        //     segment_slug: `TAXI`,
        //     accuracy: 18.098,
        //     receiver_name: null,
        //     receiver_image: null,
        //     booking_order_id: 955,
        //     longitude: 76.9351785,
        //     receiver_otp: null
        // }
        return Axios.post(`${resource}/booking-order-picked`, payload);
    },

    // todo check
    finishOrder(payload) {
        // const payload = {
        //     booking_id: 956,
        //     send_meter_image: null,
        //     send_meter_value: null,
        //     manual_toll_charge: 0,
        //     latitude: 43.2517281,
        //     receiver_name: null,
        //     receiver_image: null,
        //     longitude: 76.9351839,
        //     receiver_otp: null
        // }
        return Axios.post(`${resource}/booking/end`, payload);
    },

    // todo check
    rateOrder(payload) {
        // const payload = {
        //     rating: 5.0,
        //     segment_slug: "TAXI",
        //     booking_order_id: 956,
        // };
        return Axios.post(`${resource}/complete-booking-order`, payload);
    },

    // todo check
    cancelOrder(payload) {
        // const payload = {
        //     latitude: 43.2516962,
        //     segment_slug: 'TAXI',
        //     accuracy: 17.975,
        //     segment_id: null,
        //     driver_vehicle_id: 293,
        //     booking_order_id: 957,
        //     status: 'REJECT',
        //     longitude: 76.9351888
        // }
        return Axios.post(`${resource}/booking-order-accept-reject`, payload);
    },
};
