import Matiere from './Matiere.js'

const nom = document.querySelector('#nom')
const regime = document.querySelector('#regime')
const coff = document.querySelector('#coff')
const n1 = document.querySelector('#n1')
const n2 = document.querySelector('#n2')
const n3 = document.querySelector('#n3')
const lastCl = []

document.querySelector('#ajout').addEventListener('click', ajouterMat)
function ajouterMat() {
    changeNth()
    //validation
    if (nom.value == "" || coff.value == "" || n1.value == "" || n2.value == "" || n3.value == "") {
        alert()
    } else if (isNaN(parseFloat(coff.value)) || parseFloat(coff.value) > 10 || parseFloat(coff.value) < 0.5 || isNaN(parseFloat(n1.value)) || parseFloat(n1.value) > 20 || parseFloat(n1.value) < 0 || isNaN(parseFloat(n2.value)) || parseFloat(n2.value) > 20 || parseFloat(n2.value) < 0 || (!n3.disabled && (isNaN(parseFloat(n3.value)) || parseFloat(n3.value) > 20 || parseFloat(n3.value) < 0))) {
        alert()
    } else {
        const mat = new Matiere(nom.value, regime.value, parseFloat(coff.value).toFixed(2), parseFloat(n1.value).toFixed(2), parseFloat(n2.value).toFixed(2), parseFloat(n3.value).toFixed(2))
        const tbody = document.querySelector('tbody')
        const tr = document.createElement('tr')
        tr.className = `row-${Matiere.nbrMat}`
        const td = document.createElement('td')
        td.innerText = Matiere.nbrMat
        tr.appendChild(td)
        for (let prop in mat) {
            if (prop == 'moy' || prop == 'score') {
                console.log('skipped')
            } else {
                const td = document.createElement('td')
                td.innerText = mat[prop]
                tr.appendChild(td)
            }
        }
        const tdm = document.createElement('td')
        mat.moy = calculerMoy(mat)
        mat.score = mat.moy * mat.coff
        tdm.innerText = mat.moy.toFixed(2)
        tr.appendChild(tdm)
        //Edit and delete btns
        const edit = document.createElement('button')
        edit.classList.add('btn', 'btn-light', 'edit')
        edit.innerText = 'Modifier'
        const tdb = document.createElement('td')
        tdb.appendChild(edit)
        tr.appendChild(tdb)

        const delet = document.createElement('button')
        delet.classList.add('btn', 'btn-light', 'delete')
        delet.innerText = 'Supprimer'
        const tdbt = document.createElement('td')
        tdbt.appendChild(delet)
        tr.appendChild(tdbt)

        tbody.appendChild(tr)
        Matiere.allMats.push(mat)
        calculerMG()
        clear()
    }
}

document.querySelector('table').addEventListener('click', function (e) {
    if (e.target.classList.contains('delete')) {
        e.target.parentNode.parentNode.remove()
        const trs = document.querySelectorAll('tbody tr')
        let i = 1
        for (let tr of trs) {
            tr.children[0].innerText = i
            tr.className = `row-${i}`
            i++
        }
        for (let i = 1; i <= Matiere.nbrMat; i++) {
            if (e.target.parentNode.parentNode.classList.contains(`row-${i}`)) {
                Matiere.allMats.splice(i - 1, 1)
            }
        }
        Matiere.nbrMat--
        calculerMG()
    }

    if (e.target.classList.contains('edit')) {
        lastCl.splice(0, 1, e.target.parentNode.parentNode.classList)
        const inputs = document.querySelectorAll('.collector input')
        for (let i = 1; i <= Matiere.nbrMat; i++) {
            if (e.target.parentNode.parentNode.classList.contains(`row-${i}`)) {
                const tds = document.querySelectorAll(`.row-${i} td`)
                for (let j = 0; j < inputs.length; j++) {
                    if (j == 1) {
                        document.querySelector('select').value = tds[j + 1].innerText
                        inputs[j].value = tds[j + 2].innerText
                    } else if (j > 1) {
                        inputs[j].value = tds[j + 2].innerText
                    } else {
                        inputs[j].value = tds[j + 1].innerText
                    }
                }
            }
        }
        const ajbtn = document.querySelector('#ajout')
        const majbtn = document.querySelector('#maj')
        majbtn.classList.remove('d-none')
        ajbtn.classList.add('d-none')
        const suppBtns = document.querySelectorAll('.delete')
        for (let btn of suppBtns) {
            btn.disabled = true
        }
        changeNth()
    }
})

