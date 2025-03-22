import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const Page = () => {
  return (
    <ImageBackground
      source={require("@/assets/images/intro.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.header}>
            Ready to change{"\n"}the way you{"\n"}money?
          </Text>
        </View>

        <View style={styles.buttons}>
          <Link
            href={"/login"}
            style={[
              defaultStyles.pillButton,
              { flex: 1, backgroundColor: Colors.dark },
            ]}
            asChild
          >
            <TouchableOpacity>
              <Text style={{ color: "white", fontSize: 22, fontWeight: "500" }}>
                Log in
              </Text>
            </TouchableOpacity>
          </Link>
          <Link
            href={"/signup"}
            style={[
              defaultStyles.pillButton,
              { flex: 1, backgroundColor: "#fff" },
            ]}
            asChild
          >
            <TouchableOpacity>
              <Text style={{ fontSize: 22, fontWeight: "500" }}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Adding a semi-transparent overlay
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    marginTop: 60,
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 42,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "white",
    textAlign: "left",
    lineHeight: 50,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
export default Page;
