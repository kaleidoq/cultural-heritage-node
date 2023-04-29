const {
    CODE_ERROR,
    CODE_SUCCESS
} = require('./constant.js')

class Result {
    constructor(data, msg = '操作成功', options) {
        this.data = null
        if (arguments.length === 0) {
            this.msg = '操作成功'
        } else if (arguments.length === 1) {
            this.msg = data
        } else {
            this.data = data
            this.msg = msg
            if (options) {
                this.options = options
            }
        }
    }

    createResult() {
        if (!this.code) {
            this.code = CODE_SUCCESS
        }
        let base = {
            code: this.code,
            msg: this.msg
        }
        if (this.data) {
            base.data = this.data
        }
        if (this.options) {
            base = { ...base, ...this.options }
        }
        // console.log(base, 'base')
        console.log(base.code, base.msg, 'base.msg')
        return base
    }

    json(res) {
        // console.log(res, 'res');
        res.json(this.createResult())
    }

    success(res) {
        this.code = CODE_SUCCESS
        this.json(res)
    }

    message(res) {
        this.code = CODE_SUCCESS
        this.data = this.msg
        this.json(res)
    }

    // fail(res) {
    //     this.code = CODE_ERROR
    //     this.json(res)
    // }

    fail(code, res) {
        this.code = code
        this.data = this.msg
        res.status(code);
        this.json(res)
    }
}

module.exports = Result