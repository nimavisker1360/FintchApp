import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Currency } from "@/interfaces/crypto";
import { Link } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";

const Page = () => {
  const headerHeight = useHeaderHeight();

  const { data: currencies } = useQuery({
    queryKey: ["listings"],
    queryFn: () => fetch("/api/listings").then((res) => res.json()),
  });

  const ids = currencies?.map((currency: Currency) => currency.id).join(",");

  const { data: cryptoInfo } = useQuery({
    queryKey: ["info", ids],
    queryFn: () => fetch(`/api/info?ids=${ids}`).then((res) => res.json()),
    enabled: !!ids,
  });

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 300 }}
      bounces={true}
      overScrollMode="always"
      showsVerticalScrollIndicator={false}
    >
      <Text style={[defaultStyles.sectionHeader, { marginBottom: 10 }]}>
        Latest Crypto
      </Text>
      <View style={[defaultStyles.block, { paddingBottom: 30 }]}>
  {currencies?.map((currency: Currency) => (
    <Link href={`/crypto/${currency.id}`} key={currency.id} asChild>
      <TouchableOpacity style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 6 }}>
        <Image source={{ uri: cryptoInfo?.[currency.id]?.logo }} style={{ width: 32, height: 32, borderRadius: 16 }} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.dark }}>{currency.name}</Text>
          <Text style={{ fontSize: 12, color: Colors.gray }}>{currency.symbol}</Text>
        </View>
        <View style={{ gap: 4, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 14 }}>{currency.quote.EUR.price.toFixed(2)} €</Text>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <Ionicons
              name={currency.quote.EUR.percent_change_1h > 0 ? 'caret-up' : 'caret-down'}
              size={14}
              color={currency.quote.EUR.percent_change_1h > 0 ? 'green' : 'red'}
            />
            <Text style={{ fontSize: 12, color: currency.quote.EUR.percent_change_1h > 0 ? 'green' : 'red' }}>
              {currency.quote.EUR.percent_change_1h.toFixed(2)} %
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  ))}
</View>

    </ScrollView>
  );
};

export default Page;
