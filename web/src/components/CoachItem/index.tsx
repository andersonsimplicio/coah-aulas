import React from 'react';
import whatsappIcon from '../../assets/images/icons/whatsapp.svg';
import './styles.css';
import api from '../../services/api';


export interface Coach {
  classes: any;
  id: number;
  avatar: string;
  bio: string;
  cost: number;
  name: string;
  subject: string;
  whatsapp: string;
}

interface CoachItemProps {
  coach: Coach;
}

const CoachItem: React.FC<CoachItemProps> = ({ coach }) => {
  function createNewConnection() {
    api.post('connections', {
      coach_id: coach.id,
    });
  }

  function getDayOfWeek(dayNumber:String| number | undefined) {
    switch (dayNumber) {
      case 0:
        return "Domingo";
      case 1:
        return "Segunda-feira";
      case 2:
        return "Terça-feira";
      case 3:
        return "Quarta-feira";
      case 4:
        return "Quinta-feira";
      case 5:
        return "Sexta-feira";
      case 6:
        return "Sábado";
      default:
        throw new Error("Número de dia inválido!");
    }
  }
  


  function formatarTempo(minutos: string | number | boolean | React.ReactElement | React.ReactNode | null | undefined): string {
    
    
    if (typeof minutos === 'string' || typeof minutos === 'number') {
      const totalMinutos = Number(minutos);
      const hours = Math.floor(totalMinutos / 60);
      const mins = totalMinutos % 60;
      const formattedHours = hours.toString().padStart(2, '0');
     
      const formattedMins = mins.toString().padStart(2, '0');
      return `${formattedHours}:${formattedMins}`;
    }
    return '';
  }

  return (
    <article className="coach-item">
      <header>
        <img src={coach.avatar} alt={coach.name} />
        <div>
          <strong>{coach.name}</strong>
          <span>{coach.subject}</span>
        </div>
      </header>

      <p>{coach.bio}</p>
      <br />
      <p>Horarios</p>
     
        
      {coach.classes.map((classItem: { id: React.Key | null | undefined; name: string ; week_day: number | undefined; from: string | number | boolean; to: string | number | string | undefined; }) => (
        <div className="classes" key={`${classItem.from}${classItem.to}`}>
            <div key={classItem.id} className="class-item">
              <p>Dia da semana: {getDayOfWeek(classItem.week_day)}</p>
              {formatarTempo(classItem.from)}-{formatarTempo(classItem.to)}    
            </div>
        </div>
      ))}

      
      <footer>
        <p>Preço/Hora
          <strong>R$ {coach.cost}</strong>
        </p>
        
        <a
          target="_blank" 
          onClick={createNewConnection} 
          href={`https://wa.me/${coach.whatsapp}`} rel="noreferrer"
        >
          <img src={whatsappIcon} alt="Whatsapp"/>
          Entrar em contato
        </a>
      </footer>
     
    </article>
  );
}

export default CoachItem;