document.querySelector('#maj').addEventListener('click', function () {
    changeNth()
    if (nom.value == "" || coff.value == "" || n1.value == "" || n2.value == "" || n3.value == "") {
        alert()
    } else if (isNaN(parseFloat(coff.value)) || parseFloat(coff.value) > 10 || parseFloat(coff.value) < 0.5 || isNaN(parseFloat(n1.value)) || parseFloat(n1.value) > 20 || parseFloat(n1.value) < 0 || isNaN(parseFloat(n2.value)) || parseFloat(n2.value) > 20 || parseFloat(n2.value) < 0 || (!n3.disabled && (isNaN(parseFloat(n3.value)) || parseFloat(n3.value) > 20 || parseFloat(n3.value) < 0))) {
        alert()
    } else {
        for (let i = 1; i <= Matiere.nbrMat; i++) {
            if (lastCl[0] == (`row-${i}`)) {
                const mat = new Matiere(nom.value, regime.value, parseFloat(coff.value).toFixed(2), parseFloat(n1.value).toFixed(2), parseFloat(n2.value).toFixed(2), parseFloat(n3.value).toFixed(2))
                Matiere.nbrMat--
                mat.moy = calculerMoy(mat)
                mat.score = mat.moy * mat.coff
                Matiere.allMats[i - 1] = mat
                const tds = document.querySelectorAll(`.row-${i} td`)
                tds[1].innerText = mat.nom
                tds[2].innerText = mat.regime
                tds[3].innerText = mat.coff
                tds[4].innerText = mat.n1
                tds[5].innerText = mat.n2
                tds[6].innerText = mat.n3
                tds[7].innerText = mat.moy.toFixed(2)
            }
        }
        const ajbtn = document.querySelector('#ajout')
        const majbtn = document.querySelector('#maj')
        majbtn.classList.add('d-none')
        ajbtn.classList.remove('d-none')
        const suppBtns = document.querySelectorAll('.delete')
        for (let btn of suppBtns) {
            btn.disabled = false
        }
        calculerMG()
        clear()
    }
})

document.querySelector('#anul').addEventListener('click', function () {
    clear()
    const ajbtn = document.querySelector('#ajout')
    const majbtn = document.querySelector('#maj')
    majbtn.classList.add('d-none')
    ajbtn.classList.remove('d-none')
    const suppBtns = document.querySelectorAll('.delete')
    if (suppBtns.length) {
        for (let btn of suppBtns) {
            btn.disabled = false
        }
    }
})

const changeNth = () => {
    if (regime.value == 'r3') {
        n3.disabled = true
        n3.style.backgroundColor = 'rgb(220, 220, 220)'
        n3.value = ' '
    } else {
        n3.disabled = false
        n3.style.backgroundColor = 'white'
    }
}

regime.addEventListener('change', changeNth)

const calculerMoy = (mat) => {
    if (mat.regime == 'r1') return mat.n1 * 0.1 + mat.n2 * 0.2 + mat.n3 * 0.7
    if (mat.regime == 'r2') return mat.n1 * 0.2 + mat.n2 * 0.4 + mat.n3 * 0.4
    if (mat.regime == 'r4') return (parseFloat(mat.n1) + parseFloat(mat.n2) + parseFloat(mat.n3) * 2) / 4
    if (mat.regime == 'r3') return mat.n1 * 0.3 + mat.n2 * 0.7
}

const calculerMG = () => {
    if (Matiere.nbrMat == 0) {
        return document.querySelector('#mg').innerText = ''
    }
    let sommeScores = 0
    let sommeCoffs = 0
    for (let mat of Matiere.allMats) {
        sommeScores += parseFloat(mat.score)
        sommeCoffs += parseFloat(mat.coff)
    }
    Matiere.moyG = sommeScores / sommeCoffs
    document.querySelector('#mg').innerText = Matiere.moyG.toFixed(2)
}

const clear = () => {
    nom.value = ""
    coff.value = ""
    n1.value = ""
    n2.value = ""
    n3.value = ""
}

const alert = async () => {
    const ajbtn = document.querySelector('#ajout')
    const majbtn = document.querySelector('#maj')
    document.documentElement.scrollTop = 0
    document.querySelector('.alert_vide').classList.remove('d-none')
    ajbtn.disabled = true
    majbtn.disabled = true
    setTimeout(() => {
        document.querySelector('.alert_vide').classList.add('d-none')
        ajbtn.disabled = false
        majbtn.disabled = false
    }, 3000)
}