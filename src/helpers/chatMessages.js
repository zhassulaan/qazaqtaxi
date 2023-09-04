import { useI18n } from "vue-i18n";

const i18n = useI18n();

export default [
    {
        id: 0,
        sender: 'DRIVER',
        message: i18n.t("message1"),
        timestamp: 0,
    }, {
        id: 1,
        sender: 'DRIVER',
        message: i18n.t("message2"),
        timestamp: 1,
    }, {
        id: 2,
        sender: 'USER',
        message: i18n.t("message3"),
        timestamp: 2,
    }, {
        id: 3,
        sender: 'DRIVER',
        message: i18n.t("message4"),
        timestamp: 3,
    },
];
