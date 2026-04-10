import ScreenLayout from '../../../styles/screenlayout';
import { View, ScrollView } from "react-native";
import { Text } from 'react-native-paper';
import styles from '../../../styles/index.styles';
import ListingCard from '@/components/ListingCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import AppHeader from '@/components/AppHeader';

export default function Home() {

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <AppHeader notifications={3} />

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

    </ScreenLayout >
  );
}

