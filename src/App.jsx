import { useState, createContext, useEffect } from 'react'
import './App.css'
import FlippableCard from "./FlippableCard";
import smiley from "../public/smiley.png";
import {shuffle} from "./utils"

export const AppContext = createContext();

function App() {
  const [pairs, setPairs] = useState(2);
  const columnas = (pairs > 3) ? Math.round(pairs/2) : pairs;
  const [newGame, setNewGame] = useState(true);
  const [pares, setPares] = useState(0);
  const [volteadas, setVolteadas] = useState([]);
  const [cards, setCards] = useState([]);
  const [unflip, setUnflip] = useState(false);

  useEffect(() => {
    const newCards = [];
    let j = 1;
    for (let i = 1; i <= (pairs * 2); i++) {
      newCards.push({
        id: i,
        front: `../public/${j}.jpg`,
        back: smiley,
        flippable: true,
      });
        if (i % 2 === 0) {
            j++;
        }
    }
    setCards(shuffle(newCards));
  }, [pairs]);
  
  useEffect(() => {
    if(pares === pairs){
      setTimeout(() => {
        alert('Ganaste!');
        
      }, 500);
      setNewGame(true);
    }
  }, [pares, pairs]);


  const reportClick = (key, front) => {
    setUnflip(false);
    setNewGame(false);
 
    if(volteadas.length === 2){
      return false;
    }
        
    const newVolteadas = [...volteadas,{key, front}]
    setVolteadas(newVolteadas);
    verificaPar(newVolteadas);

    return true;
  }

  const verificaPar = (array) => {
    if(array.length === 2){
      if(array[0].front === array[1].front){
        setPares(pares+1);
        freezeCards([array[0].key, array[1].key]);
        setVolteadas([]);
      }
      else{
        setTimeout(() => {
          setUnflip(true);
          setVolteadas([]);
        }, 1000);

      }
    }
  }

  
  //cardIds: array de ids de las cartas que se deben congelar
  function freezeCards(cardIds) {
    setCards((cards) => {
      return cards.map((card) => {
        return {
          ...card,
          flippable: !cardIds.includes(card.id),
        };
      });
    });
  }

  return (
    <AppContext.Provider value={[unflip, reportClick]}>
      <div className="sizeSelector">
        <label htmlFor="pairs">Memorama de </label>
        <input id="pairs" type="number" min='2' max='16' size='5' value={pairs} onChange={(e) => {
          setPairs(e.target.value);
          setNewGame(true);
        }} /> pares
      </div>
      <div className='marcador'>Llevas {pares} par{pares!=1 ? 'es' : ''} </div>
      <div className="ResizableGrid" key={pairs} style={{gridTemplateColumns: `repeat(${columnas}, 1fr)`}}>
        {cards.map((card) => (
          <FlippableCard key={card.id} card={card} />
        ))}
      </div>
    </AppContext.Provider>
  )
}

export default App
