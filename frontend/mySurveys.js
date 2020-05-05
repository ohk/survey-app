const sendHttpRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.setRequestHeader('token', getCookie('token'))

        xhr.withCredentials = false
        xhr.onload = () => {
            resolve(xhr.response)
        }
        xhr.send(JSON.stringify(data))
    })
    return promise
}

//setCookie("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWFiNDdjMzExOWFkZDcwOGRmOTdmM2QiLCJpYXQiOjE1ODgyODMzOTJ9.6kWW9TbJdYCaPY5zKRPfVynPBxpVF-39V7tLMGUdKGg", 1);
//bootstrapToggle("state", true);
function setCookie(cname, cvalue, exdays) {
    var d = new Date()
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
    var expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
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

$(function () {
    var $survey = $('.container')
    //5eac27e9585448000455cad3
    sendHttpRequest('GET', 'https://ytuce-sab.herokuapp.com/api/survey/mys').then((data) => {
        console.log(data)

        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            var a = $survey.append(`
        <div id="${element._id}">
        <a href="#" class="list-group-item list-group-item-action" onclick="document.location = 'survey.html?survey=${element._id}'" name = "a">${element.surveyName}</a>
        <button type="submit" class="btn btnDeleteMySurvey">Delete!</button>
        
        <input type="checkbox" checked data-toggle="toggle" data-size="sm" data-onstyle="dark" class="reachable" data-on="Public" data-off="Private">
        <button type="submit" class="btn btnResultMySurvey">Result!</button>
        </div> 
        `)
            if (element.reachable == true) {
                $('#' + element._id)
                    .find('.reachable')
                    .bootstrapToggle('on')
            } else {
                $('#' + element._id)
                    .find('.reachable')
                    .bootstrapToggle('off')
            }

            $('#' + element._id)
                .find('.reachable')
                .change(function () {
                    console.log(this.checked)
                    console.log(this.parentNode.parentNode.id)
                    console.log($('#' + element._id).find('.reachable').value)
                    if (this.checked == false) {
                        console.log('sadfg')
                        sendHttpRequest('POST', 'https://ytuce-sab.herokuapp.com/api/survey/unreachable', {
                            surveyId: this.parentNode.parentNode.id
                        }).then((response) => {
                            console.log(response)
                        })
                    } else {
                        sendHttpRequest('POST', 'https://ytuce-sab.herokuapp.com/api/survey/reachable', {
                            surveyId: this.parentNode.parentNode.id
                        }).then((response) => {
                            console.log(response)
                        })
                    }
                })

            $('#' + element._id)
                .find('.btnDeleteMySurvey')
                .click(function () {
                    console.log(this.parentNode.id)
                    sendHttpRequest('DELETE', 'https://ytuce-sab.herokuapp.com/api/survey/' + this.parentNode.id).then((response) => {
                        console.log(response)
                    })
                })

            $('#' + element._id)
                .find('.btnResultMySurvey')
                .click(function () {
                    console.log(this.parentNode.id)
                    document.location = 'result.html?survey=' + this.parentNode.id
                })
        }
    })
})
