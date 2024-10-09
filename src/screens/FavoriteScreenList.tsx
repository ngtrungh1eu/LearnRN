import React, { useCallback, useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ListRenderItemInfo, Alert } from "react-native";
import { Title, List, Avatar, Chip, Button } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import { useFavorite } from "../contexts/FavoriteContext";
import { ArtSupply } from "../types/type";

const { width } = Dimensions.get("window");

interface SwipeData {
  key: string;
  value: number;
}

const FavoriteScreenList = ({ navigation }: { navigation: any }) => {
  const { favorites, removeFavorite, deleteAllFavorite } = useFavorite();

  const handleDeleteAll = useCallback(() => {
    Alert.alert("Delete All Favorites", "Are you sure you want to delete all favorites?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deleteAllFavorite(),
        style: "destructive",
      },
    ]);
  }, [deleteAllFavorite]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={handleDeleteAll} mode="text" compact style={styles.deleteAllButton}>
          Delete All
        </Button>
      ),
    });
  }, [navigation, handleDeleteAll]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ArtSupply>) => (
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetail", { product: item })}
        style={styles.rowFront}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`View details of ${item.artName}`}
      >
        <List.Item
          title={item.artName}
          description={`${item.brand} - $${item.price.toFixed(2)}`}
          left={() => <Avatar.Image size={50} source={{ uri: item.image }} />}
          right={() => (
            <View style={styles.rightContent}>
              {item.limitedTimeDeal > 0 && (
                <Chip icon="percent" style={styles.dealChip}>
                  {(item.limitedTimeDeal * 100).toFixed(0)}% OFF
                </Chip>
              )}
              <List.Icon icon="chevron-left" />
            </View>
          )}
        />
      </TouchableOpacity>
    ),
    [navigation]
  );

  const renderHiddenItem = useCallback(
    (rowData: ListRenderItemInfo<ArtSupply>) => (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => removeFavorite(rowData.item.id)}
        >
          <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
      </View>
    ),
    [removeFavorite]
  );

  const onSwipeValueChange = useCallback(
    (swipeData: SwipeData) => {
      const { key, value } = swipeData;
      if (value < -width) {
        removeFavorite(key);
      }
    },
    [removeFavorite]
  );

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
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dealChip: {
    marginRight: 8,
    backgroundColor: "#FFD700",
  },
  deleteAllButton: {
    marginRight: 10,
  },
});

export default FavoriteScreenList;
