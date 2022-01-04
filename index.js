const NodeLoginout = require('node-loginout');
const stream = require('stream');

class NodeLoginoutLoginTransform extends stream.Transform {
	constructor(options, httpsOptions, app, user, pwd, loginResult) {
		super(options);
		this.httpsOptions = httpsOptions;
		this.app = app;
		this.user = user;
		this.pwd = pwd;
		this.loginResult = loginResult;
	}

	_transform(file, encoding, callback) {
		const httpsOptions = typeof this.httpsOptions === 'function' ? this.httpsOptions(file, encoding) : this.httpsOptions;
		const app = typeof this.app === 'function' ? this.app(file, encoding) : this.app;
		const user = typeof this.user === 'function' ? this.user(file, encoding) : this.user;
		const pwd = typeof this.pwd === 'function' ? this.pwd(file, encoding) : this.pwd;
		const loginResult = typeof this.loginResult === 'function' ? this.loginResult(file, encoding) : this.loginResult;

		NodeLoginout.login(httpsOptions, app, user, pwd).then((result) => {
			Object.assign(loginResult, result);
			callback(null, file);
		}, (error) => {
			callback(error, file);
		});
	}
}

function login(httpsOptions, app, user, pwd, loginResult) {
	return new NodeLoginoutLoginTransform({ objectMode: true }, httpsOptions, app, user, pwd, loginResult);
}

class NodeLoginoutVerifyTransform extends stream.Transform {
	constructor(options, httpsOptions, loginResult) {
		super(options);
		this.httpsOptions = httpsOptions;
		this.loginResult = loginResult;
	}

	_transform(file, encoding, callback) {
		const httpsOptions = typeof this.httpsOptions === 'function' ? this.httpsOptions(file, encoding) : this.httpsOptions;
		const loginResult = typeof this.loginResult === 'function' ? this.loginResult(file, encoding) : this.loginResult;

		NodeLoginout.verify(httpsOptions, loginResult).then((result) => {
			Object.assign(loginResult, result);
			callback(null, file);
		}, (error) => {
			callback(error, file);
		});
	}
}

function verify(httpsOptions, loginResult) {
	return new NodeLoginoutVerifyTransform({ objectMode: true }, httpsOptions, loginResult);
}

class NodeLoginoutLogoutTransform extends stream.Transform {
	constructor(options, httpsOptions, loginResult) {
		super(options);
		this.httpsOptions = httpsOptions;
		this.loginResult = loginResult;
	}

	_transform(file, encoding, callback) {
		const httpsOptions = typeof this.httpsOptions === 'function' ? this.httpsOptions(file, encoding) : this.httpsOptions;
		const loginResult = typeof this.loginResult === 'function' ? this.loginResult(file, encoding) : this.loginResult;

		NodeLoginout.logout(httpsOptions, loginResult).then(() => {
			for (let key in loginResult) {
				delete loginResult[key];
			}
			callback(null, file);
		}, (error) => {
			callback(error, file);
		});
	}
}

function logout(httpsOptions, loginResult) {
	return new NodeLoginoutLogoutTransform({ objectMode: true }, httpsOptions, loginResult);
}

class NodeLoginoutPromptTransform extends stream.Transform {
	constructor(options, fileName, httpsOptions, app, loginResult) {
		super(options);
		this.fileName = fileName;
		this.httpsOptions = httpsOptions;
		this.app = app;
		this.loginResult = loginResult;
	}

	_transform(file, encoding, callback) {
		const fileName = typeof this.fileName === 'function' ? this.fileName(file, encoding) : this.fileName;
		const httpsOptions = typeof this.httpsOptions === 'function' ? this.httpsOptions(file, encoding) : this.httpsOptions;
		const app = typeof this.app === 'function' ? this.app(file, encoding) : this.app;
		const loginResult = typeof this.loginResult === 'function' ? this.loginResult(file, encoding) : this.loginResult;

		NodeLoginout.prompt(fileName, httpsOptions, app).then((result) => {
			Object.assign(loginResult, result);
			callback(null, file);
		}, (error) => {
			console.log('ERROR');
			callback(error, file);
		});
	}
}

function prompt(fileName, httpsOptions, app, loginResult) {
	return new NodeLoginoutPromptTransform({ objectMode: true }, fileName, httpsOptions, app, loginResult);
}

module.exports = {
	login,
	verify,
	logout,
	prompt
};
