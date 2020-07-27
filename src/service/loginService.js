import instance from "../utils/instance";

class LoginService {
  async login(account, password) {
    return instance.post("/api/users/login", {
      account,
      password
    });
  }
}

export default new LoginService();
