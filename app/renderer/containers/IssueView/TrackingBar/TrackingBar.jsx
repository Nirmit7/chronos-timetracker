// @flow
import React from 'react';
import moment from 'moment';
import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Issue,
  Dispatch,
  IssuesReports,
  RemainingEstimate,
} from 'types';

import {
  getUiState,
  getTrackingIssue,
  getTrackingIssueReport,
  getTimerState,
} from 'selectors';
import {
  timerActions,
  screenshotsActions,
  uiActions,
} from 'actions';
import {
  Flex,
} from 'components';
import {
  Transition,
} from 'react-transition-group';
import CameraIcon from '@atlaskit/icon/glyph/camera';
import Tooltip from '@atlaskit/tooltip';

import WorklogCommentDialog from './WorklogCommentDialog';
import ProgressBar from './ProgressBar/ProgressBar';
import * as S from './styled';


type Props = {
  time: number,
  report: IssuesReports,
  screenshotsEnabled: boolean,
  trackingIssue: Issue,
  worklogComment: string,
  remainingEstimateValue: RemainingEstimate,
  remainingEstimateNewValue: string,
  remainingEstimateReduceByValue: string,
  dispatch: Dispatch,
  isCommentDialogOpen: boolean,
  showLoggedOnStop: boolean,
}

function addLeadingZero(s: number): string {
  return s < 10 ? `0${s}` : `${s}`;
}

function getTimeString(time: number): string {
  const timeMoment = moment.duration(time * 1000);
  return [
    `${timeMoment.hours() ? `${addLeadingZero(timeMoment.hours())}:` : ''}`,
    `${addLeadingZero(timeMoment.minutes())}:${addLeadingZero(timeMoment.seconds())}`,
  ].join('');
}

const TrackingBar: StatelessFunctionalComponent<Props> = ({
  time,
  report,
  screenshotsEnabled,
  trackingIssue,
  worklogComment,
  remainingEstimateValue,
  remainingEstimateNewValue,
  remainingEstimateReduceByValue,
  dispatch,
  isCommentDialogOpen,
  showLoggedOnStop,
}: Props): Node => (
  <Transition
    appear
    timeout={250}
    enter={false}
    expit={false}
  >
    <S.Container>
      <Flex row alignCenter>
        <WorklogCommentDialog
          comment={worklogComment}
          remainingEstimateValue={remainingEstimateValue}
          remainingEstimateNewValue={remainingEstimateNewValue}
          remainingEstimateReduceByValue={remainingEstimateReduceByValue}
          issue={trackingIssue}
          onSetComment={(comment) => {
            dispatch(uiActions.setUiState({
              worklogComment: comment,
            }));
          }}
          onRemainingEstimateChange={(value) => {
            dispatch(uiActions.setUiState({
              remainingEstimateValue: value,
            }));
          }}
          onRemainingEstimateNewChange={(value) => {
            dispatch(uiActions.setUiState({
              remainingEstimateNewValue: value,
            }));
          }}
          onRemainingEstimateReduceByChange={(value) => {
            dispatch(uiActions.setUiState({
              remainingEstimateReduceByValue: value,
            }));
          }}
          dialogOpen={isCommentDialogOpen}
          setDialogState={(value) => {
            dispatch(uiActions.setUiState({
              isCommentDialogOpen: value,
            }));
          }}
        />
        {screenshotsEnabled && (
          <div
            style={{
              marginLeft: 10,
              cursor: 'pointer',
            }}
            onClick={() => {
              dispatch(screenshotsActions.showScreenshotsViewerWindow());
            }}
          >
            <Tooltip
              content="Screenshots are enabled, click to see details"
              position="bottom"
            >
              <CameraIcon
                size="large"
                primaryColor="white"
                label="Screenshots enabled"
              />
            </Tooltip>
          </div>
        )}
      </Flex>
      <Flex row alignCenter>
        <S.IssueName
          onClick={() => {
            dispatch(uiActions.setUiState({
              selectedIssueId: trackingIssue.id,
            }));
          }}
        >
          {trackingIssue.key}
        </S.IssueName>
        <S.Dot />
        <S.Time>
          {getTimeString(time)}
        </S.Time>
      </Flex>
      <div className="worklog-edit-popup-shouldNotCLose">
        <ProgressBar
          time={time}
          report={report}
          showLoggedOnStop={showLoggedOnStop}
          onClick={() => {
            dispatch(timerActions.stopTimerRequest());
          }}
        />
      </div>
    </S.Container>
  </Transition>
);

function mapStateToProps(state) {
  return {
    time: getTimerState('time')(state),
    report: getTrackingIssueReport(state),
    screenshotsEnabled: getUiState('screenshotsEnabled')(state),
    trackingIssue: getTrackingIssue(state),
    worklogComment: getUiState('worklogComment')(state),
    remainingEstimateValue: getUiState('remainingEstimateValue')(state),
    remainingEstimateNewValue: getUiState('remainingEstimateNewValue')(state),
    remainingEstimateReduceByValue: getUiState('remainingEstimateReduceByValue')(state),
    isCommentDialogOpen: getUiState('isCommentDialogOpen')(state),
    showLoggedOnStop: getUiState('showLoggedOnStop')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(TrackingBar);
