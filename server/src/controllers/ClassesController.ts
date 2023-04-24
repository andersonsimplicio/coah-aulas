import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

type CoachSchedule = {
  week_day: number;
  from: number;
  to: number;
  class_id: number;
};
//Interface criada para realizar o agrupamento de horários de um determinado PRofessor
interface CoachClasses {
  id: number;
  name: string;
  avatar: string;
  whatsapp: string;
  bio: string;
  classes: Array<{
    week_day: number;
    from: number;
    to: number;
  }>;
}



interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const week_day = filters.week_day as string;
    const subject = filters.subject as string;
    const time = filters.time as string;

    if ((!filters.week_day) || (!filters.subject) || (!filters.time)) {
      return response.status(400).json({
        error: 'Missing filters to search classes'
      });
    }
  
    const timeInMinutes = convertHourToMinutes(time);

    const classes = await db('classes')
    .whereExists(function() {
      this.select('class_schedule.*')
        .from('class_schedule')
        .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
        .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
        .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
        .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
    })
    .where('classes.subject', '=', subject)
    .join('coaches', 'classes.coach_id', '=', 'coaches.id')
    .join('class_schedule', 'class_schedule.class_id', '=', 'classes.id')
    .select(['classes.*', 'coaches.*','class_schedule.*']);

    const coachesClasses: { [key: number]: CoachClasses } = {};

    classes.forEach(current => {
      if (!coachesClasses[current.coach_id]) {
        // Se o treinador ainda não foi adicionado, cria um novo objeto para ele
        coachesClasses[current.coach_id] = {
          id: current.coach_id,
          name: current.name,
          avatar: current.avatar,
          whatsapp: current.whatsapp,
          bio: current.bio,
          classes: [],
        };
      }
      // Adiciona a aula ao array de aulas do treinador
      coachesClasses[current.coach_id].classes.push({
        week_day: current.week_day,
        from: current.from,
        to: current.to,
      });
    });

  // Converte o objeto em array
  const coachesClassesArray = Object.values(coachesClasses);
    
      return response.json(coachesClassesArray);
    }
  
  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = request.body;
  
    const trx = await db.transaction();
  
    try {
      const insertedCoachesIds = await trx('coaches').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });
    
      const coach_id = insertedCoachesIds[0];
    
      const insertedClassesIds = await trx('classes').insert({
        subject,
        cost,
        coach_id,
      });
    
      const class_id = insertedClassesIds[0];
    
      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });
    
      await trx('class_schedule').insert(classSchedule);
    
      await trx.commit();
    
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
  
      return response.status(400).json({
        error: 'Unexpected error while creating new class'
      });
    }
  }
}