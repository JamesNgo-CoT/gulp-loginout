const del = require('del');
const dotenv = require('dotenv');
const gulp = require('gulp');

const gulpLoginout = require('./index');

dotenv.config();

const httpsOptions = {
	host: process.env.BASE_HOST,
	path: process.env.BASE_PATH
};

const loginResult = {};

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

function clean() {
	return del('dist');
}

function prompt() {
	return gulp.src('./test/*')
		.pipe(gulpLoginout.prompt('.login.json', httpsOptions, 'app', loginResult))
		.pipe(gulpLoginout.prompt('.login.json', httpsOptions, 'app', loginResult))
		.pipe(gulpLoginout.verify(httpsOptions, loginResult))
		.pipe(gulpLoginout.logout(httpsOptions, loginResult))
		.pipe(gulp.dest('dist'));
}

module.exports = {
	test: gulp.series(clean, prompt)
};
