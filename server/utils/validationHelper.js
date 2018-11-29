const validate = {
  id: /^[1-9]{1,}/,
  name: /^[a-zA-Z]+$/,
  email: /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/,
  phoneNumber: /^[0-9]{8,15}/,
  location: /^([0-9]+)[.]([0-9]+)$/,
};

export default validate;
