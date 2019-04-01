import instance from '../utils/instance';

class LoginService {
    async login(account, password) {
        return await instance.post('/api/account/login', {
            account,
            password
        });
    }
}

export default new LoginService();