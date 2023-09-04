import { useI18n } from "vue-i18n";

const i18n = useI18n();

export default [
    {
        id: 0,
        title: i18n.t("econom"),
        image: "cheap.png",
        price: "600",
    }, {
        id: 1,
        title: i18n.t("comfort"),
        image: "comfort.png",
        price: "600",
    }, {
        id: 2,
        title: i18n.t("business"),
        image: "business.png",
        price: "900",
    }, {
        id: 3,
        title: i18n.t("business_plus"),
        image: "business-plus.png",
        price: "1200",
    }, {
        id: 4,
        title: i18n.t("taxi_lady"),
        image: "lady.png",
        price: "1400",
    }, {
        id: 5,
        title: i18n.t("minivan"),
        image: "van.png",
        price: "1400",
    }, {
        id: 6,
        title: i18n.t("helicopter"),
        image: "helicopter.png",
        price: "1000000",
    },
];
