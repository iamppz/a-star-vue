import instance from '../utils/axios';

class LoginService {
    async login(account, password) {
        return await instance.post('/api/account/login', {
            account,
            password
        });
    }
}

export default new LoginService();