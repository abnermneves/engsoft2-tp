import React from 'react';
import { Home } from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipesList from './RecipesList';
import RecipeForm from './RecipeForm';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<LoginForm/>} />
            <Route path="/register" element={<RegisterForm/>} />
            <Route path="/posts" element={<RecipesList />} />
            <Route path="/create_recipe" element={<RecipeForm />} />
        </Routes>
    </Router>
);
