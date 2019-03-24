import instance from '../utils/axios';

class LoginService {
    async login(enterprise, account, password) {
        return await instance.post('/crm/login/', {
            enterpriseName: enterprise,
            txtUsername: account,
            txtPassword: password
        });
    }
}

export default new LoginService();