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

$(function () {
    var $survey = $('.container')
    //5eac27e9585448000455cad3
    sendHttpRequest('GET', 'https://ytuce-sab.herokuapp.com/api/survey/all').then((data) => {
        console.log(data)

        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            $survey.append(`
          <a href="#" class="list-group-item list-group-item-action" onclick="document.location = 'survey.html?survey=${element._id}'" name = "a">${element.surveyName}</a>
            `)
        }
    })
})
