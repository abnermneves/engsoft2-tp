import React from 'react';
import './StyleVotingButton.css';

interface VotingProps {
  handleIncrement: () => void;
  handleDecrement: () => void;
  getRate: () => number;
}

export const VotingButton: React.FC<VotingProps> = ({ handleDecrement, handleIncrement, getRate }) => {
  return (
    <div className="voting-container">
      <h4>Avaliação:</h4>
      <button className="voting-button" onClick={handleDecrement}>-</button>
      <button className="voting-button" onClick={handleIncrement}>+</button>
      <span className="voting-rate">{(getRate() === -1 ? " " : getRate().toString())}</span>
    </div>
  );
};
