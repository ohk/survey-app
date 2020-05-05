const sendHttpRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/json')

        xhr.withCredentials = false
        xhr.onload = () => {
            resolve(xhr.response)
        }
        xhr.send(JSON.stringify(data))
    })
    return promise
}

//bootstrapToggle("state", true);
function setCookie(cname, cvalue, exdays) {
    var d = new Date()
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
    var expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

function login1() {
    setCookie('token', '', 1)
    var email = $('#email').val(),
        password = $('#password').val()
    data = {}
    data['email'] = email
    data['password'] = password
    console.log(data)

    sendHttpRequest('POST', 'https://ytuce-sab.herokuapp.com/api/user/login', data).then((response) => {
        setCookie('token', response.token, 1)
        console.log(getCookie('token').length)
    })
    setTimeout(function () {
        if (getCookie('token').length > 25) {
            console.log('içerideyim.')
            document.location = 'profile.html'
        } else {
            alert('invalid credits')
        }
    }, 3000)
}

register = function () {
    data = {}
    var email = $('#email').val()
    var password = $('#password').val()
    var confirmPassword = $('#confirmPassword').val()

    if (confirmPassword != password) {
        alert('Password is not equal')
        return false
    }

    if (password.length < 6) {
        alert('Password is too short')
        return false
    }

    if (!email.includes('@')) {
        alert('Email address is not a valid')
        return false
    }

    data['email'] = email
    data['password'] = password

    sendHttpRequest('POST', 'https://ytuce-sab.herokuapp.com/api/user/register', data).then((response) => {
        console.log(response)
        setCookie('token', response.user, 1)
    })
    setTimeout(function () {
        if (getCookie('token').length > 20) {
            console.log('içerideyim.')
            document.location = 'login.html'
        } else {
            alert('invalid credits')
        }
    }, 3000)
}

function getCookie(cname) {
    var name = cname + '='
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(';')
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}
$('#registerr').on('click', function () {})
