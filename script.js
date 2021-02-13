class AudioController{
    constructor(){
        this.flipSound = new Audio('./assets/audio/flip.wav');
        this.victorySound = new Audio('./assets/audio/victory.wav');
        this.gameOverSound = new Audio('./assets/audio/over.wav');
        this.matchSound = new Audio('./assets/audio/match.wav');
    }

    flip(){
        this.flipSound.play();
    }

    victory(){
        this.victorySound.play();
    }

    gameOver(){
        this.gameOverSound.play();
    }

    match(){
        this.matchSound.play();
    }
}

class MemoryGameController{

    constructor(totalTime, totalScore, images, cards){
        this.totalTime = totalTime;
        this.totalScore = totalScore;
        this.images = images;
        this.cards = cards;
        this.audioController = new AudioController();
        this.timer = document.getElementById('timer');
        this.timer.innerText = `Time ${totalTime}`;
        this.score = document.getElementById('score');
        this.score.innerText = `Score ${totalScore.toString()}`;
        this.clear();
        this.fulil();
        this.timeInterval = undefined;
    }

    // Clear
    clear(){
        this.currentChoice = undefined;
        this.previousChoice = undefined;
        this.previousIndex = -1;
        this.currentIndex = -1;
    }

    // Display start Overlay
    displayStartOverlay(){
        document.getElementById('start').classList.toggle('hidden');
    }

    // DisplayGameOver Overlay
    displayGameOverOverley(){
        document.getElementById('over').classList.toggle('hidden');
        this.audioController.gameOver();
    }

    // Display VictoryOverlay
    displayVictoryOverlay(){
        document.getElementById('victory').classList.toggle('hidden');
        clearInterval(this.timeInterval);
        this.audioController.victory();
    }

    // start
    start(){
        for(let card of this.cards){
            card.classList.add('show-back-face');
        }
        setTimeout(()=>{
            for(let card of this.cards){
                card.classList.remove('show-back-face');
            }
            this.launchTheTimer();
        },2500);
    }


    // Replay
    replay(btn){
        if(btn.value =='Replay'){
            document.getElementById('over').classList.add('hidden');
        }
        else{
            document.getElementById('victory').classList.add('hidden');
        }
        this.fulil();
        this.timer.innerText = `Time ${this.totalTime.toString()}`;
        this.score.innerText = `Score 0`;
        this.totalScore = 0;
        this.start();
    }

    // Fulfil And Mix The Array
    fulil(){
        this.mixUpArray();
        let imgs = document.querySelectorAll('.fruits');
        for(let i = 0; i < this.images.length; i++){
          imgs[i].setAttribute('src', this.images[i].src);
        }
    }

    // Mix Up the array
    mixUpArray(){
        for(let i = 0; i < this.images.length; i++){
            const rand = Math.floor(Math.random() * 8);
            let aux = this.images[i];
            this.images[i] = this.images[rand];
            this.images[rand]= aux;
        }
    }

    updateScore(operator){
        if(operator === '+'){
            this.totalScore += 10;
        }
        else if(this.totalScore > 5){
            this.totalScore -= 5;
        }
        else{
            this.totalScore = 0;
        }
        this.score.innerText = `Score ${this.totalScore.toString()}`;
    }

    // Card fliped
    async flipCard(card, index){
        if(card.classList.contains('show-back-face'))
        return;
        this.audioController.flip();
        card.classList.add('show-back-face');
        if(this.currentChoice){
            this.previousChoice = this.currentChoice;
            this.previousIndex = this.currentIndex;
            this.currentChoice = card;
            this.currentIndex = index;
            await this.isMatch();
        }
        else{
            this.currentChoice = card;
            this.currentIndex = index;
        }
    }

    // IS Match
    async isMatch(){
       if(this.images[this.currentIndex].name === this.images[this.previousIndex].name){
           this.audioController.match();
           this.updateScore('+');
           this.clear();
       }
       else{
        setTimeout(()=>{
            this.currentChoice.classList.remove('show-back-face');
            this.previousChoice.classList.remove('show-back-face');
            this.updateScore('-');
            this.clear();
        },500);
       }
       await this.isFinish();
    }

    async isFinish(){
       let exist = true;
       for(let card of this.cards){
            if(!card.classList.contains('show-back-face')){
                exist = false;
                return;
            }
        }
        if(exist){
            this.displayVictoryOverlay();
        }
    }

    // Timer Setting
    launchTheTimer(){
        var timeRemaining = this.totalTime;
         this.timeInterval = setInterval(()=>{
            timeRemaining--;
            this.timer.innerText = `Time ${timeRemaining.toString()}`;
            if(parseInt(timeRemaining) === 0 ){
                clearInterval(this.timeInterval);
                this.displayGameOverOverley();
            }
        },1000);
    }

}

document.addEventListener('DOMContentLoaded', ()=>{
    var images = [
        {name: 'apple', src: './assets/img/apple.jpg'},
        {name: 'pear', src: './assets/img/pear.png'},
        {name: 'strawberry', src: './assets/img/strawberry.png'},
        {name: 'blueberry', src: './assets/img/blueberry.png'},
        {name: 'orange', src: './assets/img/orange.png'},
        {name: 'peach', src: './assets/img/peach.png'},
        {name: 'cherry', src: './assets/img/cherry.png'},
        {name: 'cherry2', src: './assets/img/cherry-2.png'},

        {name: 'strawberry', src: './assets/img/strawberry.png'},
        {name: 'cherry', src: './assets/img/cherry.png'},
        {name: 'orange', src: './assets/img/orange.png'},
        {name: 'pear', src: './assets/img/pear.png'},
        {name: 'peach', src: './assets/img/peach.png'},
        {name: 'apple', src: './assets/img/apple.jpg'},
        {name: 'blueberry', src: './assets/img/blueberry.png'},
        {name: 'cherry2', src: './assets/img/cherry-2.png'}
    ];

    console.log('The Game is running...')
    const cards = document.querySelectorAll('.memory-card');
    const memoryGame = new MemoryGameController(100, 0, images, cards);
    memoryGame.displayStartOverlay();

    // Listens
    cards.forEach((card, index) => card.addEventListener('click', ()=>{
        memoryGame.flipCard(card, index);
    }));

    document.getElementById('start').addEventListener('click', function(){
        this.classList.toggle('hidden');
        memoryGame.start();
    });

    document.querySelectorAll('[data-replay]').forEach((button)=>{
        button.addEventListener('click', ()=>{
            memoryGame.replay(button);
        });
    });

});



