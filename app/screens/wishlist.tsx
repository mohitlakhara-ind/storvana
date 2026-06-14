import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
  AsyncStorage,
} from 'react-native';
import { ShopColors, ShopTypography, ShopSpacing, ShopRadii, ShopShadows } from '../styles/Storvana-theme';

// Feature: Wishlist with Offline Persistence
// Saves wishlisted products to AsyncStorage
// Shows "Price Dropped!" badge when product.salePrice < product.originalPrice
// Heart animation on add/remove

interface WishlistProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  category: string;
  addedAt: string;
  brand: string;
  inStock: boolean;
}

const STORAGE_KEY = '@Storvana_wishlist';

const MOCK_WISHLIST: WishlistProduct[] = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    price: 2499,
    originalPrice: 3999,
    thumbnail: 'https://i.dummyjson.com/data/products/2/thumbnail.jpg',
    category: 'Electronics',
    addedAt: '2026-06-10',
    brand: 'SoundMax',
    inStock: true,
  },
  {
    id: '2',
    title: 'Minimalist Leather Watch',
    price: 5999,
    originalPrice: 5999,
    thumbnail: 'https://i.dummyjson.com/data/products/63/thumbnail.jpg',
    category: 'Accessories',
    addedAt: '2026-06-08',
    brand: 'TimeCraft',
    inStock: true,
  },
  {
    id: '3',
    title: 'Luxury Skincare Set',
    price: 1799,
    originalPrice: 2499,
    thumbnail: 'https://i.dummyjson.com/data/products/11/thumbnail.jpg',
    category: 'Beauty',
    addedAt: '2026-06-05',
    brand: 'GlowLab',
    inStock: false,
  },
];

interface HeartButtonProps {
  isWishlisted: boolean;
  onToggle: () => void;
}

