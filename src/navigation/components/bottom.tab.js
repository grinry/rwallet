import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import posed from 'react-native-pose';
import PropTypes from 'prop-types';

const TABCOUNT = 4; // using let since it should be dynamic based on the config of navigation. Currently it is fixed as 2

const windowWidth = Dimensions.get('window').width;
const tabWidth = windowWidth / TABCOUNT;

const SpotLight = posed.View({
  route0: { x: tabWidth * 0.35 },
  route1: { x: tabWidth * 1.35 },
  route2: { x: tabWidth * 2.35 },
  route3: { x: tabWidth * 3.35 },
});

const Scaler = posed.View({
  active: { scale: 1.25 },
  inactive: { scale: 1 },
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    elevation: 2,
    backgroundColor: 'black',
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
  },
  tabButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  spotLight: {
    width: tabWidth * 0.3,
    height: 6,
    backgroundColor: 'green',
    borderRadius: 8,
  },
  tabButtonText: {
    color: 'white',
  },
});

const TabBar = (props) => {
  const {
    renderIcon,
    getLabelText,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    getAccessibilityLabel,
    navigation,
  } = props;

  const { routes, index: activeRouteIndex } = navigation.state;

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <SpotLight style={styles.spotLight} pose={`route${activeRouteIndex}`} />
      </View>
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

        return (
          <TouchableOpacity
            key={getLabelText({ route }).replace(' ', '_')}
            style={styles.tabButton}
            onPress={() => {
              onTabPress({ route });
            }}
            onLongPress={() => {
              onTabLongPress({ route });
            }}
            accessibilityLabel={getAccessibilityLabel({ route })}
          >
            <Scaler style={styles.scaler} pose={isRouteActive ? 'active' : 'inactive'}>
              {renderIcon({ route, focused: isRouteActive, tintColor })}
            </Scaler>

            <Text style={[styles.tabButtonText]}>{getLabelText({ route })}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

TabBar.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  renderIcon: PropTypes.string.isRequired,
  getLabelText: PropTypes.string.isRequired,
  activeTintColor: PropTypes.string.isRequired,
  inactiveTintColor: PropTypes.string.isRequired,
  onTabPress: PropTypes.func.isRequired,
  onTabLongPress: PropTypes.func.isRequired,
  getAccessibilityLabel: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

export default TabBar;