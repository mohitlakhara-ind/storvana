import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  Keyboard,
} from 'react-native';
import { ShopColors, ShopTypography, ShopSpacing, ShopRadii } from '../styles/Storvana-theme';

// Feature: Smart Search with Recent & Trending
// - Debounced search (300ms delay)
// - Recent searches stored locally (AsyncStorage in real app, local state in demo)
// - Trending tags from most-viewed products
// - Live search results preview

const TRENDING_TAGS = [
  '🔥 Headphones', '👟 Sneakers', '💄 Skincare',
  '📱 Smartphones', '⌚ Watches', '🧥 Jackets',
];

const MOCK_PRODUCTS = [
  { id: '1', title: 'Premium Wireless Headphones', price: 2499, category: 'Electronics' },
  { id: '2', title: 'Minimalist Leather Watch', price: 5999, category: 'Accessories' },
  { id: '3', title: 'Luxury Skincare Set', price: 1799, category: 'Beauty' },
  { id: '4', title: 'Running Sneakers Pro', price: 4299, category: 'Footwear' },
  { id: '5', title: 'Smart Fitness Band', price: 1999, category: 'Electronics' },
  { id: '6', title: 'Designer Sunglasses', price: 3499, category: 'Accessories' },
  { id: '7', title: 'Silk Pajama Set', price: 2799, category: 'Clothing' },
  { id: '8', title: 'Aromatherapy Diffuser', price: 899, category: 'Home & Living' },
];

interface SearchResult {
  id: string;
  title: string;
  price: number;
  category: string;
}

interface SearchWithHistoryProps {
  navigation?: any;
  onClose?: () => void;
}

