const API = {
    endpoint: "/auth/",
    // ADD HERE ALL THE OTHER API FUNCTIONS
    login: async (email) => {
        const response = await API.makePostRequest(API.endpoint + "login", {email});
        return response;
    },
    register: async (name) => {
        const response = await API.makePostRequest(API.endpoint + "register", {name});
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