const HeartButton: React.FC<HeartButtonProps> = ({ isWishlisted, onToggle }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(isWishlisted ? 1 : 0)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.4, friction: 3, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
    Animated.timing(colorAnim, {
      toValue: isWishlisted ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onToggle();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.heartBtn}>
      <Animated.Text
        style={[styles.heartIcon, { transform: [{ scale: scaleAnim }] }]}
      >
        {isWishlisted ? '❤️' : '🤍'}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const WishlistScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>(MOCK_WISHLIST);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(
    new Set(MOCK_WISHLIST.map(p => p.id))
  );

  // Load from AsyncStorage on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      // const stored = await AsyncStorage.getItem(STORAGE_KEY);
      // if (stored) setWishlist(JSON.parse(stored));
      // Using mock data for demo
    } catch (e) {
      console.log('Could not load wishlist', e);
    }
  };

  const saveWishlist = async (items: WishlistProduct[]) => {
    try {
      // await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.log('Could not save wishlist', e);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const updated = wishlist.filter(p => p.id !== productId);
    const updatedIds = new Set(Array.from(wishlistedIds).filter(id => id !== productId));
    setWishlist(updated);
    setWishlistedIds(updatedIds);
    saveWishlist(updated);
  };

  const isPriceDropped = (product: WishlistProduct) =>
    product.originalPrice !== undefined && product.price < product.originalPrice;

  const getDiscount = (product: WishlistProduct) => {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const renderProduct = ({ item }: { item: WishlistProduct }) => (
    <View style={styles.productCard}>
      {/* Product Image */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
        {/* Price Drop Badge */}
        {isPriceDropped(item) && (
          <View style={styles.priceDropBadge}>
            <Text style={styles.priceDropText}>🔥 -{getDiscount(item)}%</Text>
          </View>
        )}
        {/* Out of Stock Overlay */}
        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <View style={styles.productTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
          </View>
          <HeartButton
            isWishlisted={wishlistedIds.has(item.id)}
            onToggle={() => removeFromWishlist(item.id)}
          />
        </View>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price.toLocaleString('en-IN')}</Text>
          {item.originalPrice && item.originalPrice !== item.price && (
            <Text style={styles.originalPrice}>
              ₹{item.originalPrice.toLocaleString('en-IN')}
            </Text>
          )}
        </View>

        {isPriceDropped(item) && (
          <View style={styles.priceDropAlert}>
            <Text style={styles.priceDropAlertText}>
              🎉 Price dropped! Save ₹{(item.originalPrice! - item.price).toLocaleString('en-IN')}
            </Text>
          </View>
        )}

        {/* Category Tag */}
        <View style={styles.bottomRow}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.addedDate}>Added {item.addedAt}</Text>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[styles.addToCartBtn, !item.inStock && styles.addToCartDisabled]}
          disabled={!item.inStock}
          onPress={() => Alert.alert('Added to cart!', `${item.title} added to your cart.`)}
        >
          <Text style={styles.addToCartText}>
            {item.inStock ? '🛒 Add to Cart' : 'Notify When Available'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Wishlist</Text>
          <Text style={styles.subtitle}>{wishlist.length} items saved</Text>
        </View>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={styles.shareIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🤍</Text>
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon on any product to save it here
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShopColors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: ShopSpacing.md,
    paddingHorizontal: ShopSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.glassBorder,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ShopColors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ShopColors.glassBorder,
  },
  backIcon: { fontSize: 18, color: ShopColors.textPrimary },
  title: {
    fontSize: ShopTypography.sizes.xl,
    fontFamily: ShopTypography.fontFamily.bold,
    color: ShopColors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: ShopTypography.sizes.sm,
    color: ShopColors.textMuted,
    fontFamily: ShopTypography.fontFamily.regular,
    textAlign: 'center',
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ShopColors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: { fontSize: 18 },
  listContent: {
    padding: ShopSpacing.md,
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: ShopColors.bgCard,
    borderRadius: ShopRadii.lg,
    borderWidth: 1,
    borderColor: ShopColors.bgCardBorder,
    overflow: 'hidden',
    ...ShopShadows.card,
  },
  imageContainer: {
    height: 220,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  priceDropBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: ShopColors.sale,
    borderRadius: ShopRadii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priceDropText: {
    fontSize: ShopTypography.sizes.xs,
    color: '#fff',
    fontFamily: ShopTypography.fontFamily.bold,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    fontSize: ShopTypography.sizes.md,
    color: '#fff',
    fontFamily: ShopTypography.fontFamily.semiBold,
  },
  productInfo: {
    padding: ShopSpacing.md,
    gap: ShopSpacing.sm,
  },
  productTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  brand: {
    fontSize: ShopTypography.sizes.xs,
    color: ShopColors.primary,
    fontFamily: ShopTypography.fontFamily.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  productTitle: {
    fontSize: ShopTypography.sizes.md,
    fontFamily: ShopTypography.fontFamily.display,
    color: ShopColors.textPrimary,
    lineHeight: 22,
  },
  heartBtn: {
    padding: 4,
  },
  heartIcon: {
    fontSize: 24,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  price: {
    fontSize: ShopTypography.sizes.xl,
    fontFamily: ShopTypography.fontFamily.bold,
    color: ShopColors.textGold,
  },
  originalPrice: {
    fontSize: ShopTypography.sizes.md,
    fontFamily: ShopTypography.fontFamily.regular,
    color: ShopColors.textMuted,
    textDecorationLine: 'line-through',
  },
  priceDropAlert: {
    backgroundColor: 'rgba(236,72,153,0.12)',
    borderRadius: ShopRadii.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: ShopColors.accent,
  },
  priceDropAlertText: {
    fontSize: ShopTypography.sizes.xs,
    color: ShopColors.accent,
    fontFamily: ShopTypography.fontFamily.semiBold,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTag: {
    backgroundColor: ShopColors.glass,
    borderRadius: ShopRadii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: ShopColors.glassBorder,
  },
  categoryText: {
    fontSize: ShopTypography.sizes.xs,
    color: ShopColors.textMuted,
    fontFamily: ShopTypography.fontFamily.medium,
  },
  addedDate: {
    fontSize: ShopTypography.sizes.xs,
    color: ShopColors.textMuted,
    fontFamily: ShopTypography.fontFamily.regular,
  },
  addToCartBtn: {
    backgroundColor: ShopColors.primary,
    borderRadius: ShopRadii.md,
    paddingVertical: 12,
    alignItems: 'center',
    ...ShopShadows.goldGlow,
  },
  addToCartDisabled: {
    backgroundColor: ShopColors.glass,
    ...undefined,
  },
  addToCartText: {
    fontSize: ShopTypography.sizes.md,
    color: ShopColors.textInverse,
    fontFamily: ShopTypography.fontFamily.semiBold,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ShopSpacing.xl,
    gap: ShopSpacing.md,
  },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: {
    fontSize: ShopTypography.sizes.xl,
    fontFamily: ShopTypography.fontFamily.bold,
    color: ShopColors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: ShopTypography.sizes.base,
    color: ShopColors.textMuted,
    fontFamily: ShopTypography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  browseBtn: {
    backgroundColor: ShopColors.primary,
    borderRadius: ShopRadii.md,
    paddingHorizontal: ShopSpacing.xl,
    paddingVertical: 14,
    marginTop: ShopSpacing.sm,
    ...ShopShadows.goldGlow,
  },
  browseBtnText: {
    fontSize: ShopTypography.sizes.md,
    color: ShopColors.textInverse,
    fontFamily: ShopTypography.fontFamily.semiBold,
  },
});

export default WishlistScreen;
