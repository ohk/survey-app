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
    var resultContainer = $('.results-container')
    var surveyParam = getUrlParameter('survey')
    //5eac27e9585448000455cad3
    sendHttpRequest('GET', 'https://ytuce-sab.herokuapp.com/api/result/' + surveyParam).then((data) => {
        data.forEach(function (result) {
            console.log('Result Type: ' + result.qType)
            if (result.qType == 1) {
                resultContainer.append(`
                    <div class="result-open-ended" id="${result.questionId}">
                        <p class="result-open-ended-question" >${result.text}</p>
                    </div>
                `)
                result.answers.forEach(function (answer) {
                    $('#' + result.questionId).append(
                        `
                        <div class="fill-blank-answer-div">
                            <p>${answer}</p>
                        </div>
                        `
                    )
                })
            } else {
                newData = {}
                options = {}
                dataArray = []
                labelArray = []
                finData = []

                $.each(result.answers, function (t, answer) {
                    dataArray.push(answer.count)
                    labelArray.push('Answer ' + answer.text.toString())
                })
                newData['values'] = dataArray
                newData['labels'] = labelArray
                newData['type'] = 'pie'
                finData.push(newData)
                console.log(newData)
                resultContainer.append(`
                <div class="result-multi-multi">
                <p class="result-multi-multi-question">${result.text}</p>
                <div id="${result.questionId}" class="pie-chart-extend" >
                    
                </div>
                </div>
                `)

                var layout = {
                    height: 400,
                    width: 500
                }

                Plotly.newPlot(result.questionId, finData, layout)
            }
        })
    })
})

function createPDF() {
    var doc = new jsPDF()
    var elementHTML = $('.results-container').html()
    /*var specialElementHandlers = {
        '#elementH': function (element, renderer) {
            return true
        }
    }*/
    doc.fromHTML(elementHTML, 15, 15, {
        width: 170
        //,elementHandlers: specialElementHandlers
    })

    // Save the PDF
    doc.save('sample-document.pdf')
}
