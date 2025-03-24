import Dropdown from "@/components/Dropdown";
import RoundBtn from "@/components/RoundBtn";
import Colors from "@/constants/Colors";
import { useBalanceStore } from "@/store/balanceStore";
import { View, Text, ScrollView, StyleSheet, Button } from "react-native";

const PAGE = () => {
  const { balance, runTransaction, transactions, clearTransactions } =
    useBalanceStore();

  const onAddMoney = () => {
    runTransaction({
      id: Math.random().toString(),
      amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date(),
      title: 'Added money',
    });
  };
  
  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>₺</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <RoundBtn icon={"add"} text={"Add Money"} onPress={onAddMoney} />
        <RoundBtn icon={"refresh"} text={"Exchange"} />
        <RoundBtn icon={"list"} text={"Details"} />
        <Dropdown label={""} />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  account: {
    alignItems: "center",
    margin: 80,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 10,
  },
  balance: {
    fontSize: 50,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 20,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
});
export default PAGE;
