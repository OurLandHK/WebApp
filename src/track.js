import config from './config/default';
import ReactGA from 'react-ga';

ReactGA.initialize(config.analyticsID);

export function trackEvent(category, action) {
  ReactGA.event({category, action});
}
