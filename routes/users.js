var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

app.get('/', function (req, res, next) {
	req.db.collection('users').find().sort({ "_id": -1 }).toArray(function (err, result) {

		if (err) {
			req.flash('error', err)
			res.render('user/list', {
				title: 'User List',
				data: ''
			})
		} else {

			res.render('user/list', {
				title: 'User List',
				data: result
			})
		}
	})
})


app.get('/add', function (req, res, next) {

	res.render('user/add', {
		title: 'Add New User',
		name: '',
		age: '',
		email: ''
	})
})


app.post('/add', function (req, res, next) {
	req.assert('name', 'Name is required').notEmpty()
	req.assert('age', 'Age is required').notEmpty()
	req.assert('email', 'A valid email is required').isEmail()

	var errors = req.validationErrors()

	if (!errors) {
		var user = {
			name: req.sanitize('name').escape().trim(),
			age: req.sanitize('age').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}

		req.db.collection('users').insert(user, function (err, result) {
			if (err) {
				req.flash('error', err)


				res.render('user/add', {
					title: 'Add New User',
					name: user.name,
					age: user.age,
					email: user.email
				})
			} else {
				req.flash('success', 'Data added successfully!')


				res.redirect('/users')


			}
		})
	}
	else {
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		res.render('user/add', {
			title: 'Add New User',
			name: req.body.name,
			age: req.body.age,
			email: req.body.email
		})
	}
})

app.get('/edit/(:id)', function (req, res, next) {
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').find({ "_id": o_id }).toArray(function (err, result) {
		if (err) return console.log(err)

		if (!result) {
			req.flash('error', 'User not found with id = ' + req.params.id)
			res.redirect('/users')
		}
		else {
			res.render('user/edit', {
				title: 'Edit User',

				id: result[0]._id,
				name: result[0].name,
				age: result[0].age,
				email: result[0].email
			})
		}
	})
})


app.put('/edit/(:id)', function (req, res, next) {
	req.assert('name', 'Name is required').notEmpty()
	req.assert('age', 'Age is required').notEmpty()
	req.assert('email', 'A valid email is required').isEmail()

	var errors = req.validationErrors()

	if (!errors) {
		var user = {
			name: req.sanitize('name').escape().trim(),
			age: req.sanitize('age').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}

		var o_id = new ObjectId(req.params.id)
		req.db.collection('users').update({ "_id": o_id }, user, function (err, result) {
			if (err) {
				req.flash('error', err)

				res.render('user/edit', {
					title: 'Edit User',
					id: req.params.id,
					name: req.body.name,
					age: req.body.age,
					email: req.body.email
				})
			} else {
				req.flash('success', 'Data updated successfully!')

				res.redirect('/users')

			}
		})
	}
	else {
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)


		res.render('user/edit', {
			title: 'Edit User',
			id: req.params.id,
			name: req.body.name,
			age: req.body.age,
			email: req.body.email
		})
	}
})


app.delete('/delete/(:id)', function (req, res, next) {
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').remove({ "_id": o_id }, function (err, result) {
		if (err) {
			req.flash('error', err)
			res.redirect('/users')
		} else {
			req.flash('success', 'User deleted successfully! id = ' + req.params.id)
			res.redirect('/users')
		}
	})
})



module.exports = app
