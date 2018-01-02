export default{
    double_reg(n){
        var reg = /^[1-9]{1}[0-9]*(?:\.[0-9]{1,2})?$|^0\.[0-9]{1,2}$/;
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入正整数或至多2位小数正整数'));
            }
            if (String(value).length > n) {
                return callback(new Error('长度为1-' + n + '位'));
            }
            callback();
        }
    },
    unsigned_int_reg(n) {
        var reg = new RegExp('^' + '\\d{1,' + n + '}' + '$');
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入1-' + n + '位正整数'));
            }
            callback();
        }
    },
    signed_int_reg(n) {
        var reg = new RegExp('^' + '-?\\d{1,' + n + '}' + '$');
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入1-' + n + '位整数'));
            }
            callback();
        }
    },
    telephone_reg() {
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入正确的手机号码'));
            }
            callback();
        }
    },
    phone_reg() {
        var reg = /^[1][3,4,5,7,8][0-9]{9}$|^(?:0[0-9]{2,3}-)?[2-9][0-9]{7}(?:-[0-9]{1,4})?$/;
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入正确的电话号码'));
            }
            callback();
        }
    },
    email_reg() {
        var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入正确的邮箱'));
            }
            callback();
        }
    },
    checkbox_empty() {
        return (rule, value, callback) => {
            if (!value[0]) {
                return callback(new Error('请选择'));
            }
            callback();
        }
    }
}