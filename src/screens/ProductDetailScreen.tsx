import React, { useState, useMemo } from "react";
import { View, ScrollView, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import { Title, Paragraph, IconButton, MD3Colors, List, Divider, Chip } from "react-native-paper";
import { useFavorite } from "../contexts/FavoriteContext";
import { AirbnbRating } from "react-native-ratings";
import { ArtSupply, Feedback } from "../types/type";
import { DrawerNavigationProp } from "@react-navigation/drawer";

const { width } = Dimensions.get("window");

type ProductDetailScreenProps = {
  route: any;
  navigation: DrawerNavigationProp<any, "ProductDetail">;
};

const ProductInfo = ({ product }: { product: ArtSupply }) => (
  <View style={styles.infoContainer}>
    <Title style={styles.title}>{product.artName}</Title>
    <Paragraph style={styles.brand}>Brand: {product.brand}</Paragraph>
    <Paragraph style={styles.price}>${product.price.toFixed(2)}</Paragraph>
    {product.limitedTimeDeal > 0 && (
      <Chip icon="percent" style={styles.dealChip}>
        {(product.limitedTimeDeal * 100).toFixed(0)}% OFF
      </Chip>
    )}
    <Paragraph style={styles.description}>{product.description}</Paragraph>
    <Chip icon={product.glassSurface ? "check" : "close"} style={styles.glassChip}>
      {product.glassSurface ? "Works on glass" : "Not for glass"}
    </Chip>
  </View>
);

const FeedbackItem = ({ feedback }: { feedback: Feedback }) => (
  <List.Item
    title={
      <View style={styles.titleContainer}>
        <Text style={styles.authorName}>{feedback.author}</Text>
        <AirbnbRating count={5} defaultRating={feedback.rating} size={10} showRating={false} isDisabled={true} />
      </View>
    }
    description={feedback.comment}
    right={() => <Paragraph style={styles.feedbackTime}>{feedback.time}</Paragraph>}
  />
);

const ProductDetailScreen = ({ route, navigation }: ProductDetailScreenProps) => {
  const { product } = route.params as { product: ArtSupply };
  const { isFavorite, addFavorite, removeFavorite } = useFavorite();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const averageRating =
    product.feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / product.feedbacks.length;

  const filteredFeedbacks = useMemo(() => {
    if (selectedRating === null) {
      return product.feedbacks;
    }
    return product.feedbacks.filter((feedback) => feedback.rating === selectedRating);
  }, [product.feedbacks, selectedRating]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={isFavorite(product.id) ? "heart" : "heart-outline"}
          iconColor={MD3Colors.error50}
          size={30}
          onPress={handleFavorite}
          accessibilityLabel={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
        />
      ),
    });
  }, [navigation, isFavorite, product.id]);

  const renderStarFilter = () => {
    return (
      <View style={styles.starFilterContainer}>
        <Text style={styles.filterText}>Filter by rating: </Text>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            onPress={() => setSelectedRating(selectedRating === rating ? null : rating)}
            style={[styles.starButton, selectedRating === rating && styles.selectedStarButton]}
          >
            <Text style={[styles.starButtonText, selectedRating === rating && styles.selectedStarButtonText]}>
              {rating}★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel={`Image of ${product.artName}`}
      />
      <ProductInfo product={product} />
      <View style={styles.feedbackContainer}>
        <Title style={styles.feedbackTitle}>Customer Feedback</Title>
        <View style={styles.averageRatingContainer}>
          <AirbnbRating count={5} defaultRating={averageRating} size={20} showRating={false} isDisabled={true} />
          <Paragraph style={styles.averageRatingText}>
            {averageRating.toFixed(1)} out of 5 ({product.feedbacks.length} reviews)
          </Paragraph>
        </View>
        {renderStarFilter()}
        {filteredFeedbacks.map((feedback, index) => (
          <React.Fragment key={index}>
            <FeedbackItem feedback={feedback} />
            {index < filteredFeedbacks.length - 1 && <Divider />}
          </React.Fragment>
        ))}
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
  brand: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: "#4CAF50",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  dealChip: {
    marginBottom: 8,
    backgroundColor: "#FFD700",
  },
  glassChip: {
    marginBottom: 8,
  },
  feedbackContainer: {
    padding: 16,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  feedbackTime: {
    fontSize: 12,
    color: "#757575",
  },
  averageRatingContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  averageRatingText: {
    marginLeft: 10,
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  authorName: {
    color: "#757575",
    fontWeight: "bold",
    marginBottom: 6,
    marginRight: 8,
  },
  starFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  filterText: {
    fontSize: 16,
    marginRight: 8,
  },
  starButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedStarButton: {
    backgroundColor: "#007AFF",
  },
  starButtonText: {
    fontSize: 16,
  },
  selectedStarButtonText: {
    color: "#fff",
  },
});

export default ProductDetailScreen;
