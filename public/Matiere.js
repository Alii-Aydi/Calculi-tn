class Matiere {
    static nbrMat = 0
    moy
    score
    static moyG = 0
    static allMats = []
    constructor(n, r, c, o, t, th) {
        this.nom = n
        this.regime = r
        this.coff = c
        this.n1 = o
        this.n2 = t
        if (isNaN(th)) {
            this.n3 = ' '
        } else {
            this.n3 = th
        }
        Matiere.nbrMat++
    }
}

export default Matiere