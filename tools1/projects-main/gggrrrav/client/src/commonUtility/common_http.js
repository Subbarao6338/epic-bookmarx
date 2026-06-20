import Axios from 'axios'
import { loadProgressBar } from 'axios-progress-bar'
import { add_notifications_url, tenant_id } from './api_urls'

const HOST_URL = 'http://localhost:8000/'
    // const HOST_URL = 'http://3.37.130.44:8080/'
    // const HOST_URL = 'http://20.44.51.55:8088/'
    // function get_host_url() {
    //   let api_url = window.location.protocol + "//" + window.location.host + "/";
    //   return api_url;
    // }
    // const HOST_URL = get_host_url();
const headers = { headers: { 'Content-Type': 'application/json' } }

export function httpget(GET_URL, req_value) {
    //var spinner = document.getElementById("loader");
    //spinner.classList.remove("hidden");
    loadProgressBar()
    console.log(GET_URL)
    return new Promise((resolve) => {
        Axios.get(HOST_URL + GET_URL, req_value, headers)
            .then((response) => {
                if (response.data !== 'Failure') {
                    resolve(response.data)
                        //spinner.classList.add("hidden");
                }
            })
            .catch((Servers) => {
                console.log(Servers)
                window.location = '/internal_server_error'
            })
    })
}

export function httpget_notification(GET_URL, req_value) {
    return new Promise((resolve) => {
        Axios.get(HOST_URL + GET_URL, req_value, headers)
            .then((response) => {
                if (response.data !== 'Failure') {
                    resolve(response.data)
                }
            })
            .catch((Servers) => {
                console.log(Servers)
                window.location = '/internal_server_error'
            })
    })
}

export function httppost(POST_URL, req_value) {
    //var spinner = document.getElementById("loader");
    //spinner.classList.remove("hidden");
    loadProgressBar()
    return new Promise((resolve) => {
        Axios.post(HOST_URL + POST_URL, req_value, headers)
            .then((response) => {
                console.log(response.data)
                resolve(response)
                    //spinner.classList.add("hidden");
            })
            .catch((Servers) => {
                console.log(Servers)
                window.location = '/internal_server_error'
            })
    })
}

export function httpput(PUT_URL, req_value) {
    //var spinner = document.getElementById("loader");
    //spinner.classList.remove("hidden");
    loadProgressBar()
    return new Promise((resolve) => {
        Axios.put(HOST_URL + PUT_URL, req_value, headers)
            .then((response) => {
                console.log(response.data)
                resolve(response)
                    //spinner.classList.add("hidden");
            })
            .catch((Servers) => {
                console.log(Servers)
                window.location = '/internal_server_error'
            })
    })
}

export function httpdelete(DELETE_URL, req_value) {
    //var spinner = document.getElementById("loader");
    //spinner.classList.remove("hidden");
    loadProgressBar()
    return new Promise((resolve) => {
        Axios.delete(HOST_URL + DELETE_URL, req_value, headers)
            .then((response) => {
                console.log(response.data)
                resolve(response)
                    //spinner.classList.add("hidden");
            })
            .catch((Servers) => {
                console.log(Servers)
                window.location = '/internal_server_error'
            })
    })
}

export function addnew_notifications(
    user_name,
    email_id,
    page_name,
    alert_type,
    alert_msg,
) {
    const req_value = {
        params: {
            user_name: user_name,
            email_id: email_id,
            page_name: page_name,
            alert_type: alert_type,
            alert_msg: alert_msg,
            tenant_id: tenant_id,
        },
    }
    httppost(add_notifications_url, req_value)
    localStorage.setItem('notification_check', true)
}