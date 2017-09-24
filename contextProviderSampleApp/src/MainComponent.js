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
};

/***
 * Component to demonstrate context preservation by RecyclerListView. I'm assuming basic understanding of Layout and Data Providers,
 * if you're unfamiliar with RecyclerListView please read more about it first.
 */

export default class MainComponent extends Component {
    constructor(props) {
        super(props);

        //Generating data
        this._generateData();

        //Layout provider for parent list
        this._parentRLVLayoutProvider = new LayoutProvider(
            index => {
                return ViewTypes.SIMPLE_ROW;
            },
            (type, dim) => {
                dim.height = 100;
                dim.width = width;
            }
        );

        //Layout provider for children lists
        this._childRLVLayoutProvider = new LayoutProvider(
            index => {
                return ViewTypes.SIMPLE_ROW;
            },
            (type, dim) => {
                dim.height = 100;
                dim.width = 100;
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
        //There will be 10 lists in total
        this._parentArr = new Array(10);

        //Each list will use these fruit names as data. Text being of variable lengths will result in non deterministic widths
        this._childArr = [
            'Apple',
            'Banana',
            'Custard Apple',
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

        //Every list in parent has its own data provider and context provider which we create here, to know more about this
        //check samples of RecyclerListView
        for (let i = 0; i < this._parentArr.length; i++) {
            this._parentArr[i] = {
                dataProvider: new DataProvider((r1, r2) => {
                    return r1 !== r2;
                }).cloneWithRows(this._childArr),

                //Proving unique key to context provider, using index as unique key here. You can choose your own, this should be
                //unique in global scope ideally.
                contextProvider: new ContextHelper(i + '')
            };
        }
    }

    //Render internal lists with fruit names, uses non deterministic rendering
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
            <View style={styles.textContainer}>
                <Text style={styles.text}>{data}</Text>
            </View>
        );
    };

    _onToggle = () => {
        this.setState({
            isViewMounted: !this.state.isViewMounted
        });
    };

    //Parent is also a RecyclerListView with its own context provider which means event the vertical scroll position will be preserved
    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight style={styles.toggleButton} onPress={this._onToggle}>
                    <Text style={{color: 'white'}}>Toggle</Text>
                </TouchableHighlight>
                {this.state.isViewMounted
                    ? <RecyclerListView
                        style={{flex: 1}}
                        showsVerticalScrollIndicator={false}
                        contextProvider={this._parentContextProvider}
                        layoutProvider={this._parentRLVLayoutProvider}
                        dataProvider={this.state.parentRLVDataProvider}
                        rowRenderer={this._parentRowRenderer}
                    />
                    : <Text style={styles.indicatorText}>Click on toggle to mount lists again</Text>}
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
    text: {
        color: '#2175FF'
    },
    toggleButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        margin: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#2175FF',
        alignSelf: 'center'
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: 100,
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 10,
        borderColor: '#FFFFFF',
        borderWidth: 5,
        backgroundColor: '#F0F0F0'
    },
    indicatorText: {
        textAlign: 'center',
        marginTop: 100
    }
});
