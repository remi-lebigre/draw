export class Utilities {
    constructor() {

    }

    public shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    public shuffleWordAndAlphabet(word, maxLength) {
        let shuffledAlphabet = this.shuffle('abcdefghijklmnopqrstuvwxyz'.split(''));
        let shuffledWord = this.shuffle(word.split(''));
        let numberToPick = maxLength - word.length;
        let pickedLetters = shuffledAlphabet.splice(0, numberToPick);
        return this.shuffle(pickedLetters.concat(shuffledWord));
    }
}


