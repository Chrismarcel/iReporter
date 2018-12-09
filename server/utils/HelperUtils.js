import bcrypt from 'bcrypt';

class HelperUtils {
  static validate() {
    return {
      name: /^[a-zA-Z]+$/,
      email: /^([A-z0-9-_.]+)@([A-z0-9-_.]+)\.([A-z]{2,3})$/,
      phonenumber: /^\+[0-9]{13}$|^[0-9]{11}$/,
      location: /^([0-9]+)[.]([0-9]+)$/,
      username: /^([0-9]|[A-z]|[.\-_])+$/,
    };
  }

  static hashPassword(str) {
    const hashPassword = bcrypt;
    return hashPassword(str);
  }
}

export default HelperUtils;
