import React from "react";
import { AppContext } from "./App";

function FlippableCard({ card }) {
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
      console.log(card.id)
      if(!card.flippable) return;
      if(isFront) return;

      if(reportClick(card.id, card.front)){
        flip();
      }
    }}>
      <img src={ isFront ? card.front : card.back} alt="memoCard" style={(!card.flippable) ? {border:'2px solid green'} : {}}/>
    </div>
  );
}

export default FlippableCard;
