import ScreenLayout from '../../../styles/screenlayout';
import { View, Image } from "react-native";
import { IconButton, Badge } from 'react-native-paper';
import { Text } from 'react-native-paper';
import styles from '../../../styles/index.styles';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const notifications = 3;
  const details = [
    { label: 'Model', value: 'Ferrari SF-25' },
    { label: 'Type', value: 'Tractor' },
    { label: 'Year', value: '2025' },
    { label: 'Condition', value: 'Used' },
    { label: 'Description', value: 'for rent, orig OR/CR' },
  ];
  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.profilePic}
            source={require('../../../../assets/raft/logo.png')} />
          <View style={styles.notification}>
            <IconButton
              icon={({ size }) => (
                <Ionicons name='notifications-outline' size={size} color={'#000000'} />
              )}
              size={24}
              style={styles.notificationIcon}
              onPress={() => console.log("Notification pressed")}
            />
            {notifications > 0 && (
              <Badge
                size={16}
                style={styles.notificationBadge}>
                {notifications}
              </Badge>
            )}
          </View>

        </View>

        <View style={styles.main}>
          <Text style={styles.headingText}>Recent Listings</Text>
          <View style={styles.listings}>
            <Image
              style={styles.listingImg}
              source={{ uri: 'https://www.autohebdo.fr/app/uploads/2025/02/SF-25-34.jpg', }}
            />
            <View style={styles.listingDescription}>
              <Text style={styles.listingHeading}>Tractor</Text>
              {details.map((item, index) => (
                <Text key={index} style={styles.listingDescText}>
                  {item.label}: {item.value}
                </Text>
              ))}
            </View>


          </View>
          <View style={styles.listings}>
            <Image
              style={styles.listingImg}
              source={{ uri: 'https://www.autohebdo.fr/app/uploads/2025/02/SF-25-34.jpg', }}
            />
            <View style={styles.listingDescription}>
              <Text style={styles.listingHeading}>Listing 2</Text>
              {details.map((item, index) => (
                <Text key={index} style={styles.listingDescText}>
                  {item.label}: {item.value}
                </Text>
              ))}
            </View>


          </View>

        </View>

      </View>
    </ScreenLayout>
  );
}

