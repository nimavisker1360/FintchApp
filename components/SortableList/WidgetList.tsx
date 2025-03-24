import React, { useState } from 'react';
import { MARGIN } from './Config';
import Tile from './Tile';
import SortableList from './SortableList';
import { View } from 'react-native';

const initialTiles = [
  { id: 'spent' },
  { id: 'cashback' },
  { id: 'recent' },
  { id: 'cards' },
];

const WidgetList = () => {
  const [tiles, setTiles] = useState(initialTiles);

  const handleDragEnd = (updatedPositions) => {
    const sortedTiles = [...tiles].sort((a, b) => updatedPositions[a.id] - updatedPositions[b.id]);
    setTiles(sortedTiles);
  };

  return (
    <View style={{ paddingHorizontal: MARGIN, marginBottom: 80 }}>
      <SortableList editing={true} onDragEnd={handleDragEnd}>
        {tiles.map((tile) => (
          <Tile key={tile.id} id={tile.id} />
        ))}
      </SortableList>
    </View>
  );
};

export default WidgetList;
