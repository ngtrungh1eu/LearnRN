import React from "react";
import { View, ScrollView, Image, StyleSheet, Dimensions, Text } from "react-native";
import { Title, Paragraph, IconButton, MD3Colors, List, Divider } from "react-native-paper";
import { useFavorite } from "../contexts/FavoriteContext";
import { AirbnbRating } from "react-native-ratings";

const { width } = Dimensions.get("window");

type Feedback = {
  rating: number;
  comment: string;
  author: string;
  time: string;
};

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  sensor: string;
  resolution: string;
  isoRange: string;
  shutterSpeed: string;
  feedbacks: Feedback[];
};

const ProductInfo = ({ product }: { product: Product }) => (
  <View style={styles.infoContainer}>
    <Title style={styles.title}>{product.name}</Title>
    <Paragraph style={styles.price}>${product.price.toFixed(2)}</Paragraph>
    <Paragraph style={styles.description}>{product.description}</Paragraph>
  </View>
);

const ProductSpecs = ({ product }: { product: Product }) => (
  <View style={styles.specContainer}>
    <Title style={styles.specTitle}>Specifications:</Title>
    <Paragraph>• Sensor: {product.sensor}</Paragraph>
    <Paragraph>• Resolution: {product.resolution}</Paragraph>
    <Paragraph>• ISO Range: {product.isoRange}</Paragraph>
    <Paragraph>• Shutter Speed: {product.shutterSpeed}</Paragraph>
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

const ProductDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { product } = route.params as { product: Product };
  const { isFavorite, addFavorite, removeFavorite } = useFavorite();

  const handleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const averageRating =
    product.feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / product.feedbacks.length;

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

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel={`Image of ${product.name}`}
      />
      <ProductInfo product={product} />
      <ProductSpecs product={product} />
      <View style={styles.feedbackContainer}>
        <Title style={styles.feedbackTitle}>Customer Feedback</Title>
        <View style={styles.averageRatingContainer}>
          <AirbnbRating count={5} defaultRating={averageRating} size={20} showRating={false} isDisabled={true} />
          <Paragraph style={styles.averageRatingText}>
            {averageRating.toFixed(1)} out of 5 ({product.feedbacks.length} reviews)
          </Paragraph>
        </View>
        {product.feedbacks.map((feedback, index) => (
          <React.Fragment key={index}>
            <FeedbackItem feedback={feedback} />
            {index < product.feedbacks.length - 1 && <Divider />}
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
    marginHorizontal: 16,
    marginBottom: 16,
  },
  specTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
});

export default ProductDetailScreen;
