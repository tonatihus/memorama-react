import React from "react";
import { AppContext } from "./App";

function FlippableCard({ card, back }) {
  const [isFront, setIsFront] = React.useState(false);
  const [unflip, reportClick] = React.useContext(AppContext);

  function flip() {
    setIsFront(!isFront);
  }

  React.useEffect(() => {
    if(unflip && card.flippable) setIsFront(false);
  }, [unflip]);

  return (
    <div className="FlippableCard" onClick={() => {
      if(!card.flippable) {
        return;
      }

      if(isFront){
        return;
      }

      if(reportClick(card.id, card.front)){
        flip();
      }
    }}>
      <img className="card" src={ isFront ? card.front : back} alt="memoCard" style={(!card.flippable) ? {border:'5px solid green'} : {}}/>
    </div>
  );
}

export default FlippableCard;
