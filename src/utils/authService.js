import decode from 'jwt-decode';

export default class AuthService {
    // Initializing important variables
    constructor() {
        this.fetch = this.fetch.bind(this); // React binding stuff
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.processResponse = this.processResponse.bind(this);
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

    processResponse(response) {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]).then(res => ({
          statusCode: res[0],
          data: res[1],
        }));
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
}
