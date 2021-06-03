const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // if email includes admin we add admin role to user (for test purposes)
    const user = new User({
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        date: req.body.date,
        role: req.body.email == 'g.velchev12@gmail.com' || req.body.email.includes('admin') ? 'admin' : req.body.role ? req.body.role : 'user'
    })

    try {
        let result = await user.save()
        res.status(201).json({ message: 'User created successfully!', result });
    } catch (error) {
        if (error.errors.email.kind == 'unique') {
            res.status(500).json({ message: "This email address is already being used" });
            return;
        }
        res.status(500).json({ message: "Something went wrong! Please try again," });
    }
}

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {

            if (!user) {
                return res.status(404).json({
                    message: "User not found! Try again."
                })
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);

        }).then(isAuthenticated => {

            if (!isAuthenticated) {
                return res.status(401).json({
                    message: "Invalid authentication credentions!"
                })
            }

            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id, role: fetchedUser.role },
                process.env.JWT_KEY,
                { expiresIn: '1h' }
            )

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                currentUserRole: fetchedUser.role,
                userEmail: fetchedUser.email
            })

        }).catch(err => {

            return res.status(401).json({
                message: 'Invalid authentication credentions!'
            });

        })
}

exports.listUsers = async (req, res, next) => {
    // // req.role comes from check-auth.js file
    if (req.role != 'admin') {
        res.status(401).json({ message: "You are not authenticated to see users profiles!" });
        return;
    }
    try {
        let users = await User.find();
        users.forEach(u => { u.password = undefined }) 
        res.status(200).json({message: "Users fetched successfully!", users});
    } catch (err) {
        console.log(`Something went wrong: ${err.message}`);
    }
}

exports.disableUser = (req, res, next) => {

    // req.role comes from check-auth.js file
    if (req.role != 'admin') {
        res.status(401).json({ message: "You are not authenticated to disable users profiles!" });
        return;
    }

    User.findOne({ _id: req.body._id }).then(foundUser => {

        if (foundUser.hasAccess('admin')) {
            res.status(409).json({ message: "You can't disable an admin account!" });
            return;
        }

        if (foundUser.isDisabled) {
            res.status(409).json({ message: "This user is already disabled!" });
            return;
        }

        foundUser.isDisabled = true;

        User.updateOne({ _id: req.params.id }, foundUser).then(result => {
            res.status(200).json({ message: "You disabled user successfully!" });
        });
    });
}

exports.restoreUser = (req, res, next) => {

    // req.role comes from check-auth.js file
    if (req.role != 'admin') {
        res.status(401).json({ message: "You are not authenticated to restore users profiles!" });
        return;
    }

    User.findOne({ _id: req.body._id }).then(foundUser => {

        foundUser.isDisabled = false;

        User.updateOne({ _id: req.params.id }, foundUser).then(result => {
            res.status(200).json({ message: "You restored user successfully!" });
        });
    });
}

// TO DO ... потребителите, които са админи не могат да изтриват акаунтите на други админи - направи го така
exports.deleteUser = (req, res, next) => {

    if (req.params.id == req.userId) {

        User.deleteOne({ _id: req.params.id }).then(result => {
            res.status(200).json({ message: "You deleted you account successfully" });
        });

    } else {

        // req.role comes from check-auth.js file
        if (req.role != 'admin') {
            res.status(401).json({ message: "You are not authenticated to delete users profiles!" });
            return;
        }

        User.deleteOne({ _id: req.params.id }).then(result => {
            res.status(200).json({ message: "User deleted!" });
        });

    }


}

exports.getMyAccount = (req, res, next) => {
    User.findOne({ _id: req.userId }).then(currentUserAccount => {
        res.status(200).json({
            message: "My account",
            users: [currentUserAccount]
        });
    })
}

exports.changeNames = (req, res, next) => {
    User.findOne({ _id: req.userId }).then(currentUserAccount => {
        let updatedUser = currentUserAccount;
        updatedUser.firstName = req.body.firstName
        updatedUser.lastName = req.body.lastName

        User.updateOne({ _id: req.userId }, updatedUser).then(result => {
            res.status(200).json({ message: "You change your names successfully!" });
        });
    })
}