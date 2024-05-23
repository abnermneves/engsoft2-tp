import React from 'react';
import { Hello } from './Hello';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RecipesList from './RecipesList';
import RecipeForm from './RecipeForm';

export const App = () => (
    <Router>
        <Routes>
          <Route path="/" element={<Hello/>} />
          <Route path="/posts" element={<RecipesList />} />
          <Route path="/create_recipe" element={<RecipeForm />} />
        </Routes>
    </Router>
);
