import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from '@/styles/post.styles';
import ScreenLayout from "@/styles/screenlayout";


export default function AddListingScreen() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  return (
    <ScreenLayout>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.headerTitle}>Post Listing</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>

          {/* IMAGE UPLOAD */}
          <View style={styles.card}>
            <Text style={styles.label}>Photos</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Pressable style={styles.imageBox}>
                <Ionicons name="camera" size={26} color="#666" />
                <Text style={styles.smallText}>Add</Text>
              </Pressable>

              <Pressable style={styles.imageBox}>
                <Ionicons name="add" size={26} color="#666" />
              </Pressable>

              <Pressable style={styles.imageBox}>
                <Ionicons name="add" size={26} color="#666" />
              </Pressable>
            </ScrollView>
          </View>

          {/* BASIC INFO */}
          <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              placeholder="e.g. Hand Tractor for Rent"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <Text style={styles.label}>Category</Text>
            <Pressable style={styles.selectBox}>
              <Text style={styles.selectText}>Select Category</Text>
              <Ionicons name="chevron-down" size={18} />
            </Pressable>

            <Text style={styles.label}>Condition</Text>
            <View style={styles.row}>
              <Pressable style={styles.option}><Text>New</Text></Pressable>
              <Pressable style={styles.option}><Text>Used</Text></Pressable>
            </View>
          </View>

          {/* PRICING */}
          <View style={styles.card}>
            <Text style={styles.label}>Price per day</Text>
            <View style={styles.priceBox}>
              <Text style={styles.currency}>₱</Text>
              <TextInput
                placeholder="0"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={styles.priceInput}
              />
            </View>
          </View>

          {/* LOCATION */}
          <View style={styles.card}>
            <Text style={styles.label}>Location</Text>

            <Pressable style={styles.locationBtn}>
              <Ionicons name="location" size={18} color="#2E7D32" />
              <Text style={{ marginLeft: 8 }}>Use current location</Text>
            </Pressable>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.card}>
            <Text style={styles.label}>Description</Text>

            <TextInput
              placeholder="Describe your tool..."
              multiline
              style={styles.textArea}
            />
          </View>

        </ScrollView>

        {/* POST BUTTON */}
        <Pressable style={styles.postBtn}>
          <Text style={styles.postText}>POST LISTING</Text>
        </Pressable>

      </View>
    </ScreenLayout>
  );
}
