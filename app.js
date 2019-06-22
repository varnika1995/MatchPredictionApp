const express = require('express');
const morgan = require('morgan');
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { celebrate, Joi, errors } = require('celebrate')

const app = express()

app.use(morgan('dev'))
app.use(bodyParser())
app.use(bodyParser.urlencoded({ extended: true }));

const Match = require('./models/Match');
const User = require('./models/User');

const URI = "mongodb://localhost:27017/match-prediction"

//connectiv
mongoose.connect(URI, { useNewUrlParser: true })
    .then(() => {
        console.log("db connected")
    }).catch((error) => {
        console.log('error:', error)
        process.exit(1)
    })

//add match
app.post('/addMatch', celebrate({
    body: Joi.object().keys({
        matchNo: Joi.string().required(),
        teams: Joi.array().items().optional()
    })
}), (req, res) => {

    try {
        console.log('1111111')
        Match.create(req.body, (err, data) => {
            if (err) {
                console.log('22222')
                res.status(200).json({
                    statusCode: 400,
                    message: "somthing went wrong",
                })
            }

            return res.status(200).json({
                statusCode: 200,
                message: "sucess",
                data: data
            })
        })
    } catch (err) {
        console.error(err)
        res.status(200).json({
            statusCode: 400,
            message: "somthing is going wrong"
        })

    }

})


//update vote

app.put('/updateVote/:id/:teamName', celebrate({
    body: Joi.object().keys({
        matchNo: Joi.string().optional(),
        teams: Joi.array().items().optional()
    })
}), (req, res) => {

    try {
        User.findOne({ email: req.body.email }, (err, data) => {
            if (data.email === req.body.email) {
                           console.log('333333')
                Match.updateOne({
                    _id: mongodb.ObjectID(req.params.id),
                    "teams.name": req.params.teamName
                },

                    {
                        $inc: { "teams.$.vote": 1 }
                    },

                    (error, data1) => {
                        if (error) {
                            res.status(200).json({
                                statusCode: 400,
                                message: "user not found",


                            })
                        }
                        return res.status(200).json({
                            statusCode: 200,
                            message: "sucess",
                            data: data
                        })
                    })

            } else {

                console.log("does not exits");
                return res.contentType('json').json({
                    statusCode: 500,
                    message: "does not exist"
                })
            }
        })


        /* console.log('111000')
         Match.updateOne({
             _id: mongodb.ObjectID(req.params.id),
             "teams.name": req.params.teamName
         },
 
             {
                 $inc: { "teams.$.vote": 1 }
             },
 
             (error, data) => {
                 if (error) {
                     res.status(200).json({
                         statusCode: 400,
                         message: "user not found",
 
 
                     })
                 }
                 return res.status(200).json({
                     statusCode: 200,
                     message: "sucess",
                     data: data
                 })
             })*/

    } catch (err) {
        console.error(err)
        res.status(200).json({
            statusCode: 400,
            message: "somthing is going wrong"
        })

    }

})



//sign up
app.post('/test', celebrate({
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        contact: Joi.string().required(),
    })
}), (req, res) => {
    try {
        console.log('0000000')
        User.create(req.body, (err, data) => {
            console.log('111111111')

            if (err) {
                console.log('222222222')
                res.status(200).json({
                    statusCode: 400,
                    message: "Something went wrong",
                    data: {}
                });
            }
            res.status(200).json({
                statusCode: 201,
                message: "Success",
                data: data
            })
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            statusCode: 400,
            message: "Something went wrong",
            data: {}
        })
    }
})


//sign in

app.post('/signIn', celebrate({
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),

    })
}), (req, res) => {
    try {
        console.log('0000000')
        User.findOne({ email: req.body.email }, (err, data) => {
            console.log('0000000')
            console.log(data)
            console.log(data.email)
            if (data === null) {
                console.log('111111')
                return res.contentType('json').json({
                    statusCode: 400,
                    message: "login invalid"
                })

            } else if (data.email === req.body.email && data.password === req.body.password) {
                console.log('333333')
                return res.contentType('json').json({
                    statusCode: 200,
                    message: "login sucessful",
                    data: data
                })

            } else {

                console.log("Credentials wrong");
                return res.contentType('json').json({
                    statusCode: 500,
                    message: "login invalid"
                })
            }
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            statusCode: 400,
            message: "Something went wrong",
            data: {}
        })
    }
})


app.use(errors());

//when no router found
app.use((req, res, next) => {
    next("no router found")
})

//error handler
app.use((err, req, res, next) => {

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {}
})


app.listen(3000, () => {
    console.log('server is running @ 3000')
})