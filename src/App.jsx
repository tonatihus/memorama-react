import { useState, createContext, useEffect, useCallback } from 'react'
import './App.css'
import FlippableCard from "./FlippableCard";
import back from "../public/back.jpg";
import {shuffle, randomBetween} from "./utils"

export const AppContext = createContext();

function App() {
  const [paresTotales, setParesTotales] = useState(6);
  const columnas = (paresTotales > 3) ? Math.round(paresTotales/2) : paresTotales;
  const [newGame, setNewGame] = useState(true);
  const [encontrados, setEncontrados] = useState(0); //Pares encontrados
  const [volteadas, setVolteadas] = useState([]); //Las cartas volteadas en el momento
  const [unflip, setUnflip] = useState(false);
 
  const generaCartas = useCallback((pares) => {
    const newCards = [];
    let j = randomBetween(1, 25-pares);// 25 es el numero de imagenes disponibles
    for (let i = 1; i <= (pares * 2); i++) {
      newCards.push({
        id: i,
        front: `${j}.jpg`,
        flippable: true,
      });
        if (i % 2 === 0) {
            j++;
        }
    }
    return(shuffle(newCards));
  }, [newGame]);

  const [cards, setCards] = useState(generaCartas(paresTotales));

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
        setEncontrados(encontrados+1);
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
        if(cardIds.includes(card.id)) {
          return {
            ...card,
            flippable: false,
          };
        } else {
          return card;
        }
      });
    });
  }

  const nuevoJuego = (pares) => {
    setParesTotales(Number(pares));
    setNewGame(true);
    setEncontrados(0);
    setVolteadas([]);
    setCards(generaCartas(pares));
  }

  return (
    <AppContext.Provider value={[unflip, reportClick]}>
      <div className="sizeSelector">
        <label htmlFor="paresTotales">Memorama de </label>
        <input id="paresTotales" type="number" min='2' max='16' size='5' value={paresTotales} onChange={(e) => nuevoJuego(e.target.value)} /> pares
      </div>
      <div className='marcador'>Llevas {encontrados} par{encontrados!=1 ? 'es' : ''} </div>
      <div className="ResizableGrid" style={{gridTemplateColumns: `repeat(${columnas}, 1fr)`}}>
        {cards.map((card) => (
          <FlippableCard key={card.id+card.front} card={card} back={back} />
        ))}
      </div>
      {(encontrados === paresTotales) && <div> ¡GANASTE! <button onClick={() => nuevoJuego(paresTotales)}>Nuevo juego</button> </div>}
    </AppContext.Provider>
  )
}

export default App
