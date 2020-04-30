require("./bootstrap");

window.Vue = require("vue");

import { Form, HasError, AlertError } from "vform";
import moment from "moment";

import Swal from "sweetalert2";
window.Swal = Swal;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
});
window.Toast = Toast;

import VueRouter from "vue-router";
Vue.use(VueRouter);

import VueProgressBar from "vue-progressbar";
Vue.use(VueProgressBar, {
    color: "rgb(143,255,199)",
    failedColor: "red",
    height: "2px"
});

window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

let routes = [
    {
        path: "/dashboard",
        component: require("./components/Dashboard.vue").default
    },
    { path: "/users", component: require("./components/Users.vue").default },
    { path: "/profile", component: require("./components/Profile.vue").default }
];

const router = new VueRouter({
    mode: "history",
    routes
});

Vue.filter("capitalize", function(str) {
    if (!str) return "";
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
});

Vue.filter("formattedDate", function(date) {
    return moment(date).format("MMMM Do YYYY");
});

window.Fire = new Vue({});

Vue.component(
    "example-component",
    require("./components/ExampleComponent.vue").default
);

const app = new Vue({
    router,
    el: "#app"
});
