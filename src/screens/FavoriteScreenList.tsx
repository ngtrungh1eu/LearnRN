import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ListRenderItemInfo } from "react-native";
import { Title, List, Avatar } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import { useFavorite } from "../contexts/FavoriteContext";
import { Product } from "../types/type";

const { width } = Dimensions.get("window");

interface SwipeData {
  key: string;
  value: number;
}
const FavoriteScreenList = ({ navigation }: { navigation: any }) => {
  const { favorites, removeFavorite } = useFavorite();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Product>) => (
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetail", { product: item })}
        style={styles.rowFront}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`View details of ${item.name}`}
      >
        <List.Item
          title={item.name}
          description={`$${item.price}`}
          left={() => <Avatar.Image size={50} source={{ uri: item.image }} />}
          right={() => <List.Icon icon="chevron-left" />}
        />
      </TouchableOpacity>
    ),
    [navigation]
  );

  const renderHiddenItem = useCallback(
    (rowData: ListRenderItemInfo<Product>) => (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          // onPress={() => removeFavorite(rowData.item.id)}
        >
          <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
      </View>
    ),
    []
  );

  const onSwipeValueChange = (swipeData: SwipeData) => {
    const { key, value } = swipeData;
    if (value < -width) {
      removeFavorite(key);
    }
  };

  return (
    <View style={styles.container}>
      {!favorites.length ? (
        <View style={styles.emptyContainer}>
          <Title>No favorites yet</Title>
        </View>
      ) : (
        <SwipeListView
          data={favorites}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          disableRightSwipe
          rightOpenValue={-width}
          onRightAction={() => console.log("Right Swipe")}
          rightActionValue={width - 75}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={onSwipeValueChange}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rowFront: {
    backgroundColor: "#FFF",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 80,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
  backTextWhite: {
    color: "#FFF",
  },
});

export default FavoriteScreenList;
