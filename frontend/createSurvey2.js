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

function addQues(title, type, qNumber, answers) {
    var $surveyBox = $('#questions')
    console.log(title, type, qNumber, answers)
    var id = 'question' + qNumber
    if (type === '1') {
        console.log('tip 1')
        $surveyBox.append(`
            <div class="question question${qNumber} fill-blank" id=${id}>
                <b class="questionText">${title}</b><br /><br />
                <textarea class="question-textarea" placeholder="Enter your answer here"></textarea><br /><br />
            </div>
            <br>
            `)
    } else if (type === '2') {
        console.log('tip 1')

        $surveyBox.append(
            `
            <div class="question question${qNumber} o-c" id=${id}>
            <b class="questionText">${title}</b><br /><br />
            `
        )
        $.each(answers, function (t, answer) {
            console.log('tip 2')

            $('.' + id).append(
                `
                <input class="radio-option only-choice" type="radio" name="${id}" value="${answer}"/>${answer}<br>
                    `
            )
        })
        $surveyBox.append(`
              </div>
            <br>
            `)
    } else if (type === '3') {
        $surveyBox.append(
            `
            <div class="question question${qNumber} m-c" id="${id}">
            <b class="questionText">${title}</b><br /><br />
           `
        )
        $.each(answers, function (t, answer) {
            $('.' + id).append(
                `
                    <input class="multi-choice" type="checkbox" name="${id}" id="${id}" value="${answer}" />
                    <label class="checkbox-option" for="${id}"> ${answer}</label><br />
                    `
            )
        })
        $surveyBox.append(` <p>(Note: You can check more than one box)</p>
            </div>
            <br>
           `)
    }
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
    if (!getCookie('token')) {
        document.location = 'login.html'
    }
})

function addFunction() {
    questionNumber++
    var item
    if (document.getElementById('select-box').value == 2) {
        item = document.getElementById('firstQuestion').children[0]
        item.setAttribute('id', 'tmp' + questionNumber)
        item.setAttribute('type', 2)
        item.setAttribute('qNumber', questionNumber)
    } else if (document.getElementById('select-box').value == 3) {
        item = document.getElementById('firstQuestion').children[0]
        item.setAttribute('id', 'tmp' + questionNumber)
        item.setAttribute('type', 3)
        item.setAttribute('qNumber', questionNumber)
    } else {
        item = document.getElementById('secondQuestion').children[0]
        item.setAttribute('id', 'tmp' + questionNumber)
        item.setAttribute('type', 1)
        item.setAttribute('qNumber', questionNumber)
    }

    var cln = item.cloneNode(true)
    cln.getElementsByClassName('btnDelete')[0].addEventListener('click', function () {
        this.parentNode.remove()
    })
    if (document.getElementById('select-box').value == 2 || document.getElementById('select-box').value == 3) {
        cln.getElementsByClassName('btnOption')[0].addEventListener('click', addOptionFunction)
    }
    document.getElementById('myList1').appendChild(cln)

    cln.getElementsByClassName('btnSaveQuestion')[0].addEventListener('click', saveQuestion)
}

addOptionFunction = function () {
    var item = document.getElementById('firstQuestion').getElementsByClassName('option')[0]
    var cln = item.cloneNode(true)
    this.parentNode.getElementsByClassName('optionClass')[0].appendChild(cln)
}
questionNumber = 0

function saveSurvey() {
    data = {}
    survey = {}
    surveyName = $('#surveyTitle').val() // title alındı.
    console.log($('#surveyTitle').val())
    if (surveyName.length < 1) {
        alert('Please enter a name for survey.')
        return false
    }
    reachable = $('#terms').is(':checked') // reacheable bilgisi alındı.
    try {
        finishDate = $('#surveyFinishDate').val() // finish date alındı.

        finishDate = new Date(finishDate.split('-').reverse().join('-')).getTime().toString()
        survey['finishDate'] = finishDate
    } catch (error) {}

    survey['reachable'] = reachable
    survey['surveyName'] = surveyName
    data['survey'] = survey

    var that = $('#questions')
    questions = []
    //Boşluk doldurmaların cevaplarını ekler
    that.find('.fill-blank').each(function (index, value) {
        var e = this.getElementsByClassName('questionText')
        var tmp = {}

        tmp['text'] = e[0].innerText
        tmp['qType'] = 1
        tmp['qAnswer'] = []
        questions.push(tmp)
    })

    //Çoktan tek seçmelileri ekler
    that.find('.o-c').each(function () {
        var e = this.getElementsByClassName('questionText')
        var tmp = {}

        tmp['text'] = e[0].innerText
        tmp['qType'] = 2
        var qAnswer = []

        var answers = this.getElementsByClassName('only-choice')
        for (let i = 0; i < answers.length; i++) {
            tmp2 = {}
            tmp2['text'] = answers[i].value
            qAnswer.push(tmp2)
        }
        tmp['qAnswer'] = qAnswer

        //Çoktan tek seçmelileri ekler
        that.find('.m-c').each(function () {
            var e = this.getElementsByClassName('questionText')
            var tmp = {}

            tmp['text'] = e[0].innerText
            tmp['qType'] = 3
            var qAnswer = []

            var answers = this.getElementsByClassName('multi-choice')
            for (let i = 0; i < answers.length; i++) {
                tmp2 = {}
                tmp2['text'] = answers[i].value
                qAnswer.push(tmp2)
            }
            tmp['qAnswer'] = qAnswer
            questions.push(tmp)
        })
        questions.push(tmp)
    })
    data['questions'] = questions
    sendHttpRequest('POST', 'https://ytuce-sab.herokuapp.com/api/survey/add', data).then((response) => {
        alert('Survey added. You can check your survey this link: ' + window.location.hostname + '/survey.html?survey=' + response.surveyId)
        document.location = 'mySurveys.html'
    }, document)

    console.log(data)
}

$('#addQuestion').on('click', function () {
    qtype = $('#select-box').val()
})

saveQuestion = function () {
    var ques = this.parentNode,
        type = ques.getAttribute('type'),
        qNumber = ques.getAttribute('qNumber')
    var title = ques.children[0].value
    var options = []
    try {
        var optionCount = ques.children[1].childElementCount

        for (let index = 0; index < optionCount; index++) {
            var tmp = ques.children[1].children[index].value
            options.push(tmp)
        }
    } catch (error) {
        console.log('Bu bir boşluk doldurma')
    }
    addQues(title, type, qNumber, options)
    this.parentNode.remove()
}

autoAdd = function () {
    addQues('test 1', '1', 1)
    addQues('test 2', '1', 2)
    addQues('test 3', '1', 3)
    addQues('test 4', '2', 4, ['Answer 1', 'Answer 2', 'Answer 3'])
    addQues('test 5', '3', 5, ['Answer 4', 'Answer 5', 'Answer 6'])
}
