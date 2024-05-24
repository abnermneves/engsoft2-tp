import React from 'react';
import { Home } from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { RecipeEdit } from './recipes/RecipeEdit';
import { RecipeCreate } from './recipes/RecipeCreate';
import { RecipeView } from './recipes/RecipeView';

export const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<LoginForm/>} />
            <Route path="/register" element={<RegisterForm/>} />
            <Route path="/recipe/create/" element={<RecipeCreate/>} />
            <Route path="/recipe/edit/:id" element={<RecipeEdit/>} />
            <Route path="/recipe/view/:id" element={<RecipeView/>} />
        </Routes>
    </Router>
);
