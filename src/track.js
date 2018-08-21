import config, {constant} from './config/default';
import React, { Component } from 'react';
import ReactGA from 'react-ga';

ReactGA.initialize(config.analyticsID);

export function trackEvent(category, action) {
  ReactGA.event({category, action});
}

