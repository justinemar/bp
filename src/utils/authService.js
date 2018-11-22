import decode from 'jwt-decode';

export default class AuthService {
    // Initializing important variables
    constructor() {
        this.fetch = this.fetch.bind(this); // React binding stuff
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    login(email, password) {
        return this.fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
            }),
        })
          .then((res) => {
            if (res.code === 200) {
                this.setToken(res.token); // Setting the token in localStorage
                return Promise.resolve(res);
            } else if (res.code === 403) {
                return Promise.reject(res);
            }
        });
    }

    verifyEmail(email) {
        return (
        fetch(`/register/resend/${email}`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then((res) => {
            if (res.code === 200) {
                return Promise.resolve(res);
            } else {
                return Promise.reject(res);
            }
        })
        );
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken(); // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token); // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            } else { return false; }
        } catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }


    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            Accept: 'application/json',
        };

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        headers.Authorization = `Bearer ${this.getToken()}`;


        return fetch(url, {
            headers,
            ...options,
        }).then(response => response.json());
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.code >= 200 && response.code < 300) { // Success status lies between 200 to 300
            return response;
        } else {
            const error = new Error(response.statusText);
            error.response = response;
            return false;
        }
    }
}
