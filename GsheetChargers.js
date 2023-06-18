import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';

function GsheetChargers({ navigation }) {
  const [assetData, setAssetData] = useState([]);
  const [mapRegion, setMapRegion] = useState();

  useEffect(() => {
    getAssetLocationData();
  }, []);

  const getAssetLocationData = async () => {
    try {
      const spreadsheetId = '1_b9TqpzveAmrV9q_lSH2RMUXy9fYZPdl6nqe7OVgNKM';
      const sheetName = 'Sheet2';
      const apiKey = 'AIzaSyAGkC9ZZ_AbyEtTA5KQxrW_FpeExp0zgTQ';
      const range = `${sheetName}!A2:D`;

      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
        `https://sheets.googleapis.com/v4/spreadsheets/1_b9TqpzveAmrV9q_lSH2RMUXy9fYZPdl6nqe7OVgNKM/values/!A2:D?key=AIzaSyAGkC9ZZ_AbyEtTA5KQxrW_FpeExp0zgTQ`

      );

      const data = response.data.values;
      const chargers = data.map((row) => ({
        id: row[0],
        icon: 'ev-station',
        coordinates: [parseFloat(row[1]), parseFloat(row[2])],
        title: row[3],
      }));

      setAssetData(chargers);

      if (chargers.length > 0) {
        const firstAsset = chargers[0];
        setMapRegion({
          latitude: firstAsset.coordinates[0],
          longitude: firstAsset.coordinates[1],
          latitudeDelta: 0.1,
          longitudeDelta: 0.09,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Rendering
  return <View style={styles.container}>{/* Rest of your component code */}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Rest of the styles
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  marker: {
    width: 67,
    height: 30,
  },
  pullBottom: {
    backgroundColor: 'ffffff00',
    opacity: 1,
    height: Dimensions.get('window').height / 8,
    width: '100%',
    position: 'absolute',
    bottom: 15,
    borderTopEndRadius: 25,
    borderTopLeftRadius: 25,
  },
  pullTop: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'ffffff00',
    opacity: 0.8,
    height: 50,
    width: '90%',
    position: 'absolute',
    top: 55,
    borderRadius: 0,
    alignSelf: 'center',
    padding: 10,
    visible: false,
  },
  line: {
    width: 75,
    height: 6,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 2,
  },
  topTxt: {
    color: 'FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default GsheetChargers;
