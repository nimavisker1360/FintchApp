import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  Animated,
  ViewProps,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface DropdownProps {
  label: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonContainerRef = useRef<View | null>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const [buttonHeight, setButtonHeight] = useState(0);

  const menuItems = [
    { text: "Statement", icon: "file-document-outline" },
    { text: "Convertor", icon: "swap-horizontal" },
    { text: "Background", icon: "palette-outline" },
    { text: "Add new account", icon: "account-plus-outline" },
  ];

  const handlePress = () => {
    buttonContainerRef.current?.measure(
      (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number
      ) => {
        const screenWidth = Dimensions.get("window").width;
        setButtonHeight(height);
        setDropdownPosition({
          top: pageY,
          right: screenWidth - (pageX + width + 1),
        });
        setIsOpen(true);
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }).start();
      }
    );
  };

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
      setDropdownPosition({
        top: 0,
        right: 0,
      });
    });
  };

  return (
    <View style={styles.container}>
      <View ref={buttonContainerRef} style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Icon name="dots-horizontal" size={32} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.buttonLabel}>More</Text>
      </View>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <Animated.View
            style={[
              styles.dropdownMenu,
              {
                position: "absolute",
                top: dropdownPosition.top,
                right: dropdownPosition.right,
                opacity: scaleAnim,
                transform: [
                  { scale: scaleAnim },
                  {
                    translateY: scaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, buttonHeight + 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => {
                  handleClose();
                }}
              >
                <Icon name={item.icon} size={20} color="#6B7280" />
                <Text style={styles.menuItemText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EBEEF2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
  buttonLabel: {
    marginTop: 8,
    color: "#1F2937",
    fontSize: 13,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownMenu: {
    backgroundColor: "white",
    borderRadius: 12,
    width: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemText: {
    color: "#374151",
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "500",
  },
});

export default Dropdown;
