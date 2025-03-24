import React, { ReactNode, RefObject } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  scrollTo,
  withTiming,
  useSharedValue,
  runOnJS,
  SharedValue,
  AnimatedRef,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  animationConfig,
  COL,
  getOrder,
  getPosition,
  Positions,
  SIZE,
} from "./Config";

interface ItemProps {
  children: ReactNode;
  positions: SharedValue<Positions>;
  id: string;
  editing: boolean;
  onDragEnd: (diffs: Positions) => void;
  scrollView: AnimatedRef<Animated.ScrollView>;
  scrollY: SharedValue<number>;
}

const Item = ({
  children,
  positions,
  id,
  onDragEnd,
  scrollView,
  scrollY,
  editing,
}: ItemProps) => {
  const inset = useSafeAreaInsets();
  const containerHeight =
    Dimensions.get("window").height - inset.top - inset.bottom;
  const contentHeight = (Object.keys(positions.value).length / COL) * SIZE;
  const isGestureActive = useSharedValue(false);

  const position = getPosition(positions.value[id]!);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);

  useAnimatedReaction(
    () => positions.value[id]!,
    (currentPosition) => {
      if (!isGestureActive.value) {
        const pos = getPosition(currentPosition);
        translateX.value = withSpring(pos.x, {
          mass: 0.5,
          damping: 15,
          stiffness: 180,
        });
        translateY.value = withSpring(pos.y, {
          mass: 0.5,
          damping: 15,
          stiffness: 180,
        });
      }
    }
  );

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number; y: number; currentOrder: number }
  >({
    onStart: (_, ctx) => {
      if (editing) {
        ctx.x = translateX.value;
        ctx.y = translateY.value;
        ctx.currentOrder = positions.value[id];
        isGestureActive.value = true;
      }
    },
    onActive: ({ translationX, translationY }, ctx) => {
      if (editing) {
        const newX = ctx.x + translationX;
        const newY = ctx.y + translationY;

        translateX.value = newX;
        translateY.value = newY;

        const newOrder = getOrder(
          newX,
          newY,
          Object.keys(positions.value).length - 1
        );

        const oldOrder = positions.value[id];

        if (newOrder !== oldOrder) {
          const idToSwap = Object.keys(positions.value).find(
            (key) => positions.value[key] === newOrder && key !== id
          );

          if (idToSwap) {
            const newPositions = { ...positions.value };
            // Swap positions
            newPositions[id] = newOrder;
            newPositions[idToSwap] = oldOrder;
            positions.value = newPositions;
          }
        }

        // Handle scrolling with improved bounds
        const lowerBound = scrollY.value;
        const upperBound = lowerBound + containerHeight - SIZE;
        const maxScroll = contentHeight - containerHeight;
        const leftToScrollDown = maxScroll - scrollY.value;

        if (newY < lowerBound) {
          const diff = Math.min(lowerBound - newY, lowerBound);
          scrollY.value -= diff;
          scrollTo(scrollView, 0, scrollY.value, false);
          ctx.y -= diff;
          translateY.value = ctx.y + translationY;
        }

        if (newY > upperBound) {
          const diff = Math.min(newY - upperBound, leftToScrollDown);
          scrollY.value += diff;
          scrollTo(scrollView, 0, scrollY.value, false);
          ctx.y += diff;
          translateY.value = ctx.y + translationY;
        }
      }
    },
    onEnd: () => {
      if (editing) {
        const finalPosition = getPosition(positions.value[id]!);

        translateX.value = withSpring(finalPosition.x, {
          mass: 0.5,
          damping: 15,
          stiffness: 180,
        });

        translateY.value = withSpring(
          finalPosition.y,
          {
            mass: 0.5,
            damping: 15,
            stiffness: 180,
          },
          () => {
            isGestureActive.value = false;
            runOnJS(onDragEnd)(positions.value);
          }
        );
      }
    },
  });

  const style = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 1;
    const scale = withSpring(isGestureActive.value ? 1.1 : 1);

    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: SIZE,
      height: SIZE,
      zIndex,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale },
      ],
    };
  });
  return (
    <Animated.View style={style}>
      <PanGestureHandler enabled={editing} onGestureEvent={onGestureEvent}>
        <Animated.View style={StyleSheet.absoluteFill}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default Item;
