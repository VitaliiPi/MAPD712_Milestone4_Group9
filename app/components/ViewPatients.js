import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-simple-toast';

var url = 'http://127.0.0.1:3009';

export default function ViewPatients({navigation, route}) {
  const [isLoading, setLoading] = useState(true);
  const [patientsList, setPatientsList] = useState([]);
  console.log('view all patients');
  // load list of patients
  const loadData = () => {
    console.log('loading all patients');
    fetch(url + '/patients')
      .then((response) => response.json())
      .then((json) => setPatientsList(json))
      .catch((error) => Toast.show(error.message, Toast.LONG))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      loadData();
    });
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('AddPatient', {
              patient: '',
              user_id: route.params.user_id,
            })
          }>
          <Text style={styles.buttonText}>{'  +  '}</Text>
        </TouchableOpacity>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.firstColumn, styles.defaultFont]} />
        <Text style={[styles.secondColumn, styles.defaultFont]}>Name</Text>
        <Text style={[styles.thirdColumn, styles.defaultFont]}>State</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={patientsList.sort(function (a, b) {
            let aname = a.name.toLowerCase();
            let bname = b.name.toLowerCase();

            if (a.in_critical_condition === b.in_critical_condition) {
              return aname < bname ? -1 : aname > bname ? 1 : 0;
            } else {
              return a.in_critical_condition ? -1 : 1;
            }
          })}
          renderItem={({item}) => (
            <ListItem
              item={item}
              navigation={navigation}
              user_id={route.params.user_id}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  firstColumn: {
    flex: 2,
    padding: 5,
  },
  secondColumn: {
    flex: 10,
    padding: 5,
    fontSize: 18,
  },
  thirdColumn: {
    flex: 2,
    padding: 5,
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'crimson',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 6,
    margin: 5,
    alignSelf: 'flex-end',
  },
  defaultFont: {
    fontFamily: 'serif',
  },
  buttonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 24,
  },
});
// Each item of the list is photo, full name, and status picture that redirect to patient's screen
function ListItem(props) {
  let image, critical;
  if (props.item.photo !== undefined) {
    image = <Image source={{uri: props.item.photo}} style={listStyles.image} />;
  } else {
    image = (
      <Image
        source={require('../assets/person-icon.png')}
        style={listStyles.image}
      />
    );
  }
  critical = (
    <Image
      source={
        props.item.in_critical_condition
          ? require('../assets/critical_condition.png')
          : require('../assets/ok_state.png')
      }
      style={listStyles.image}
    />
  );

  return (
    <TouchableOpacity
      key={props.item.id}
      style={listStyles.container}
      onPress={() =>
        props.navigation.navigate('ViewPatient', {
          patient: props.item,
          user_id: props.user_id,
        })
      }>
      {image}
      <Text style={listStyles.text}>{props.item.name}</Text>
      {critical}
    </TouchableOpacity>
  );
}
const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  image: {
    flex: 2,
    alignSelf: 'center',
    resizeMode: 'center',
    paddingVertical: 5,
    height: 60,
  },
  text: {
    fontFamily: 'serif',
    alignSelf: 'center',
    marginBottom: 10,
    padding: 5,
    fontSize: 20,
    flex: 10,
  },
});
