import moment from 'moment'

export default {
	uppercase (str) {
		return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
	},
	normalcase (str) {
		if (!str) {
			return ''
		}
		var s = str.toLowerCase()
		return s.charAt(0).toUpperCase() + s.slice(1)
	},
	fromnow (time) {
		if (time) {
			return moment(time).fromNow()
		} else {
			return '';
		}
	},
	dateFormat (time, format) {
		format = format || 'MMM YYYY'
		if (time) {
			return moment(time).format(format)
		} else {
			return '';
		}
	}
}
