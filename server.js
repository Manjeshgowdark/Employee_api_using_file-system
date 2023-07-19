const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const logEvents = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')

app.use(cors(corsOptions));

app.use((req,res,next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,
    'reqLog.txt')
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
app.use(express.json());

app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'))




app.use((req,res,next) => {
    console.log(`${req.method} ${req.path}`);
    next()
})







app.get('/*', (req,res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))