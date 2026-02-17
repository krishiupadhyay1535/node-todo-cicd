const express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    sanitizer = require('sanitizer'),
    cookieParser = require('cookie-parser'),
    auth = require('./auth'),
    app = express(),
    port = 8000;

// ---------------- MIDDLEWARE ----------------
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());

// https://github.com/expressjs/method-override#custom-logic
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// ---------------- DATA ----------------
let todolist = [];

// ===== Root redirect (auth entry point) =====
app.get('/', (req, res) => {
    res.redirect('/admin');
});
// ==========================================


// ================= AUTH ROUTES =================
app.get('/auth/email', auth.emailPage);
app.post('/auth/email', auth.sendMagicLink);
app.get('/auth/verify', auth.verifyLink);

// Protected admin route
app.get('/admin', auth.requireAuth, (req, res) => {
    res.redirect('/todo');
});

// ==============================================


// ---------------- TODO ROUTES ----------------

/* The to do list and the form are displayed */
app.get('/todo', function (req, res) {
    res.render('todo.ejs', {
        todolist,
        clickHandler: "func1();"
    });
})

/* Adding an item to the to do list */
.post('/todo/add/', auth.requireAuth, function (req, res) {
    let newTodo = sanitizer.escape(req.body.newtodo);
    if (req.body.newtodo != '') {
        todolist.push(newTodo);
    }
    res.redirect('/todo');
})

/* Deletes an item from the to do list */
.get('/todo/delete/:id', auth.requireAuth, function (req, res) {
    if (req.params.id != '') {
        todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

/* Get a single todo item and render edit page */
.get('/todo/:id', auth.requireAuth, function (req, res) {
    let todoIdx = req.params.id;
    let todo = todolist[todoIdx];

    if (todo) {
        res.render('edititem.ejs', {
            todoIdx,
            todo,
            clickHandler: "func1();"
        });
    } else {
        res.redirect('/todo');
    }
})

/* Edit item in the todo list */
.put('/todo/edit/:id', auth.requireAuth, function (req, res) {
    let todoIdx = req.params.id;
    let editTodo = sanitizer.escape(req.body.editTodo);
    if (todoIdx != '' && editTodo != '') {
        todolist[todoIdx] = editTodo;
    }
    res.redirect('/todo');
})

/* Redirect if page not found */
.use(function (req, res) {
    res.redirect('/todo');
});

// ---------------- SERVER ----------------
app.listen(port, function () {
    console.log(`Todolist running on http://0.0.0.0:${port}`);
});

// Export app
module.exports = app;
