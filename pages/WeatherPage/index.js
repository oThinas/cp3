import { View, Text, Button, Switch } from 'react-native';
import WeatherChart from '../../components/WeatherChart';
import { useEffect, useState } from 'react';
import { getForecast } from '../../apis/api-weather';
import { DEFAULT_LOCATION, DEFAULT_CITY_NAME } from '../../constants';
import ChangeModal from './ChangeModal';
import { buildCityText, getTemperatureDomain } from '../../utils';
import { styles } from './styles';

const WeatherPage = () => {
  const [data, setData] = useState();
  const [city, setCity] = useState(DEFAULT_CITY_NAME);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [modalVisible, setModalVisible] = useState(false);
  const [isApparentTemperature, setIsApparentTemperature] = useState(false);

  useEffect(() => {
    getForecast(location).then((res) => {
      setData(res.data);
    });
  }, [location])

  const hours = data ? data.hourly.time : [];
  const temperatures = data ? data.hourly.temperature_2m : [];
  const apparentTemperatures = data ? data.hourly.apparent_temperature : [];
  const rainProbabilities = data ? data.hourly.precipitation_probability : [];

  const onLocationSelected = (location) => {
    setLocation({lat: location.latitude, long: location.longitude});
    setCity(buildCityText(location))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {city}
      </Text>
      <Button
        title={'Mudar localização'}
        onPress={() => setModalVisible(!modalVisible)}
      />
      <View style={styles.switch}>
        <Text>
          Temperatura
        </Text>
        <Switch
          value={isApparentTemperature}
          onValueChange={setIsApparentTemperature}
        />
        <Text>
          Sensação Térmica
        </Text>
      </View>
      {isApparentTemperature ? (
        <WeatherChart 
          yDomain={getTemperatureDomain(apparentTemperatures)}
          hours={hours}
          values={apparentTemperatures}
          color={{
            to: '#36d',
            from: '#d61',
            line: '#555'
          }}
          title={'Sensação Térmica (oC)'}
        />
      ) : (
        <WeatherChart 
          yDomain={getTemperatureDomain(temperatures)}
          hours={hours}
          values={temperatures}
          color={{
            to: '#36d',
            from: '#d61',
            line: '#555'
          }}
          title={'Temperatura (oC)'}
        />
      )}
      <WeatherChart 
        yDomain={{ min: 0, max: 100 }}
        hours={hours}
        values={rainProbabilities}
        color={{
          to: '#ddf',
          from: '#14a',
          line: '#555'
        }}
        title={'Chance de preciptação (%)'}
      />
      <ChangeModal 
        visible={modalVisible}
        onCloseRequest={() => setModalVisible(false)}
        onLocationSelected={onLocationSelected}
      />
    </View>
  );
}

export default WeatherPage;
