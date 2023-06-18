import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';

function GsheetChargers1({ navigation }) {
  const [assetData, setAssetData] = useState([]);
  const [mapRegion, setMapRegion] = useState();

  useEffect(() => {
    getAssetLocationData();
  }, []);

  const getAssetLocationData = async () => {
    try {
      const spreadsheetId = '1_b9TqpzveAmrV9q_lSH2RMUXy9fYZPdl6nqe7OVgNKM';
      const sheetName = 'Sheet1';
      const apiKey = 'AIzaSyAGkC9ZZ_AbyEtTA5KQxrW_FpeExp0zgTQ';

      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A2:E`,
        {
          params: {
            key: apiKey,
          },
        }
      );

      const data = response.data.values;
      const markers = data.map((row) => ({
        latitude: parseFloat(row[0]),
        longitude: parseFloat(row[1]),
        station: row[2],
        services: row[3],
        time: row[4],
      }));

      setAssetData(markers);

      if (markers.length > 0) {
        const firstMarker = markers[0];
        setMapRegion({
          latitude: firstMarker.latitude,
          longitude: firstMarker.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.09,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkerPress = (marker) => {
    console.log(`Station: ${marker.station}`);
    console.log(`Services: ${marker.services}`);
    console.log(`Time: ${marker.time}`);
    // Add your logic to display the information as desired (e.g., in a modal)
  };

  const CustomMarkerCallout = ({ marker }) => (
    <Callout>
      <View>
      <Text style={styles.calloutTitle}>{marker.station}</Text>
        <Text style={styles.calloutText}>{marker.services}</Text>
        <Text style={styles.calloutText}>{marker.time}</Text>
      </View>
    </Callout>
  );

  return (
    <View style={styles.container}>
      {mapRegion && (
        <MapView style={styles.map} region={mapRegion}>
          {assetData.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              onPress={() => handleMarkerPress(marker)}
              title={marker.station} // Displaying the station as the marker's title
              description={marker.services} // Displaying the services in the marker's description
            >
              <CustomMarkerCallout marker={marker} />
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  calloutText: {
    padding: 10,
    fontSize: 14,
    maxWidth: 200,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    // marginBottom: 5,
  },

});

export default GsheetChargers1;
