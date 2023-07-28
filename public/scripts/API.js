const API = {
    endpoint: "/auth/",
    // ADD HERE ALL THE OTHER API FUNCTIONS
    login: async (user) => {
        const response = await API.makePostRequest(API.endpoint + "login", user);
        return response;
    },
    register: async (user) => {
        const response = await API.makePostRequest(API.endpoint + "register", user);
        return response;
    },
    loginFromGoogle: async (data) => {
        const response = await API.makePostRequest(API.endpoint + "login-google", data);
        return response;
    },
    makePostRequest: async (url, data) => {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

}

export default API;
