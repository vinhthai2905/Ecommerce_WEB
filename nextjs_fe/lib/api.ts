import axios from 'axios';
import { getCookie } from 'cookies-next';

class ApiCustom {
    private getInstance() {
        const instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        instance.interceptors.request.use(
            (config) => {
                // Auth token bearer
                const token = getCookie('token');

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => {
                // Handle request error here
                return Promise.reject(error);
            }
        );

        instance.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Clear the token from local storage
                    localStorage.removeItem('token');

                    // Redirect to login page or logout the user
                    // This depends on your application's logic
                    // For example, you can use window.location.href = '/login'; for a simple redirect to the login page
                }

                return Promise.reject(error);
            }
        );

        return instance;
    }

    public async getFromServer({
        endpoint,
        params,
        headers,
    }: {
        endpoint: string;
        params?: any;
        headers?: any;
    }) {
        return await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            ...params,
        });
    }

    public async postToServer({
        endpoint,
        data,
        headers,
    }: {
        endpoint: string;
        data: any;
        headers?: any;
    }) {
        return await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(data),
        });
    }

    public async putToServer({
        endpoint,
        data,
        headers,
    }: {
        endpoint: string;
        data: any;
        headers?: any;
    }) {
        return await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(data),
        });
    }

    public async deleteToServer({
        endpoint,
        headers,
    }: {
        endpoint: string;
        headers?: any;
    }) {
        return await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
    }

    // set up axios
    public async getFromServerAxios({
        endpoint,
        params,
        headers,
    }: {
        endpoint: string;
        params?: any;
        headers?: any;
    }) {
        return await this.getInstance().get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            params: params,
        });
    }

    public async postToServerAxios({
        endpoint,
        data,
        headers,
    }: {
        endpoint: string;
        data?: any;
        headers?: any;
    }) {
        return await this.getInstance().post(endpoint, data, {
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
    }

    public async putToServerAxios({
        endpoint,
        data,
        headers,
    }: {
        endpoint: string;
        data: any;
        headers?: any;
    }) {
        return await this.getInstance().put(endpoint, data, {
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
    }

    public async deleteToServerAxios({
        endpoint,
        headers,
    }: {
        endpoint: string;
        headers?: any;
    }) {
        return await this.getInstance().delete(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
    }

    public async fetchDataSearchAndPagination({
        q,
        page,
        endpoint,
    }: {
        q: string | null;
        page: string | null;
        endpoint: string;
    }) {
        try {
            const params: {
                q?: string;
                page?: string;
            } = {};

            if (q) {
                params.q = q;
            }
            if (page) {
                params.page = page;
            }

            const res = await this.getFromServerAxios({
                endpoint: endpoint,
                params: params,
            });

            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    public async fetchAllData({ endpoint }: { endpoint: string }) {
        try {
            const params: {
                all: boolean;
            } = {
                all: true,
            };

            const res = await this.getFromServerAxios({
                endpoint: endpoint,
                params: params,
            });

            return res.data;
        } catch (err) {
            console.log(err);
        }
    }
}

export default new ApiCustom();