import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArtSupply } from "../types/type";

type FavoriteContextType = {
  favorites: ArtSupply[];
  addFavorite: (product: ArtSupply) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  deleteAllFavorite: () => void;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<ArtSupply[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const saveFavorites = async (newFavorites: ArtSupply[]) => {
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const addFavorite = (product: ArtSupply) => {
    const newFavorites = [...favorites, product];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const removeFavorite = (productId: string) => {
    const newFavorites = favorites.filter((fav) => fav.id !== productId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (productId: string) => favorites.some((fav) => fav.id === productId);

  const deleteAllFavorite = () => {
    setFavorites([]);
    saveFavorites([]);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, deleteAllFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return context;
};
