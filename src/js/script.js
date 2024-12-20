const cards = document.querySelectorAll(".card");
var flipCounter = 0;
var matches = 0;
var tries =  0;
var cardPair = [];
var urls = [];
const urlsFetch = [];
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
    for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
}

const getAllPokemons = async()=>{
    try{
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1300");
        if(!res.ok){
            throw new Error(res.status);
        }
        const data = await res.json();

        while(urlsFetch.length<8){
            let random = Math.floor(Math.random()*1300);
            let urlPokemon = data.results[random].url;
            let dataPokemon = await fetch(urlPokemon);
            dataPokemon = await dataPokemon.json();
            
            if(dataPokemon.sprites.other.dream_world.front_default!=null){
                urlsFetch.push(dataPokemon.sprites.other.dream_world.front_default);
            }
        }
    } catch(error){
        console.log(error.message)
    } 
    urls = urlsFetch;
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
    doubledUrls = [...urls, ...urls]
    urlsToPlay = shuffle(doubledUrls);
}

const renderImages=()=>{
    
    for(let i=1; i<urlsToPlay.length+1;i++){
        let divContainer = document.getElementById(`card__character-side${i}`);
        let newCharacterImg = document.createElement("img");
        newCharacterImg.setAttribute("src", `${urlsToPlay[i-1]}`);
        let newBackImg = document.createElement("img");
        newBackImg.setAttribute("src", "./public/images/cardBackCharacter.jpg")
        divContainer.appendChild(newBackImg);
        divContainer.appendChild(newCharacterImg);
    }
}

async function startGame(){
    for(let i=0;i<16;i++){
        disableCard(i);
    }
    await getAllPokemons();
    setUrlsToPlay();
    renderImages();
    for(let i=0;i<16;i++){
        enableCard(i);
    }
}

startGame();