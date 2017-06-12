import React from 'react';
import { configure, addDecorator } from '@storybook/react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

addDecorator(story => (
  <MuiThemeProvider>{story()}</MuiThemeProvider>
))

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
