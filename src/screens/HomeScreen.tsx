import React, { useCallback, useMemo, useState, useEffect } from "react";
import { View, FlatList, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Title, TextInput, MD3Colors, IconButton, Snackbar, Chip } from "react-native-paper";
import { useFavorite } from "../contexts/FavoriteContext";
import { ArtSupply } from "../types/type";

const { width } = Dimensions.get("window");
const cardWidth = (width - 32) / 2;

const fetchProducts = async (): Promise<ArtSupply[]> => {
  try {
    const response = await fetch("https://64b393870efb99d86268181e.mockapi.io/api/v1/color");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorite();
  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [products, setProducts] = useState<ArtSupply[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      console.log("Fetched products:", fetchedProducts);
      console.log("Component mounted");
      setProducts(fetchedProducts);
    };
    loadProducts();
  }, []);

  const brands = useMemo(
    () => Array.from(new Set(products.map((item) => item.brand || "Unknown").filter(Boolean))),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter(
      (item) =>
        item.artName.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedBrand ? (item.brand || "Unknown") === selectedBrand : true)
    );
  }, [products, searchText, selectedBrand]);

  const handleFavorite = useCallback(
    (item: ArtSupply) => {
      if (isFavorite(item.id)) {
        removeFavorite(item.id);
        setSnackbarMessage(`Removed ${item.artName} from favorites`);
      } else {
        addFavorite(item);
        setSnackbarMessage(`Added ${item.artName} to favorites`);
      }
      setSnackbarVisible(true);
    },
    [addFavorite, removeFavorite, isFavorite]
  );

  const renderProductCard = useCallback(
    ({ item }: { item: ArtSupply }) => (
      <TouchableOpacity onPress={() => navigation.navigate("ProductDetail", { product: item })}>
        <Card style={styles.card}>
          <Card.Cover source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
          <Card.Content>
            <Title numberOfLines={2} style={styles.title}>
              {item.artName}
            </Title>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <IconButton
              style={styles.favoriteButton}
              icon={isFavorite(item.id) ? "heart" : "heart-outline"}
              iconColor={MD3Colors.error50}
              size={30}
              onPress={(e) => {
                e.stopPropagation();
                handleFavorite(item);
              }}
            />
          </Card.Actions>
        </Card>
      </TouchableOpacity>
    ),
    [navigation, isFavorite, handleFavorite]
  );

  const renderBrandItem = ({ item }: { item: string }) => (
    <Chip
      mode="outlined"
      style={[styles.brandChip, selectedBrand === item && styles.selectedBrandChip]}
      textStyle={[styles.brandChipText, selectedBrand === item && styles.selectedBrandChipText]}
      onPress={() => setSelectedBrand(selectedBrand === item ? null : item)}
    >
      {item}
    </Chip>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        mode="outlined"
        value={searchText}
        onChangeText={setSearchText}
        outlineColor="#ccc"
        cursorColor="#ccc"
        activeOutlineColor="#ccc"
        placeholder="Find what you need..."
        placeholderTextColor={"#aaa"}
        left={
          <TextInput.Icon
            icon="magnify"
            style={styles.searchLeft}
            rippleColor="transparent"
            onPress={() => setSearchText("")}
          />
        }
      />
      <View>
        <FlatList
          data={brands}
          renderItem={renderBrandItem}
          keyExtractor={(item) => item}
          horizontal
          style={styles.brandList}
        />
      </View>
      <FlatList
        data={filteredProducts}
        numColumns={2}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
      />
      <Snackbar duration={2000} visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    marginBottom: 115,
  },
  searchBox: {
    margin: 16,
    width: "90%",
    backgroundColor: "transparent",
    height: 35,
    borderRadius: 10,
  },
  searchLeft: {
    height: 33,
    width: 40,
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  brandList: {
    marginBottom: 12,
  },
  brandChip: {
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  selectedBrandChip: {
    backgroundColor: MD3Colors.neutral50,
  },
  brandChipText: {
    fontSize: 12,
    color: "#333",
  },
  selectedBrandChipText: {
    color: "#fff",
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
    width: 30,
    height: 30,
    margin: 5,
    borderColor: "transparent",
  },
});
