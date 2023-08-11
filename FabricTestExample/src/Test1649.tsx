import * as React from 'react';
import {
  Button,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';
import * as jotai from 'jotai';

type SheetDetent = NativeStackNavigationOptions['sheetAllowedDetents'];
type SheetUndimmedDetent =
  NativeStackNavigationOptions['sheetLargestUndimmedDetent'];

type NavProp = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const Stack = createNativeStackNavigator();

const initialAllowedDetentsArray = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

/// Sheet options
// const allowedDetentsAtom = jotai.atom<SheetDetent>('all');
// const largestUndimmedDetentAtom = jotai.atom<SheetDetentTypes | number>('all');

const allowedDetentsAtom = jotai.atom<SheetDetent>(initialAllowedDetentsArray);
const largestUndimmedDetentAtom = jotai.atom<SheetUndimmedDetent>(3);

// const allowedDetentsAtom = jotai.atom<SheetDetent>([0.7]);
// const largestUndimmedDetentAtom = jotai.atom<SheetDetentTypes | number>(0);

const grabberVisibleAtom = jotai.atom(false);
const cornerRadiusAtom = jotai.atom(-1);
const expandsWhenScrolledToEdgeAtom = jotai.atom(false);

const sheetOptionsAtom = jotai.atom(get => ({
  sheetAllowedDetents: get(allowedDetentsAtom),
  sheetLargestUndimmedDetent: get(largestUndimmedDetentAtom),
  sheetGrabberVisible: get(grabberVisibleAtom),
  sheetCornerRadius: get(cornerRadiusAtom),
  sheetExpandsWhenScrolledToEdge: get(expandsWhenScrolledToEdgeAtom),
}));

export default function App(): JSX.Element {
  const sheetOptions = jotai.useAtomValue(sheetOptionsAtom);

  const initialScreenOptions: NativeStackNavigationOptions = {
    stackPresentation: 'formSheet',
    ...sheetOptions,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // headerRight: () => <View style={styles.headerView} />,
          headerTitleStyle: {
            color: 'cyan',
          },
          headerShown: true,
          headerHideBackButton: false,
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            fullScreenSwipeEnabled: true,
          }}
        />
        <Stack.Screen
          name="SheetScreen"
          component={SheetScreen}
          options={{
            ...initialScreenOptions,
          }}
        />
        <Stack.Screen
          name="SheetScreenWithScrollView"
          component={SheetScreenWithScrollView}
          options={{
            ...initialScreenOptions,
          }}
        />
        <Stack.Screen
          name="SheetScreenWithTextInput"
          component={SheetScreenWithTextInput}
          options={{
            ...initialScreenOptions,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Home({ navigation }: NavProp) {
  return (
    <Button
      title="Tap me for the second screen"
      onPress={() => navigation.navigate('Second')}
    />
  );
}

function Second({ navigation }: NavProp) {
  return (
    <>
      <Button
        title="Open the sheet"
        onPress={() => navigation.navigate('SheetScreen')}
      />
      <Button
        title="Open the sheet with ScrollView"
        onPress={() => navigation.navigate('SheetScreenWithScrollView')}
      />
      <Button
        title="Open the sheet with text input (keyboard interaction)"
        onPress={() => navigation.navigate('SheetScreenWithTextInput')}
      />
    </>
  );
}

function SheetScreen({ navigation }: NavProp) {
  const [allowedDetents, setAllowedDetents] = jotai.useAtom(allowedDetentsAtom);
  const [largestUndimmedDetent, setLargestUndimmedDetent] = jotai.useAtom(
    largestUndimmedDetentAtom,
  );
  const [grabberVisible, setGrabberVisible] = jotai.useAtom(grabberVisibleAtom);
  const [cornerRadius, setCornerRadius] = jotai.useAtom(cornerRadiusAtom);
  const [expandsWhenScrolledToEdge, setExpandsWhenScrolledToEdge] =
    jotai.useAtom(expandsWhenScrolledToEdgeAtom);

  function nextDetentLevel(detent: SheetDetent): SheetDetent {
    if (Array.isArray(detent)) {
      return 'all';
    } else if (detent === 'all') {
      return 'medium';
    } else if (detent === 'medium') {
      return 'large';
    } else if (detent === 'large') {
      return initialAllowedDetentsArray;
    } else {
      return 'all';
    }
  }

  function nextUndimmedDetentLevel(
    detent: SheetUndimmedDetent,
  ): SheetUndimmedDetent {
    if (typeof detent === 'number') {
      if (Array.isArray(allowedDetents) && detent + 1 < allowedDetents.length) {
        return detent + 1;
      } else {
        return 'all';
      }
    } else if (detent === 'large') {
      if (Array.isArray(allowedDetents)) {
        return 0;
      } else {
        return 'all';
      }
    } else {
      return nextDetentLevel(detent);
    }
  }

  return (
    <View style={styles.centeredView}>
      <Button
        title="Tap me for the first screen"
        onPress={() => navigation.navigate('Home')}
      />
      <Button
        title="Tap me for the second screen"
        onPress={() => navigation.navigate('Second')}
      />
      <Button
        title="Change the corner radius"
        onPress={() => {
          const newRadius = cornerRadius >= 150 ? -1.0 : cornerRadius + 50;
          setCornerRadius(newRadius);
        }}
      />
      <Text>radius: {cornerRadius}</Text>
      <Button
        title="Change detent level"
        onPress={() => {
          const newDetentLevel = nextDetentLevel(allowedDetents);
          setAllowedDetents(newDetentLevel);
        }}
      />
      <Text>detent: {allowedDetents}</Text>
      <Button
        title="Change largest undimmed detent"
        onPress={() => {
          const newDetentLevel = nextUndimmedDetentLevel(largestUndimmedDetent);
          setLargestUndimmedDetent(newDetentLevel);
        }}
      />
      <Text>largestUndimmedDetent: {largestUndimmedDetent}</Text>
      <Button
        title="Toggle sheetExpandsWhenScrolledToEdge"
        onPress={() => {
          setExpandsWhenScrolledToEdge(!expandsWhenScrolledToEdge);
        }}
      />
      <Text>
        sheetExpandsWhenScrolledToEdge:{' '}
        {expandsWhenScrolledToEdge ? 'true' : 'false'}
      </Text>
      <Button
        title="Toggle grabber visibility"
        onPress={() => {
          setGrabberVisible(!grabberVisible);
        }}
      />
    </View>
  );
}

function SheetScreenWithScrollView({ navigation }: NavProp) {
  return (
    <>
      <View style={styles.centeredView}>
        <ScrollView>
          <SheetScreen navigation={navigation} />
          {[...Array(40).keys()].map(val => (
            <Text key={`${val}`}>Some component {val}</Text>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

function SheetScreenWithTextInput({ navigation }: NavProp) {
  const [textValue, setTextValue] = React.useState('text input');

  return (
    <View style={styles.centeredView}>
      <TextInput
        style={[styles.bordered, styles.keyboardTriggerTextInput]}
        value={textValue}
        onChangeText={text => setTextValue(text)}
      />
      <SheetScreen navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerView: {
    height: 20,
    width: 20,
    backgroundColor: 'red',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bordered: {
    borderColor: 'black',
    borderWidth: 2,
  },
  keyboardTriggerTextInput: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    marginTop: 10,
  },
});
