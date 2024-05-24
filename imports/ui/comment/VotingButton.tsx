import React, { useState } from 'react';

interface VotingProps{
  handleIncrement: () => void;
  handleDecrement: () => void;
  getRate: () => number;
}

export const VotingButton: React.FC<VotingProps> = ({handleDecrement, handleIncrement, getRate}) => {
  /* const [value, setValue] = useState<number>(-1);

  const handleIncrement = () => {
    if (value < 5) {
      setValue(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  }; */

  return (
    <div>
      <h4>Avaliação:</h4>
      <button onClick={handleDecrement}>-</button>
      <button onClick={handleIncrement}>+</button>
      <span>{(getRate() == -1 ? " " : getRate().toString())}</span>
    </div>
  );
};
