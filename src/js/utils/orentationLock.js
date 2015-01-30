var orentationLocked = false;

function currentOrientation () {
	return window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation;
}

function orentationLock (orientation) {
	var lockOrientation = window.screen.lockOrientation || window.screen.mozLockOrientation || window.screen.msLockOrientation;
	if (orentationLocked) Promise.resolve();
	if (currentOrientation() === orientation) Promise.resolve();
	if (!lockOrientation && screen.orientation.lock) {
		return window.screen.orientation.lock(orientation);
	} else if (lockOrientation) {
		var res = screen.mozLockOrientation(orientation);
		return new Promise (function (resolve, reject) {
			setTimeout(function() {
				console.log(currentOrientation(), orientation);
				if (!res) return reject(orientation);
				if (currentOrientation() === orientation) resolve(orientation); else reject(orientation);
				orentationLocked = true;
			}, 0);
		});
	} else {
		return Promise.reject();
	}
}

module.exports = orentationLock;
