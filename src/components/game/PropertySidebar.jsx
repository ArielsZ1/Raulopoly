import { memo } from "react";

const ITEM_ROW_STYLE = { display: 'flex', alignItems: 'center', gap: 3, marginBottom: 1 };
const OWNER_DOT_STYLE = { width: 6, height: 6, borderRadius: '50%' };

const PropertySidebar = memo(function PropertySidebar({
  boardSize,
  t,
  groupSquares,
  groupColors,
  railroads,
  utilities,
  propOwners,
  propHouses,
  squares,
  playerConfigs,
  btnStyle,
  onExit,
}) {
  return (
    <div style={{ marginLeft: 12, width: 200, height: boardSize, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: 10, color: '#44aaff', marginBottom: 4 }}>{t('propertyMap')}</div>
      {Object.entries(groupSquares).map(([group, ids]) => (
        <div key={group} style={{ background: '#0a1520', border: `1px solid ${groupColors[group]}44`, borderLeft: `3px solid ${groupColors[group]}`, borderRadius: 4, padding: '4px 6px' }}>
          <div style={{ fontSize: 8, color: groupColors[group], fontFamily: '"Orbitron", sans-serif', marginBottom: 2 }}>{group.toUpperCase()}</div>
          {ids.map((id) => {
            const owner = propOwners[id];
            const houses = propHouses[id] || 0;
            const sq = squares[id];
            return (
              <div key={id} style={ITEM_ROW_STYLE}>
                <div style={{ ...OWNER_DOT_STYLE, background: owner !== undefined ? playerConfigs[owner].color : '#333' }} />
                <div style={{ fontSize: 7, color: owner !== undefined ? '#ccc' : '#445566', flex: 1 }}>{sq.name}</div>
                {houses > 0 && <div style={{ fontSize: 7, color: '#44ff88' }}>{houses === 5 ? '🏰' : `🏠${houses}`}</div>}
                {owner !== undefined && <div style={{ fontSize: 9 }}>{playerConfigs[owner].emoji}</div>}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ background: '#0a1520', border: '1px solid #334455', borderRadius: 4, padding: '4px 6px' }}>
        <div style={{ fontSize: 8, color: '#888', fontFamily: '"Orbitron", sans-serif', marginBottom: 2 }}>{t('otherProperties')}</div>
        {[...railroads, ...utilities].map((id) => {
          const owner = propOwners[id];
          const sq = squares[id];
          return (
            <div key={id} style={ITEM_ROW_STYLE}>
              <div style={{ ...OWNER_DOT_STYLE, background: owner !== undefined ? playerConfigs[owner].color : '#333' }} />
              <div style={{ fontSize: 7, color: owner !== undefined ? '#ccc' : '#445566', flex: 1 }}>{sq.name}</div>
              {owner !== undefined && <div style={{ fontSize: 9 }}>{playerConfigs[owner].emoji}</div>}
            </div>
          );
        })}
      </div>
      <button onClick={onExit} style={{ ...btnStyle('#333', true), marginTop: 8, width: '100%' }}>{t('exit')}</button>
    </div>
  );
});

export default PropertySidebar;
