const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hashedPassword => {

        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            date: req.body.date,
            role: req.body.email == 'g.velchev12@gmail.com' ? 'admin' : req.body.role ? req.body.role : 'user'
        })

        // // The string passed in is an access level
        // console.log(user.hasAccess('public')) // true
        // console.log(user.hasAccess('anon')) // false
        // console.log(user.hasAccess('user')) // true
        // console.log(user.hasAccess('admin')) // false
        // console.log(user.hasAccess(['public', 'user'])) // true
        // console.log(user.hasAccess(['public', 'anon'])) // false (because the user isn't a part of 'anon' access level)
        user.save()
            .then(result => {
                res.status(201).json({ message: 'User created successfully!', result: result })
            }).catch(error => {
                console.log(error);
                if (error.errors.email.kind == 'unique') {
                    res.status(500).json({ message: "This email address is already being used" })
                } else {
                    res.status(500).json({ message: "Something went wrong! Please try again," })
                }
            })
    })
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

exports.listUsers = (req, res, next) => {

    // // req.role comes from check-auth.js file
    if (!new User({ role: req.role }).hasAccess('admin')) {
        res.status(401).json({ message: "You are not authenticated to see users profiles!" });
        return;
    }

    User.find().then(users => {

        users.forEach(el => {
            el['password'] = undefined;
        })

        res.status(200).json({
            message: "Courses fetched successfully!",
            users: users
        });
    });
}

exports.disableUser = (req, res, next) => {

    // req.role comes from check-auth.js file
    if (!new User({ role: req.role }).hasAccess('admin')) {
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
    if (!new User({ role: req.role }).hasAccess('admin')) {
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
exports.deleteUser = (req, res, next) => {

    if (req.params.id == req.userId) {

        User.deleteOne({ _id: req.params.id }).then(result => {
            res.status(200).json({ message: "You deleted you account successfully" });
        });

    } else {

        // req.role comes from check-auth.js file
        if (!new User({ role: req.role }).hasAccess('admin')) {
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



// //set a reference to the request module
// let request = require('request');
// //create an object to send as POST data

// //the config for our HTTP POST request
// let postConfig = {
//     url: 'http://localhost:5500/api/knowledgebridge/user/signup',
//     form: {
//         'email': '123@test.com',
//         'password': '123',
//         'firstName': 'Georgi',
//         'lastName': 'Velchev',
//         'date': '25/03/2021',
//         'role': 'admin'
//     }
// };

// //the HTTP POST request success handler
// let postSuccessHandler = function (err, httpResponse, body) {
//     //look for this message in your JS console:
//     console.log('JSON response from the server: ' + body);
// };

// //make the POST request
// request.post(postConfig, postSuccessHandler);




// LOGIN 

// //set a reference to the request module
// let request = require('request');
// //create an object to send as POST data

// //the config for our HTTP POST request
// let postConfig = {
//     url: 'http://localhost:5500/api/knowledgebridge/user/login',
//     form: {
//         'email': '123@test.com',
//         'password': '123',
//     }
// };

// //the HTTP POST request success handler
// let postSuccessHandler = function (err, httpResponse, body) {
//     //look for this message in your JS console:
//     console.log('JSON response from the server: ' + body);
// };

// //make the POST request
// request.post(postConfig, postSuccessHandler);
