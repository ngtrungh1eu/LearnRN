import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import { Button, Title, Paragraph } from "react-native-paper";
import { useFavorite } from "../contexts/FavoriteContext";

const { width } = Dimensions.get("window");

const ProductDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { product } = route.params;
  const { isFavorite, addFavorite, removeFavorite } = useFavorite();

  const handleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button icon={isFavorite(product.id) ? "heart" : "heart-outline"} onPress={handleFavorite}>
          {isFavorite(product.id) ? "Unfavorite" : "Favorite"}
        </Button>
      ),
    });
  }, [navigation, isFavorite, product.id]);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.infoContainer}>
        <Title style={styles.title}>{product.name}</Title>
        <Paragraph style={styles.price}>${product.price}</Paragraph>
        <Paragraph style={styles.description}>{product.description}</Paragraph>
        <View style={styles.specContainer}>
          <Title style={styles.specTitle}>Specifications:</Title>
          <Paragraph>• Sensor: {product.sensor}</Paragraph>
          <Paragraph>• Resolution: {product.resolution}</Paragraph>
          <Paragraph>• ISO Range: {product.isoRange}</Paragraph>
          <Paragraph>• Shutter Speed: {product.shutterSpeed}</Paragraph>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: width,
    height: width,
    backgroundColor: "#f0f0f0",
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: "#4CAF50",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  specContainer: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
  },
  specTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default ProductDetailScreen;
