import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type GroceryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  done: boolean;
};

const initialItems: GroceryItem[] = [
  { id: 'rice', name: 'Arroz', quantity: 5, unit: 'kg', done: false },
  { id: 'beans', name: 'Feijão', quantity: 2, unit: 'kg', done: false },
  { id: 'milk', name: 'Leite', quantity: 6, unit: 'un', done: false },
  { id: 'bread', name: 'Sabão em pó', quantity: 1, unit: 'cx', done: false },
  { id: 'coffee', name: 'Café', quantity: 1, unit: 'pct', done: true },
];

const unitOptions = ['un', 'kg', 'cx', 'pct'];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('un');
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  const pendingItems = useMemo(() => items.filter((item) => !item.done), [items]);
  const completedItems = useMemo(() => items.filter((item) => item.done), [items]);

  const addItem = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setItems((currentItems) => [
      ...currentItems,
      {
        id: `${trimmedName}-${Date.now()}`,
        name: trimmedName,
        quantity,
        unit,
        done: false,
      },
    ]);
    setName('');
    setQuantity(1);
  };

  const toggleItem = (id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const renderItem = ({ item, index }: { item: GroceryItem; index: number }) => (
    <View>
      {item.done && index === pendingItems.length && (
        <Text style={styles.sectionLabel}>NO CARRINHO · {completedItems.length}</Text>
      )}
      <View style={[styles.itemRow, item.done && styles.completedRow]}>
        <Pressable
          accessibilityLabel={`Marcar ${item.name}`}
          onPress={() => toggleItem(item.id)}
          style={[styles.checkbox, item.done && styles.checkboxDone]}
        >
          {item.done && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>
        <Text style={[styles.itemName, item.done && styles.completedText]}>{item.name}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
          <Pressable
            accessibilityLabel={`Remover ${item.name}`}
            onPress={() => removeItem(item.id)}
            style={styles.removeButton}
          >
            <Text style={styles.removeText}>×</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  if (isSplashVisible) {
    return (
      <View style={styles.splash}>
        <View style={styles.bagHandle} />
        <View style={styles.bag}>
          <View style={styles.bagLine} />
        </View>
        <Text style={styles.splashBrand}>FITTRACK</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>MINHA LISTA</Text>
            <Text style={styles.title}>Compras da semana</Text>
          </View>
          <Pressable accessibilityLabel="Compartilhar lista" style={styles.shareButton}>
            <Text style={styles.shareIcon}>↗</Text>
          </Pressable>
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>{pendingItems.length} pendentes</Text>
            <Text style={styles.progressText}>{completedItems.length} de {items.length} no carrinho</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${items.length ? (completedItems.length / items.length) * 100 : 0}%` }]} />
          </View>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyCircle} />
            <Text style={styles.emptyTitle}>Nada na lista ainda</Text>
            <Text style={styles.emptyDescription}>Escreva o primeiro item na barra abaixo.{`\n`}Fica salvo no aparelho, mesmo sem internet.</Text>
          </View>
        ) : (
          <FlatList
            data={[...pendingItems, ...completedItems]}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.addPanel}>
          <View style={styles.inputLine}>
            <TextInput
              accessibilityLabel="Nome do novo item"
              onChangeText={setName}
              onSubmitEditing={addItem}
              placeholder="Novo item..."
              placeholderTextColor="#5c5d63"
              returnKeyType="done"
              style={styles.input}
              value={name}
            />
            <Pressable accessibilityLabel="Adicionar item" onPress={addItem} style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          </View>
          <View style={styles.controlsRow}>
            <View style={styles.stepper}>
              <Pressable accessibilityLabel="Diminuir quantidade" onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <Text style={styles.stepperAction}>−</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{quantity}</Text>
              <Pressable accessibilityLabel="Aumentar quantidade" onPress={() => setQuantity(quantity + 1)}>
                <Text style={styles.stepperAction}>+</Text>
              </Pressable>
            </View>
            {unitOptions.map((option) => (
              <Pressable key={option} onPress={() => setUnit(option)} style={[styles.unitButton, unit === option && styles.unitButtonSelected]}>
                <Text style={[styles.unitText, unit === option && styles.unitTextSelected]}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111214' },
  container: { flex: 1, paddingHorizontal: 20 },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1005' },
  splashBrand: { color: '#a4ed2f', fontSize: 12, fontWeight: '800', letterSpacing: 3, marginTop: 30 },
  bag: { width: 58, height: 48, borderRadius: 8, backgroundColor: '#a4ed2f', alignItems: 'center', justifyContent: 'center' },
  bagHandle: { position: 'absolute', top: '44%', width: 25, height: 16, borderWidth: 4, borderColor: '#a4ed2f', borderBottomWidth: 0, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  bagLine: { width: 21, height: 3, borderRadius: 2, backgroundColor: '#72b41b' },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 18, paddingBottom: 18 },
  eyebrow: { color: '#a4ed2f', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 5 },
  title: { color: '#f2f2f0', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  shareButton: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: '#303136', alignItems: 'center', justifyContent: 'center' },
  shareIcon: { color: '#a4ed2f', fontSize: 22 },
  progressBlock: { paddingBottom: 15 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { color: '#87888d', fontSize: 11, fontWeight: '600' },
  progressTrack: { height: 4, borderRadius: 4, backgroundColor: '#292a2e', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: '#a4ed2f' },
  listContent: { paddingBottom: 160, gap: 7 },
  itemRow: { minHeight: 53, borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#1b1c20', flexDirection: 'row', alignItems: 'center' },
  completedRow: { backgroundColor: '#151b12' },
  checkbox: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#61646d', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  checkboxDone: { backgroundColor: '#a4ed2f', borderColor: '#a4ed2f' },
  checkmark: { color: '#152008', fontSize: 14, fontWeight: '900', lineHeight: 16 },
  itemName: { color: '#e9e9e7', fontSize: 14, fontWeight: '600', flex: 1 },
  completedText: { color: '#758164', textDecorationLine: 'line-through' },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemQuantity: { color: '#9b9ca2', fontSize: 11, fontWeight: '600' },
  removeButton: { width: 28, height: 28, borderRadius: 7, backgroundColor: '#361719', alignItems: 'center', justifyContent: 'center' },
  removeText: { color: '#e96558', fontSize: 17, lineHeight: 18 },
  sectionLabel: { color: '#62646a', fontSize: 9, letterSpacing: 1.4, fontWeight: '800', marginTop: 10 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  emptyCircle: { width: 52, height: 52, borderRadius: 14, borderWidth: 1, borderColor: '#35373d', marginBottom: 18 },
  emptyTitle: { color: '#e4e4e1', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  emptyDescription: { color: '#777980', fontSize: 12, lineHeight: 18, textAlign: 'center' },
  addPanel: { position: 'absolute', left: 20, right: 20, bottom: 12, padding: 9, borderRadius: 12, backgroundColor: '#1a1b1f', borderWidth: 1, borderColor: '#282a2e' },
  inputLine: { flexDirection: 'row', alignItems: 'center', height: 42, borderRadius: 8, backgroundColor: '#202126', paddingLeft: 12 },
  input: { flex: 1, color: '#f0f0ed', fontSize: 13, fontWeight: '600' },
  addButton: { width: 32, height: 32, borderRadius: 8, marginRight: 5, backgroundColor: '#a4ed2f', alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#172207', fontSize: 23, lineHeight: 24, fontWeight: '500' },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 8 },
  stepper: { height: 28, minWidth: 74, borderRadius: 7, backgroundColor: '#25262b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  stepperAction: { color: '#99a0a7', fontSize: 16, paddingHorizontal: 5 },
  stepperValue: { color: '#e3e4e2', fontSize: 11, fontWeight: '700' },
  unitButton: { height: 28, minWidth: 32, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#25262b' },
  unitButtonSelected: { backgroundColor: '#a4ed2f' },
  unitText: { color: '#9da0a5', fontSize: 10, fontWeight: '800' },
  unitTextSelected: { color: '#192408' },
});