const SearchWithHistory: React.FC<SearchWithHistoryProps> = ({ navigation, onClose }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'wireless headphones', 'leather wallet', 'sunscreen SPF 50'
  ]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const resultsFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Auto focus on mount
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const filtered = MOCK_PRODUCTS.filter(
      p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filtered);
    setIsSearching(false);
    Animated.timing(resultsFadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setResults([]);
      resultsFadeAnim.setValue(0);
      return;
    }
    setIsSearching(true);
    debounceRef.current = setTimeout(() => performSearch(text), 300);
  };

  const handleSubmit = () => {
    if (query.trim()) {
      addToRecent(query.trim());
      performSearch(query);
    }
    Keyboard.dismiss();
  };

  const addToRecent = (term: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== term);
      return [term, ...filtered].slice(0, 8);
    });
    // In real app: AsyncStorage.setItem('@Storvana_recent_searches', JSON.stringify(...))
  };

  const clearRecent = () => setRecentSearches([]);

  const useQuery = (term: string) => {
    setQuery(term);
    addToRecent(term);
    performSearch(term);
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    resultsFadeAnim.setValue(0);
    inputRef.current?.focus();
  };

  const showSuggestions = !query && isFocused;
  const showResults = query.length > 0 && results.length > 0;
  const showNoResults = query.length > 0 && !isSearching && results.length === 0;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarRow}>
        <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search products, brands..."
            placeholderTextColor={ShopColors.textMuted}
            value={query}
            onChangeText={handleQueryChange}
            onSubmitEditing={handleSubmit}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearQuery} style={styles.clearBtn}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose || (() => navigation?.goBack())}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={() => (
          <>
            {/* Trending Tags — shown when no query */}
            {!query && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔥 Trending</Text>
                <View style={styles.tagsWrap}>
                  {TRENDING_TAGS.map(tag => (
                    <TouchableOpacity
                      key={tag}
                      style={styles.tag}
                      onPress={() => useQuery(tag.split(' ').slice(1).join(' '))}
                    >
                      <Text style={styles.tagText}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Recent Searches — shown when no query */}
            {!query && recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionRow}>
                  <Text style={styles.sectionTitle}>🕐 Recent</Text>
                  <TouchableOpacity onPress={clearRecent}>
                    <Text style={styles.clearAllText}>Clear all</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((search, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.recentItem}
                    onPress={() => useQuery(search)}
                  >
                    <Text style={styles.recentIcon}>🕐</Text>
                    <Text style={styles.recentText}>{search}</Text>
                    <TouchableOpacity
                      onPress={() => setRecentSearches(prev => prev.filter(s => s !== search))}
                    >
                      <Text style={styles.removeIcon}>✕</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Search Results */}
            {showResults && (
              <Animated.View style={[styles.section, { opacity: resultsFadeAnim }]}>
                <Text style={styles.sectionTitle}>
                  {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </Text>
                {results.map(product => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.resultItem}
                    onPress={() => {
                      addToRecent(query);
                      navigation?.navigate('ProductDetail', { product });
                    }}
                  >
                    <View style={styles.resultIcon}>
                      <Text style={styles.resultIconText}>
                        {product.category === 'Electronics' ? '📱' :
                          product.category === 'Accessories' ? '⌚' :
                          product.category === 'Beauty' ? '💄' : '🛍️'}
                      </Text>
                    </View>
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultTitle} numberOfLines={1}>
                        {product.title}
                      </Text>
                      <Text style={styles.resultCategory}>{product.category}</Text>
                    </View>
                    <Text style={styles.resultPrice}>₹{product.price.toLocaleString('en-IN')}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}

            {/* No Results */}
            {showNoResults && (
              <View style={styles.noResults}>
                <Text style={styles.noResultsEmoji}>🔍</Text>
                <Text style={styles.noResultsTitle}>No results for "{query}"</Text>
                <Text style={styles.noResultsSub}>Try a different keyword or browse categories</Text>
              </View>
            )}
          </>
        )}
        keyboardShouldPersistTaps="always"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShopColors.bg,
    paddingTop: 60,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ShopSpacing.md,
    gap: ShopSpacing.sm,
    marginBottom: ShopSpacing.lg,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ShopColors.bgInput,
    borderRadius: ShopRadii.lg,
    borderWidth: 1,
    borderColor: ShopColors.glassBorder,
    paddingHorizontal: ShopSpacing.md,
    height: 48,
    gap: 8,
  },
  searchBarFocused: {
    borderColor: ShopColors.primary,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: ShopTypography.sizes.base,
    color: ShopColors.textPrimary,
    fontFamily: ShopTypography.fontFamily.regular,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 12,
    color: ShopColors.textMuted,
  },
  cancelBtn: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: ShopTypography.sizes.base,
    color: ShopColors.primary,
    fontFamily: ShopTypography.fontFamily.medium,
  },
  section: {
    paddingHorizontal: ShopSpacing.md,
    marginBottom: ShopSpacing.xl,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ShopSpacing.md,
  },
  sectionTitle: {
    fontSize: ShopTypography.sizes.md,
    fontFamily: ShopTypography.fontFamily.semiBold,
    color: ShopColors.textPrimary,
    marginBottom: ShopSpacing.md,
  },
  clearAllText: {
    fontSize: ShopTypography.sizes.sm,
    color: ShopColors.primary,
    fontFamily: ShopTypography.fontFamily.medium,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: ShopColors.bgCard,
    borderRadius: ShopRadii.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: ShopColors.bgCardBorder,
  },
  tagText: {
    fontSize: ShopTypography.sizes.sm,
    color: ShopColors.textSecondary,
    fontFamily: ShopTypography.fontFamily.medium,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.glassBorder,
    gap: 12,
  },
  recentIcon: { fontSize: 14, color: ShopColors.textMuted },
  recentText: {
    flex: 1,
    fontSize: ShopTypography.sizes.base,
    color: ShopColors.textSecondary,
    fontFamily: ShopTypography.fontFamily.regular,
  },
  removeIcon: { fontSize: 12, color: ShopColors.textMuted, padding: 4 },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.glassBorder,
    gap: 12,
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: ShopRadii.sm,
    backgroundColor: ShopColors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultIconText: { fontSize: 22 },
  resultInfo: { flex: 1 },
  resultTitle: {
    fontSize: ShopTypography.sizes.base,
    color: ShopColors.textPrimary,
    fontFamily: ShopTypography.fontFamily.medium,
  },
  resultCategory: {
    fontSize: ShopTypography.sizes.sm,
    color: ShopColors.textMuted,
    fontFamily: ShopTypography.fontFamily.regular,
    marginTop: 2,
  },
  resultPrice: {
    fontSize: ShopTypography.sizes.base,
    color: ShopColors.textGold,
    fontFamily: ShopTypography.fontFamily.bold,
  },
  noResults: {
    paddingHorizontal: ShopSpacing.md,
    alignItems: 'center',
    paddingTop: ShopSpacing.xxl,
    gap: ShopSpacing.sm,
  },
  noResultsEmoji: { fontSize: 48 },
  noResultsTitle: {
    fontSize: ShopTypography.sizes.lg,
    color: ShopColors.textPrimary,
    fontFamily: ShopTypography.fontFamily.bold,
    textAlign: 'center',
  },
  noResultsSub: {
    fontSize: ShopTypography.sizes.base,
    color: ShopColors.textMuted,
    fontFamily: ShopTypography.fontFamily.regular,
    textAlign: 'center',
  },
});

export default SearchWithHistory;
