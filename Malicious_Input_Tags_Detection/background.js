const auth_list = ["username", "user", "user_name", "login", "userId", "email", "userEmail", "password", "pass", "pwd", "current_password", "new_password", "confirm_password", "passwd", "passwordConfirm", "pass_confirm", "secret", "master_password", "masterPass"];





if(auth_list.forEach(tag => tag === "new_password")){
    console.log("we have a match!");
} else {
    console.log("Didn't work, let's try again!")
}
