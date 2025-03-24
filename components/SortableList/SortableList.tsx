import React from "react";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { NativeScrollEvent } from "react-native";

import Item from "./Item";
import { COL, Positions, SIZE } from "./Config";

interface ListProps {
  children: React.ReactElement<{ id: string }>[];
  editing: boolean;
  onDragEnd: (positions: Positions) => void;
}

const SortableList = ({ children, editing, onDragEnd }: ListProps) => {
  const scrollY = useSharedValue(0);
  const scrollView = useAnimatedRef<Animated.ScrollView>();

  // ذخیره موقعیت اولیه هر آیتم
  const positions = useSharedValue<Positions>(
    Object.assign(
      {},
      ...children.map((child, index) => ({ [child.props.id]: index }))
    )
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event: any) => {
      "worklet";
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      ref={scrollView}
      contentContainerStyle={{
        height: Math.ceil(children.length / COL) * SIZE,
      }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      scrollEventThrottle={16}
    >
      {children.map((child) => (
        <Item
          key={child.props.id}
          positions={positions}
          id={child.props.id}
          editing={editing}
          onDragEnd={() => onDragEnd(positions.value)} // ارسال موقعیت جدید
          scrollView={scrollView}
          scrollY={scrollY}
        >
          {child}
        </Item>
      ))}
    </Animated.ScrollView>
  );
};

export default SortableList;
