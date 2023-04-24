import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/images/logo.png';
import landingImg from '../../assets/images/landing.png';
import studyImg from '../../assets/images/icons/study.svg';
import giveClassIcon from '../../assets/images/icons/give-classes.svg';
import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg';
import "./styles.css";
import api from '../../services/api';


function Landing() {
  const [totalConnections, setTotalConnections] = useState(0);

  useEffect(() => {
    api.get('connections').then(response => {
      const { total } = response.data;

      setTotalConnections(total);
    })
  }, []);

  return (
    <div id="page-langing">
        <div id="page-langing-content" className='container'>
            <div className="logo-container">
                 <img src={logoImg} alt="coach4me" />
                 <h1>Encontre monitores online falcilmente.</h1>
            </div>
            <img src={landingImg} 
            alt="Plataforma de Estudos" 
            className="coach-image"
            />
            <div className="buttons-container">
                <Link to="/study" className="study">
                    <img src={studyImg} 
                        alt="Plataforma de Estudos" 
                        className="Estudar"
                    />
                    Estudars
                </Link>
                <Link to="/give-classes" className="give-classes">
                    <img src={giveClassIcon} 
                        alt="Plataforma de Estudos" 
                        className="Dar aulas"
                    />
                    Dar aula
                    </Link>
            </div>
              <span className='total-connections'>
                Total de {totalConnections} conexões já realizadas
                <img src={purpleHeartIcon} alt="Coração roxo" />  
              </span>  
        </div>
    </div>
  );
}

export default Landing;