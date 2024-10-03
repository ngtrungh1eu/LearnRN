// src/screens/FavoriteScreen.tsx
import React from "react";
import { View, FlatList, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Title, Button } from "react-native-paper";
import { useFavorite } from "../contexts/FavoriteContext";

const { width } = Dimensions.get("window");
const cardWidth = (width - 32) / 2;

const FavoriteScreen = ({ navigation }: { navigation: any }) => {
  const { favorites, removeFavorite } = useFavorite();

  const renderProductCard = ({ item }: { item: { id: string; name: string; image: string } }) => (
    <TouchableOpacity onPress={() => navigation.navigate("ProductDetail", { product: item })}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
        <Card.Content>
          <Title numberOfLines={2} style={styles.title}>
            {item.name}
          </Title>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            icon="heart"
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              removeFavorite(item.id);
            }}
          >
            Unfavorite
          </Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!favorites.length ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Title>No favorites yet</Title>
        </View>
      ) : (
        <FlatList
          data={favorites}
          numColumns={2}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  card: {
    margin: 4,
    width: cardWidth,
  },
  cardImage: {
    borderRadius: 20,
    height: cardWidth,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 14,
    marginTop: 8,
    height: 40,
  },
  cardActions: {
    justifyContent: "center",
  },
  favoriteButton: {
    marginLeft: 0,
  },
});

export default FavoriteScreen;
