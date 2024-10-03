import React from "react";
import camera from "../mock/camera.json";
import { View, FlatList, Dimensions, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Card, Title, Button, TextInput, Icon, MD3Colors } from "react-native-paper";
import { useFavorite } from "../contexts/FavoriteContext";

const { width } = Dimensions.get("window");
const cardWidth = (width - 32) / 2; // 2 columns with 16px padding on each side

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorite();
  const [text, setText] = React.useState("");
  const handleFavorite = (item: { id: string; name: string; image: string }) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };
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
            icon={isFavorite(item.id) ? "heart" : "heart-outline"}
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              handleFavorite(item);
            }}
          >
            {isFavorite(item.id) ? "Unfavorite" : "Favorite"}
          </Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        mode="outlined"
        value={text}
        onChangeText={(text) => setText(text)}
        outlineColor="#ccc"
        cursorColor="#ccc"
        activeOutlineColor="#ccc"
        placeholder="Find you need..."
        placeholderTextColor={"#aaa"}
        left={<TextInput.Icon style={styles.searchLeft} icon="card-search-outline" rippleColor="transparent" />}
      />
      <FlatList data={camera} numColumns={2} renderItem={renderProductCard} keyExtractor={(item) => item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  searchBox: {
    margin: 16,
    width: "90%",
    backgroundColor: "transparent",
    height: 35,
    borderRadius: 10,
  },
  searchLeft: {
    backgroundColor: "red",
    borderRadius: 0,
    marginRight: 15,
  },
  card: {
    margin: 4,
    width: cardWidth,
  },
  cardImage: {
    borderRadius: 20,
    height: cardWidth, // Square image
    backgroundColor: "#f0f0f0", // Light gray background for images
  },
  title: {
    fontSize: 14,
    marginTop: 8,
    height: 40, // Fixed height for two lines of text
  },
  cardActions: {
    justifyContent: "center",
  },
  favoriteButton: {
    marginLeft: 0,
  },
});

export default HomeScreen;
