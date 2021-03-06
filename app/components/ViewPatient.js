import React, {useEffect, useState} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  FlatList,
  StyleSheet,
  BackHandler,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
var url = 'https://patientrecordsgroup.herokuapp.com';

// provide information about patient, and his vitals
export default function ViewPatient({navigation, route}) {
  const [isLoading, setLoading] = useState(true);
  const [VitalsList, setVitalsList] = useState([]);
  var patient = route.params.patient;
  console.log('view of patient with id', patient._id);
  // load list of vitals

  const getVitals = () => {
    fetch(url + `/patients/${patient._id}/records`)
      .then((response) => response.json())
      .then((json) => setVitalsList(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getVitals();
      console.log('reload vitals');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('ViewPatients');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{alignSelf: 'flex-end'}}>
          <Image
            source={
              patient.in_critical_condition
                ? require('../assets/critical_condition.png')
                : require('../assets/ok_state.png')
            }
            style={styles.image}
          />
        </View>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <View style={styles.inLine}>
        <Text style={styles.firstColumn}>Room</Text>
        <Text style={styles.secondColumn}>{patient.room}</Text>
      </View>

      <View style={styles.inLine}>
        <Text style={styles.firstColumn}>Phone number</Text>
        <Text style={styles.secondColumn}>{patient.phone_number}</Text>
      </View>

      <View style={styles.inLine}>
        <Text style={styles.firstColumn}>Address</Text>
      </View>
      <View style={{maxHeight: 120}}>
        <ScrollView nestedScrollEnabled={true}>
          <Text
            style={{
              paddingHorizontal: 10,
              fontSize: 18,
              fontFamily: 'serif',
              textAlignVertical: 'top',
            }}>
            {patient.address}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.inLine}>
        <Text style={styles.firstColumn}>Notes</Text>
      </View>
      <View style={{maxHeight: 90, borderWidth: 1, borderColor: '#0005'}}>
        <ScrollView nestedScrollEnabled={true}>
          <Text
            style={{
              paddingHorizontal: 10,
              fontSize: 18,
              textAlignVertical: 'top',
              fontFamily: 'serif',
            }}>
            {patient.notes}
          </Text>
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.leftHalf]}
        onPress={() =>
          navigation.navigate('AddVitals', {patient: patient, vital: ''})
        }>
        <Text style={styles.buttonText}>Add Vitals</Text>
      </TouchableOpacity>

      <ScrollView nestedScrollEnabled={true}>
        <View styles={{alignItems: 'stretch'}}>
          {isLoading || VitalsList.length === 0 ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              style={{borderWidth: 1, borderColor: '#0005'}}
              data={VitalsList.reverse()}
              renderItem={({item}) => (
                <ListItem
                  item={item}
                  navigation={navigation}
                  patient={patient}
                />
              )}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.button, styles.leftHalf, {}]}
          onPress={() =>
            navigation.navigate('AddPatient', {
              patient: patient,
              user_id: route.params.user_id,
            })
          }>
          <Text style={styles.buttonText}>{'Edit'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
  },
  image: {
    resizeMode: 'center',
    paddingVertical: 5,
    height: 60,
    width: 60,
  },
  inLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  firstColumn: {
    fontFamily: 'serif',
    flex: 3,
    fontSize: 20,
    marginRight: 10,
  },
  secondColumn: {
    fontFamily: 'serif',
    flex: 4,
    fontSize: 20,
  },
  multiline: {
    fontFamily: 'serif',
    fontSize: 20,
  },
  button: {
    backgroundColor: 'crimson',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 6,
    margin: 5,
  },
  leftHalf: {
    alignSelf: 'flex-end',
    width: '50%',
  },
  buttonText: {
    fontFamily: 'serif',
    color: 'white',
    alignSelf: 'center',
    fontSize: 24,
  },
  bottom: {
    justifyContent: 'flex-end',
  },
});

function ListItem(props) {
  function checkVital(vital, text) {
    if (vital !== '') {
      return <Text style={list.text}>{text}</Text>;
    }
  }
  let date = new Date(props.item.date);
  return (
    <TouchableOpacity
      key={props.item.id}
      style={list.container}
      onPress={() =>
        props.navigation.navigate('ViewVitals', {
          vital: props.item,
          patient: props.patient,
        })
      }>
      <View style={{marginBottom: 10, padding: 5}}>
        <Text style={list.text}>
          {date.getDate() +
            '-' +
            date.getMonth() +
            '-' +
            date.getFullYear() +
            '\n' +
            date.getHours() +
            '-' +
            date.getMinutes()}
        </Text>
      </View>
      <View style={{marginStart: 20, marginBottom: 10, padding: 5}}>
        {checkVital(props.item.bloodPresure, 'Blood Presure')}
        {checkVital(props.item.respiratoryRate, 'Respiratory Rate')}
        {checkVital(props.item.bloodOxigen, 'Blood Oxigen')}
        {checkVital(props.item.hearthRate, 'Hearth Rate')}
      </View>
      <View style={{flex: 1, alignItems: 'flex-end'}}>
        <View
          style={{
            marginBottom: 10,
            padding: 5,
            flex: 1,
            alignItems: 'flex-end',
          }}>
          {checkVital(props.item.bloodPresure, props.item.bloodPresure)}
          {checkVital(props.item.respiratoryRate, props.item.respiratoryRate)}
          {checkVital(props.item.bloodOxigen, props.item.bloodOxigen)}
          {checkVital(props.item.hearthRate, props.item.hearthRate)}
        </View>
      </View>
    </TouchableOpacity>
  );
}
const list = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#0005',
  },
  text: {
    fontSize: 20,
    fontFamily: 'serif',
  },
});
