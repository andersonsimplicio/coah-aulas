import React from 'react';
import {Routes, BrowserRouter,Route} from  'react-router-dom';
import Landing from './pages/Landing';
import CoachList from './pages/CoachList';
import CoachForm from './pages/CoachForm';

function Rotas(){
    return (
        <BrowserRouter>   
           <Routes>    
                <Route index path="/" element={<Landing />} />
                <Route path="/study" element={<CoachList/>} />
                <Route path="/give-classes" element={<CoachForm />} />
            </Routes> 
        </BrowserRouter>
    );
}

export default Rotas;