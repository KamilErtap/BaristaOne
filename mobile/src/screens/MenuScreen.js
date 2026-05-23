import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { menuApi } from '../api/menuApi';
import { getCategories, getItems } from '../api/responseHelpers';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import Card, { CardBody } from '../components/Card';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const SORT_OPTIONS = [
  { label: 'Varsayılan', value: '' },
  { label: 'Fiyat Artan', value: 'price_asc' },
  { label: 'Fiyat Azalan', value: 'price_desc' },
  { label: 'İsim A-Z', value: 'name_asc' },
  { label: 'İsim Z-A', value: 'name_desc' },
  { label: 'En Yeni', value: 'newest' },
  { label: 'En Eski', value: 'oldest' },
];

export default function MenuScreen({ navigation }) {
  const { userInfo, logout } = useAuth();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: '',
  });

  const fetchCategories = async () => {
    try {
      const response = await menuApi.getCategories();
      setCategories(getCategories(response));
    } catch (err) {
      console.log('Kategori verileri alınamadı');
    }
  };

  const fetchMenuItems = async ({ silent = false, nextFilters = filters } = {}) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await menuApi.getMenuItems(nextFilters);
      setItems(getItems(response));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Menü verileri alınamadı.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMenuItems({
        silent: true,
        nextFilters: filters,
      });
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const updateFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      sort: '',
    });
  };

  if (loading) {
    return <Loading text="Menü yükleniyor..." />;
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() =>
            fetchMenuItems({
              silent: true,
              nextFilters: filters,
            })
          }
          tintColor="#8b5e3c"
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Menü</Text>
          <Text style={styles.subtitle}>
            Hoş geldin, {userInfo?.user?.name || 'Müşteri'}.
          </Text>
        </View>

        <AppButton title="Çıkış" variant="danger" onPress={logout} />
      </View>

      <Card>
        <CardBody>
          <Text style={styles.filterTitle}>Ürünleri Filtrele</Text>

          <TextInput
            value={filters.search}
            onChangeText={(value) => updateFilter('search', value)}
            placeholder="Ürün ara..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />

          <Text style={styles.filterLabel}>Kategori</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            <FilterChip
              label="Tümü"
              active={!filters.category}
              onPress={() => updateFilter('category', '')}
            />

            {categories.map((category) => (
              <FilterChip
                key={category}
                label={category}
                active={filters.category === category}
                onPress={() => updateFilter('category', category)}
              />
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Sıralama</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {SORT_OPTIONS.map((option) => (
              <FilterChip
                key={option.value || 'default'}
                label={option.label}
                active={filters.sort === option.value}
                onPress={() => updateFilter('sort', option.value)}
              />
            ))}
          </ScrollView>

          {(filters.search || filters.category || filters.sort) && (
            <View style={styles.clearButton}>
              <AppButton
                title="Filtreleri Temizle"
                variant="secondary"
                onPress={clearFilters}
              />
            </View>
          )}
        </CardBody>
      </Card>

      {error ? (
        <EmptyState title="Menü alınamadı" description={error} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Ürün bulunamadı"
          description="Arama veya filtreleri değiştirerek tekrar deneyebilirsin."
        />
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              onPress={() =>
                navigation.navigate('MenuDetail', {
                  id: item._id,
                })
              }
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function FilterChip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.activeChip]}
    >
      <Text style={[styles.chipText, active && styles.activeChipText]}>
        {label}
      </Text>
    </Pressable>
  );
}

function MenuItemCard({ item, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Card>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Görsel Yok</Text>
          </View>
        )}

        <CardBody>
          <View style={styles.badgeRow}>
            <Text style={styles.badge}>{item.category || 'Kategori'}</Text>
            <Text style={styles.badge}>
              {item.isAvailable ? 'Müsait' : 'Tükendi'}
            </Text>
          </View>

          <Text style={styles.itemTitle}>{item.name}</Text>

          <Text style={styles.description} numberOfLines={2}>
            {item.description || 'Açıklama yok'}
          </Text>

          <View style={styles.bottomRow}>
            <Text style={styles.price}>{item.price} TL</Text>
            <Text style={styles.detailText}>Detay →</Text>
          </View>
        </CardBody>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingTop: 64,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1f2937',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 16,
    marginTop: 4,
  },
  filterTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
  },
  filterLabel: {
    marginTop: 14,
    marginBottom: 8,
    fontWeight: '900',
    color: '#334155',
  },
  chipRow: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeChip: {
    backgroundColor: '#8b5e3c',
    borderColor: '#8b5e3c',
  },
  chipText: {
    color: '#64748b',
    fontWeight: '800',
  },
  activeChipText: {
    color: '#fff',
  },
  clearButton: {
    marginTop: 14,
  },
  list: {
    gap: 16,
  },
  image: {
    width: '100%',
    height: 190,
    backgroundColor: '#e2e8f0',
  },
  placeholder: {
    height: 190,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#64748b',
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: '700',
  },
  itemTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#1f2937',
  },
  description: {
    color: '#64748b',
    marginTop: 8,
    lineHeight: 21,
  },
  bottomRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: '#8b5e3c',
    fontSize: 22,
    fontWeight: '900',
  },
  detailText: {
    color: '#8b5e3c',
    fontWeight: '900',
  },
});