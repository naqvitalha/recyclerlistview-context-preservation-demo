/**
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableHighlight} from 'react-native';
import {RecyclerListView, LayoutProvider, DataProvider} from 'recyclerlistview';
import ContextHelper from './ContextHelper';

const {width} = Dimensions.get('window');

const ViewTypes = {
    SIMPLE_ROW: 0
}

export default class MainComponent extends Component {
    constructor(props) {
        super(props);
        this._generateData();

        this._parentRLVLayoutProvider = new LayoutProvider(
            index => {
                return ViewTypes.SIMPLE_ROW;
            },
            (type, dim) => {
                dim.height = 100;
                dim.width = width;
            }
        );

        this._childRLVLayoutProvider = new LayoutProvider(
            index => {
                return ViewTypes.SIMPLE_ROW;
            },
            (type, dim) => {
                dim.height = 100;
                dim.width = 20;
            }
        );

        this._parentContextProvider = new ContextHelper('PARENT');

        this.state = {
            isViewMounted: true,
            parentRLVDataProvider: new DataProvider((r1, r2) => {
                return r1 !== r2;
            }).cloneWithRows(this._parentArr)
        };
    }

    _generateData() {
        this._parentArr = new Array(10);
        this._childArr = [
            'Apple',
            'Banana',
            'Carrot',
            'Dragon Fruit',
            'Egg Fruit',
            'Finger Lime',
            'Grapes',
            'Honeydew Melon',
            'Indonesian Lime',
            'Jackfruit',
            'Kiwi',
            'Lychee',
            'Mango',
            'Navel Orange',
            'Oranges',
            'Pomegranate',
            'Queen Anne Cherry',
            'Raspberries',
            'Strawberries',
            'Tomato',
            'Ugni',
            'Vanilla Bean',
            'Watermelon',
            'Ximenia caffra fruit',
            'Yellow Passion Fruit',
            'Zuchinni'
        ];
        for (let i = 0; i < this._parentArr.length; i++) {
            this._parentArr[i] = {
                dataProvider: new DataProvider((r1, r2) => {
                    return r1 !== r2;
                }).cloneWithRows(this._childArr),
                contextProvider: new ContextHelper(i + "")
            };
        }
    }

    _parentRowRenderer = (type, data) => {
        return (
            <RecyclerListView
                style={{flex: 1}}
                showsHorizontalScrollIndicator={false}
                isHorizontal={true}
                dataProvider={data.dataProvider}
                contextProvider={data.contextProvider}
                layoutProvider={this._childRLVLayoutProvider}
                forceNonDeterministicRendering={true}
                rowRenderer={this._childRowRenderer}
            />
        );
    };

    _childRowRenderer = (type, data) => {
        return (
            <View style={{minWidth: 5, height: 100, margin: 5, backgroundColor: 'grey'}}>
                <Text>{data}</Text>
            </View>
        );
    };

    _onToggle = () => {
        this.setState({
            isViewMounted: !this.state.isViewMounted
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight style={{width: 300, height: 100}} onPress={this._onToggle}>
                    <Text>Toggle</Text>
                </TouchableHighlight>
                {this.state.isViewMounted
                    ? <RecyclerListView
                        style={{flex: 1}}
                        contextProvider={this._parentContextProvider}
                        layoutProvider={this._parentRLVLayoutProvider}
                        dataProvider={this.state.parentRLVDataProvider}
                        rowRenderer={this._parentRowRenderer}
                    />
                    : <View/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
});
