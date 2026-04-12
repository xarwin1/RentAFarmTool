import React, { useState } from "react";
import { View, ScrollView, TextInput, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createPostStyles from "@/styles/post.styles";
import ScreenLayout from "@/styles/screenlayout";
import { useTheme } from "@/theme/ThemeContext";

export default function AddListingScreen() {
  const { theme } = useTheme();
  const styles = createPostStyles(theme);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
          <Text style={styles.headerTitle}>Post Listing</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* IMAGE UPLOAD */}
          <View style={styles.card}>
            <Text style={styles.label}>Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Pressable style={styles.imageBox}>
                <Ionicons name="camera" size={26} color={theme.subtext} />
                <Text style={styles.smallText}>Add</Text>
              </Pressable>
              <Pressable style={styles.imageBox}>
                <Ionicons name="add" size={26} color={theme.subtext} />
              </Pressable>
              <Pressable style={styles.imageBox}>
                <Ionicons name="add" size={26} color={theme.subtext} />
              </Pressable>
            </ScrollView>
          </View>

          {/* BASIC INFO */}
          <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              placeholder="e.g. Hand Tractor for Rent"
              placeholderTextColor={theme.subtext}
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <Text style={styles.label}>Category</Text>
            <Pressable style={styles.selectBox}>
              <Text style={styles.selectText}>Select Category</Text>
              <Ionicons name="chevron-down" size={18} color={theme.text} />
            </Pressable>
            <Text style={styles.label}>Condition</Text>
            <View style={styles.row}>
              <Pressable style={styles.option}>
                <Text style={styles.optionText}>New</Text>
              </Pressable>
              <Pressable style={styles.option}>
                <Text style={styles.optionText}>Used</Text>
              </Pressable>
            </View>
          </View>

          {/* PRICING */}
          <View style={styles.card}>
            <Text style={styles.label}>Price per day</Text>
            <View style={styles.priceBox}>
              <Text style={styles.currency}>₱</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor={theme.subtext}
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
              <Ionicons name="location" size={18} color={theme.primary} />
              <Text style={styles.locationText}>Use current location</Text>
            </Pressable>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.card}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Describe your tool..."
              placeholderTextColor={theme.subtext}
              multiline
              style={styles.textArea}
            />
          </View>
          <Pressable style={styles.postBtn}>
            <Text style={styles.postText}>POST LISTING</Text>
          </Pressable>
        </ScrollView>

      </View>
    </ScreenLayout>
  );
}
