import * as React from 'react';
import { compose } from 'recompose';
import { Icon, List, ListProps } from 'semantic-ui-react';
import { withRouter, WithRouterProps } from 'next/router';

import Routes from '../../../routes';
import withCurrentDate, {
  WithCurrentDateProps
} from '../../CurrentDate/decorators/withCurrentDate';
import withCurrentNation, {
  WithCurrentNationProps
} from '../../Nation/decorators/withCurrentNation';
import withFetchTerritories, {
  WithFetchTerritoriesProps
} from '../../MainMap/decorators/withFetchTerritories';

const Territories: React.SFC<
  ListProps &
    WithCurrentDateProps &
    WithCurrentNationProps &
    WithFetchTerritoriesProps &
    WithRouterProps
> = ({
  currentDate,
  currentNation,
  router: {
    query: { day, month, year }
  },
  territories
}) => (
  <List selection={true}>
    {territories &&
      territories
        .filter(({ nation }) => nation === currentNation)
        .map(({ end_date: endDateFromData, id, start_date }) => {
          // If no endDate is specified, we consider it today
          const endDate = endDateFromData
            ? new Date(endDateFromData)
            : new Date();
          const startDate = new Date(start_date);

          // Convert `startDate` to yyyy/mm/dd format
          const url = startDate
            .toISOString()
            .split('T')[0]
            .split('-')
            .join('/');

          const isActive = currentDate >= startDate && currentDate <= endDate;

          return (
            <Routes.Link key={id} route={`/map/${url}/${currentNation}`}>
              <List.Item>
                <List.Header>
                  {isActive && <Icon name="caret right" />}
                  From {startDate.getFullYear()} to{' '}
                  {endDateFromData ? endDate.getFullYear() : 'today'}
                </List.Header>
                {isActive && (
                  <List.Content>
                    Currently shown on map.{' '}
                    <Routes.Link
                      route={`/map/${year}/${month}/${day}/${currentNation}/edit`}
                    >
                      <a>Edit</a>
                    </Routes.Link>
                  </List.Content>
                )}
              </List.Item>
            </Routes.Link>
          );
        })}
  </List>
);

export default compose(
  withCurrentDate,
  withCurrentNation,
  withFetchTerritories,
  withRouter
)(Territories);
