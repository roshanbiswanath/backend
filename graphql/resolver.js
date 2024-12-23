const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const House = require('../models/House');

const SECRET_KEY = 'key';

module.exports = {
  Query: {
    getHouses: async () => await House.find(),
    getHouseById: async (_, { houseId }) => await House.findById(houseId),
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ username, email, password: hashedPassword });
      
      const savedUser = await user.save();
      const token = jwt.sign({ id: savedUser.id, email: savedUser.email }, SECRET_KEY, { expiresIn: '1h' });
      return {id:savedUser._id, ...savedUser._doc, token };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error('Incorrect password');
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
      return { ...user._doc, token };
    },
    addHouse: async (_, { title, description, price, location, houseType, images }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      const house = new House({
        title,
        description,
        price,
        location,
        houseType,
        images,
        owner: context.user.id,
      });
      return await house.save();
    },
  },
};
