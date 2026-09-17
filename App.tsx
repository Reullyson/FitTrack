import { SafeAreaView, Text, View } from 'react-native';

const colors = {
  background: '#111214',
  panel: '#1b1c20',
  completedPanel: '#151b12',
  text: '#e9e9e7',
  muted: '#87888d',
  lime: '#a4ed2f',
  danger: '#e96558',
};

const items = [
  { name: 'Arroz', amount: '5 kg', completed: false },
  { name: 'Feijão', amount: '2 kg', completed: false },
  { name: 'Leite', amount: '6 un', completed: false },
  { name: 'Sabão em pó', amount: '1 cx', completed: false },
  { name: 'Café', amount: '1 pct', completed: true },
];

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 18 }}>
        <Text style={{ color: colors.lime, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 }}>
          MINHA LISTA
        </Text>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 5 }}>
          Compras da semana
        </Text>

        <View style={{ marginTop: 19 }}>
          <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '600' }}>
            4 pendentes                         1 de 5 no carrinho
          </Text>
          <View style={{ height: 4, backgroundColor: '#292a2e', marginTop: 8 }}>
            <View style={{ width: '20%', height: 4, backgroundColor: colors.lime }} />
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
          {items.map((item) => (
            <View
              key={item.name}
              style={{
                minHeight: 53,
                borderRadius: 10,
                paddingHorizontal: 12,
                backgroundColor: item.completed ? colors.completedPanel : colors.panel,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 7,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: item.completed ? colors.lime : '#61646d',
                  backgroundColor: item.completed ? colors.lime : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 11,
                }}
              >
                {item.completed && <Text style={{ color: '#152008', fontSize: 13, fontWeight: '900' }}>✓</Text>}
              </View>
              <Text
                style={{
                  flex: 1,
                  color: item.completed ? '#758164' : colors.text,
                  fontSize: 14,
                  fontWeight: '600',
                  textDecorationLine: item.completed ? 'line-through' : 'none',
                }}
              >
                {item.name}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '600', marginRight: 10 }}>
                {item.amount}
              </Text>
              <Text style={{ color: colors.danger, fontSize: 17 }}>×</Text>
            </View>
          ))}
        </View>

        <View
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 14,
            padding: 10,
            borderRadius: 12,
            backgroundColor: '#1a1b1f',
          }}
        >
          <Text style={{ color: '#5c5d63', fontSize: 13 }}>Novo item...                         +</Text>
          <Text style={{ color: '#9da0a5', fontSize: 11, marginTop: 12 }}>−     1     +       un     kg     cx     pct</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
