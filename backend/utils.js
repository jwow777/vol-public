module.exports.getConfirmCode = (length = 6, type = "number") => {
    let code = ""
    let possible

    if (type == "number"){
        possible = "0123456789"
    } else {
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    }

    for (let i = 0; i < length; i++)
        code += possible.charAt(Math.floor(Math.random() * possible.length))

    return code
}