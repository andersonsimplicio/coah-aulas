import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Image, Text, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png'
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png'
import whatsappIcon from '../../assets/images/icons/whatsapp.png'
import api from '../../services/api';

import styles from './styles';

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

interface Class {
  from: number;
  to: number;
  week_day: number;
}

export interface Coach {
  id: number;
  avatar: string;
  bio: string;
  cost: number;
  name: string;
  subject: string;
  whatsapp: string;
  classes: Class[];
}

interface CoachItemProps {
  coach: Coach;
  favorited: boolean;
}

const CoachItem: React.FC<CoachItemProps> = ({ coach, favorited }) => {
  const [isFavorited, setIsFavorited] = useState(favorited);
  
  function handleLinkToWhatsapp() {
    api.post('connections', {
      coach_id: coach.id,
    });

    Linking.openURL(`whatsapp://send?phone=${coach.whatsapp}`);
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
  async function handleToggleFavorite() {
    const favorites = await AsyncStorage.getItem('favorites');

    let favoritesArray = [];

    if (favorites) {
      favoritesArray = JSON.parse(favorites);
    }

    if (isFavorited) {
      const favoriteIndex = favoritesArray.findIndex((coachItem: Coach) => {
        return coachItem.id === coach.id;
      });
 
      favoritesArray.splice(favoriteIndex, 1);

      setIsFavorited(false);
    } else {
      favoritesArray.push(coach);

      setIsFavorited(true);
    }

    await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image 
          style={styles.avatar}
          source={{ uri: coach.avatar }}
        />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{coach.name}</Text>
          <Text style={styles.subject}>{coach.subject}</Text>
        </View>
      </View>
     
      <Text style={styles.bio}>
        {coach.bio}
      </Text>
        <Text>Dia da Semana e Horários</Text>
          {coach.classes.map((classItem) => (
                <Text key={`${classItem.from}${classItem.to}`} >
                <Text>Dia: {getDayOfWeek(classItem.week_day)}{'\n'}</Text>
                <Text>{`${formatarTempo(classItem.from)} - ${formatarTempo(classItem.to)}`}{'\n'}</Text>
          </Text>
          ))}
      <View style={styles.footer}>
        <Text style={styles.price}>
          Preço/hora {'   '}
          <Text style={styles.priceValue}>R$ {coach.cost}</Text>
        </Text>

        <View style={styles.buttonsContainer}>
          <RectButton 
            onPress={handleToggleFavorite}
            style={[
              styles.favoriteButton, 
              isFavorited ? styles.favorited : {}
            ]}
          >
            { isFavorited
              ? <Image source={unfavoriteIcon} />
              : <Image source={heartOutlineIcon} />
            }
          </RectButton>

          <RectButton onPress={handleLinkToWhatsapp} style={styles.contactButton}>
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>


    </View>
  );
}

export default CoachItem;