var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=')

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1])
        }
    }
}

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
    var $survey = $('.survey')
    var surveyParam = getUrlParameter('survey')
    //5eac27e9585448000455cad3
    sendHttpRequest('GET', 'https://ytuce-sab.herokuapp.com/api/survey/' + surveyParam).then((data) => {
        $survey.append(`
        <div class="surveyBox" id="${data.questions[0].surveyId}"></div>
       `)

        var $surveyBox = $('.surveyBox')
        $.each(data.questions, function (i, question) {
            if (question.qType === 1) {
                $surveyBox.append(`
                <div class="question ${question._id}" questionId="${question._id}">
                    <b class="questionText">${question.text}</b><br /><br />
                    <textarea class="fill-blank question-textarea" placeholder="Enter your answer here" name="${question._id}"></textarea><br /><br />
                </div>
                <br>
                `)
            } else if (question.qType === 2) {
                $surveyBox.append(
                    `
                <div class="question o-c ${question._id}" questionId="${question._id}">
                <b class="questionText">${question.text}</b><br /><br />
                `
                )
                $.each(question.qAnswer, function (t, answer) {
                    $('.' + question._id).append(
                        `
                    <input class="radio-option only-choice" type="radio" name="${question._id}" value="${t + 1}"/>${answer.text}<br>
                        `
                    )
                })
                $surveyBox.append(`
                  </div>
                <br>
                `)
            } else if (question.qType === 3) {
                $surveyBox.append(
                    `
                <div class="question m-c ${question._id}" questionId="${question._id}">
                <b class="questionText">${question.text}</b><br /><br />
               `
                )
                $.each(question.qAnswer, function (t, answer) {
                    $('.' + question._id).append(
                        `
                        <input class="multi-choice" type="checkbox" name="${question._id}" id="${answer._id}" value="${t + 1}" />
                        <label class="checkbox-option" for="${answer._id}"> ${answer.text}</label><br />
                        `
                    )
                })
                $surveyBox.append(` <p>(Note: You can check more than one box)</p>
                </div>
                <br>
               `)
            }
        })
    })
})

$('form.survey').on('submit', function () {
    var that = $(this),
        data = {},
        email = that.find('#email').val()
    if (email.length < 6) {
        alert('Please enter a valid email')
        return false
    }
    data['surveyId'] = that.find('.surveyBox').attr('id')
    data['email'] = email
    data['answers'] = []
    //Boşluk doldurmaların cevaplarını ekler
    that.find('.fill-blank').each(function (index, value) {
        var that = $(this),
            value = that.val(),
            questionId = that.attr('name'),
            tmp = {}
        tmp['questionId'] = questionId
        tmp['answer'] = value
        data['answers'].push(tmp)
    })

    //Çoktan tek seçmelileri ekler
    that.find('.o-c').each(function () {
        var that = $(this),
            questionId = that.attr('questionId'),
            value = $(`input[name="${questionId}"]:checked`).val(),
            tmp = {}
        tmp['questionId'] = questionId
        tmp['answer'] = value
        data['answers'].push(tmp)
    })

    //Çoktan çok seçmelileri ekler
    that.find('.m-c').each(function () {
        var questionId = $(this).attr('questionId')

        that.find(`input[name="${questionId}"]:checked`).each(function () {
            var that = $(this),
                tmp = {}
            tmp['questionId'] = questionId
            tmp['answer'] = that.val()
            data['answers'].push(tmp)
        })
    })

    sendHttpRequest('POST', 'https://ytuce-sab.herokuapp.com/api/answer/add', data).then((response) => {
        console.log(response)
        alert('Answer added.')
        document.location = 'listSurvey.html'
    })
    return false
})
