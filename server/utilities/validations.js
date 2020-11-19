module.exports.validateEmail = email => {
    const validation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.trim().length === 0)
        return ("Please enter your email");
    else if (!validation.test(email.trim()))
        return ('Invalid email address');
    return ('');
}

module.exports.validatePassword = (password, confirm) => {
    const validation = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z\d]{8,})$/;
    if (!password || !confirm)
        return ("Please fill in all fields");
    else if (password.trim().length < 8)
        return ("Invalid password, must be 8 characters or longer");
    else if (!validation.test(password.trim()))
        return ('Invalid password, must contain atleast one upppercase, lowercase and a number');
    else if (password.trim() !== confirm.trim())
        return ("Confirmation password does not match")
    return (null);
}
