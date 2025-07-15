class Validator {

     static validateUserRegistration(params) {

          const { username, email, password } = params;
          const errors = [];

          if (!username || username.length < 3 || username.length > 30) {
               errors.push('Invalid username');
          }

          if (!email || !/\S+@\S+\.\S+/.test(email)) {
               errors.push('Invalid email');
          }

          if (!password || password.length < 6) {
               errors.push('Invalid password');
          }

          return errors;
     }
}

module.exports = Validator;