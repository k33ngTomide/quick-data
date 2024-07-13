const bcrypt = require('bcryptjs');
const User = require('../models/User');

const initializeAdmin = async () => {
    try {
        let admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            const adminData = {
                name: 'QuickAdmin',
                email: 'quickadmin@gmail.com',
                password: 'Quick_Admin',
                role: 'admin'
            };

            const salt = await bcrypt.genSalt(10);
            adminData.password = await bcrypt.hash(adminData.password, salt);

            admin = new User(adminData);
            await admin.save();

            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error(err.message);
    }
};

module.exports = initializeAdmin;
