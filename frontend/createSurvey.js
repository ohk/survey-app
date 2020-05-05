function addFunction() {
    var item
    if (document.getElementById('select-box').value == 1) {
        item = document.getElementById('firstQuestion').children[0]
    } else {
        item = document.getElementById('secondQuestion').children[0]
    }
    var cln = item.cloneNode(true)
    cln.getElementsByClassName('btnDelete')[0].addEventListener('click', function () {
        this.parentNode.remove()
    })
    if (document.getElementById('select-box').value == 1) {
        cln.getElementsByClassName('btnOption')[0].addEventListener('click', addOptionFunction)
    }
    document.getElementById('myList1').appendChild(cln)
}

addOptionFunction = function () {
    console.log('edfghjk')
    var item = document.getElementById('firstQuestion').getElementsByClassName('option')[0]
    var cln = item.cloneNode(true)
    this.parentNode.getElementsByClassName('optionClass')[0].appendChild(cln)
}
