import ScreenLayout from '../../../styles/screenlayout';
import { View, Image, ScrollView } from "react-native";
import { IconButton, Badge } from 'react-native-paper';
import { Text } from 'react-native-paper';
import styles from '../../../styles/index.styles';
import { Ionicons } from '@expo/vector-icons';
import ListingCard from '@/components/ListingCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';

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
          <View style={styles.headerLeft}>
            <Image
              style={styles.profilePic}
              source={require("../../../../assets/raft/logo.png")}
            />

            <Text style={styles.appTitle}>
              Rent a Farm Tool
            </Text>
          </View>
          <View style={styles.notification}>
            <View style={styles.bellWrapper}>
              <IconButton
                icon={({ size }) => (
                  <Ionicons name="notifications-outline" size={size} color="#000000" />
                )}
                size={24}
                onPress={() => console.log("Notification pressed")}
              />
            </View>

            {notifications > 0 && (
              <Badge style={styles.notificationBadge}>
                {notifications}
              </Badge>
            )}
          </View>
        </View>

        <View style={styles.main}>

          <SearchBar />
          <CategoryFilter />
          <Text style={styles.headingText}>
            Recent Listings in Cavite
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <ListingCard />
            <ListingCard />
            <ListingCard />
          </ScrollView>
        </View>



      </View>

    </ScreenLayout>
  );
}

