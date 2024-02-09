const express = require('express');
const router = express.Router();
const User = require('../Schema/user');

//[GET] /user/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const userInfor = await User.findOne({ id: id }).exec();

        if (!userInfor) {
            return res.status(404).json({ message: 'user not found' });
        }

        return res.status(200).json({
            message: 'Get user information successful',
            data: userInfor,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

//[POST] /user/add
router.post('/add', async (req, res) => {
    const { id, name, email, phone, address } = req.body;

    try {
        await User.insertMany([
            {
                id,
                name,
                phone,
                address,
                email,
            },
        ]);

        return res.status(200).json({
            status: true,
            message: 'User added successfully',
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
});

module.exports = router;
