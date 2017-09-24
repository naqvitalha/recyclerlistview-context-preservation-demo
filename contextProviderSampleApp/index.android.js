/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import MainComponent from './src/MainComponent';

export default class contextProviderSampleApp extends Component {
    render() {
        return <MainComponent />;
    }
}

AppRegistry.registerComponent('contextProviderSampleApp', () => contextProviderSampleApp);
