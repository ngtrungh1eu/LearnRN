import React, { useRef } from "react";
import { View, StyleSheet, Animated, TouchableOpacity, Text } from "react-native";

const FlipTile = ({ children }: { children: React.ReactNode[] }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = React.useState(false);

  const flip = () => {
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const animatedStyle = {
    transform: [{ rotateY: rotateInterpolate }],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.flipCard, animatedStyle]}>
        <View style={styles.flipCardInner}>
          <View style={styles.flipCardFront}>{children[0]}</View>
          <View style={styles.flipCardBack}>{children[1]}</View>
        </View>
      </Animated.View>
      <TouchableOpacity style={styles.flipButton} onPress={flip}>
        <Text style={styles.flipText}>Flip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flipCard: {
    width: 200,
    height: 200,
  },
  flipCardInner: {
    position: "relative",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  flipCardFront: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  flipCardBack: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotateY: "180deg" }],
  },
  flipButton: {
    backgroundColor: "#007aff",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  flipText: {
    fontSize: 20,
    color: "#fff",
  },
});

export default FlipTile;
