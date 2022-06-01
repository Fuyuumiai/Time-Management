const Intent = plus.android.importClass("android.content.Intent");
const Settings = plus.android.importClass("android.provider.Settings");
const Uri = plus.android.importClass("android.net.Uri");

const main = plus.android.runtimeMainActivity();

// 打开位置设置页面
function gotoAppLocationSetting(){
	let intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
	main.startActivity(intent)
}

// 打开应用设置界面
function gotoAppPermissionSetting(){
	let intent = new Intent()
	intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
	let uri = Uri.fromParts("package", main.getPackageName(), null);
	intent.setData(uri);
	main.startActivity(intent)
}

// 判断应用是否开启权限
function getLocationJurisdiction() {
	console.log(1)
	plus.android.requestPermissions(['android.permission.ACCESS_FINE_LOCATION'], function(e) {
		console.log(e)
			// 权限被允许
		if (e.granted.length > 0) {
					resolve()
		} else {
				// 权限被临时拒绝
			if (e.deniedPresent.length > 0) {
					// getCalendarJurisdiction()
				// 权限被永久拒绝
			} else if (e.deniedAlways.length > 0) {
					gotoAppPermissionSetting()
			}
		}
	})
}

export {
	gotoAppLocationSetting,
	getLocationJurisdiction
}