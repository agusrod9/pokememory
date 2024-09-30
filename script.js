const cards = document.querySelectorAll(".card");
var flipCounter = 0;
var matches = 0;
var tries =  0;
var cardPair = [];
var urls = [];
var urlsToPlay = [];
const winnerOverlay = document.querySelector(".winner__overlay");
const efectividad = document.getElementById("efectividad");

for(let i=0; i< cards.length; i++){
    cards[i].addEventListener("click", ()=>{
        flipCard(i);
        flipCounter++;
        cardPair[0] != i ? addToCardPair(i) : null;
        if(flipCounter==2){
            tries++;
            if(check(cardPair)){
                matches++;
                matches==8 ? setTimeout(()=>{salute()},500) : ()=>{};
                efectividad.textContent = `Efectividad : ${Math.floor((8/tries)*100)} %`
                disableCardPair(cardPair);
                cardPair.splice(0,cardPair.length);
                flipCounter=0;
            }else{
                let c1 = cardPair[0];
                let c2 = cardPair[1];
                setTimeout(()=> {flipCard(c1); flipCard(c2)},500);
                cardPair.splice(0,cardPair.length);
                flipCounter=0;
            }
        }
    })};      
    
    
winnerOverlay.addEventListener("click", ()=>{
    location.reload(true);
})

const shuffle =(array)=>{
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

    // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const getAllPokemons = async()=>{
    
    try{
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=500")
        
        if(!res.ok){
            throw new Error(res.status);
        }
    
        const data = await res.json();
        
        for(let i=0; i<32; i++){ //cargo 32 para tener más, ya que me quedo con 8 (16 en realidad) nomás y no deben ser null
            let random = Math.floor(Math.random()*1302);
            try{
                const res2 = await fetch(data.results[random].url)
    
                if(!res2.ok){
                    throw new Error(res2.status);
                }
    
                const data2 = await res2.json();
                if(data2.sprites.other.dream_world.front_default!=null && !urls.includes(data2.sprites.other.dream_world.front_default)){
                    urls.push(data2.sprites.other.dream_world.front_default);
                    urls.push(data2.sprites.other.dream_world.front_default);
                }
            }catch{
    
            }
        }
        urls = urls.splice(0,16)
    } catch(error){
        console.log(error.message)
    } 

}

const flipCard=(i)=>{
    
    if(cards[i].classList.contains("is-switched")){
        cards[i].classList.remove("is-switched")
    }else{
        cards[i].classList.add("is-switched")
        disableCard(i);
    }

    setTimeout(()=>{
        cards[i].childNodes[1].childNodes[3].classList.remove("blackBg");
    },10)
}


const flipCardPair=(pcardPair)=>{
    flipCard(pcardPair[0]);
    flipCard(pcardPair[1]);
}

const addToCardPair=(node)=>{
    cardPair.push(node);
}

const clearCardPair=()=>{
    cardPair.splice(0,cardPair.length);
}

const check =(cardPair)=>{
    let card1 = cards[cardPair[0]].childNodes[1].childNodes[3].childNodes[1].getAttribute("src");
    let card2 = cards[cardPair[1]].childNodes[1].childNodes[3].childNodes[1].getAttribute("src")
    
    if(card1!=card2){
        enableCard(cardPair[0]);
        enableCard(cardPair[1]);
    }
    return card1 == card2;
    
}

const salute=()=>{
    winnerOverlay.classList.remove("hidden");
}

const disableCard =(cardIndex)=>{
    cards[cardIndex].classList.add("disabled");
}

const enableCard =(cardIndex)=>{
    cards[cardIndex].classList.remove("disabled");
}

const disableCardPair =(cardPair)=>{
    for(let i=0; i<cardPair.length; i++){
        cards[cardPair[i]].classList.add("disabled");
    }
}

const setUrlsToPlay =()=>{
    urlsToPlay = shuffle(urls);
}

const renderImages=()=>{
    
    for(let i=1; i<urlsToPlay.length+1;i++){
        let divContainer = document.getElementById(`card__character-side${i}`);
        let newCharacterImg = document.createElement("img");
        newCharacterImg.setAttribute("src", `${urlsToPlay[i-1]}`);
        let newBackImg = document.createElement("img");
        newBackImg.setAttribute("src", "card-back-charSide.jpg")
        divContainer.appendChild(newBackImg);
        divContainer.appendChild(newCharacterImg);
    }
}

getAllPokemons().then(setTimeout(()=>{setUrlsToPlay();renderImages()},1000))
