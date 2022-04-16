import React, {useState} from 'react';
import {Button, Heading, Pane, Text, TextInputField} from 'evergreen-ui';
import {BORDER_RADIUS_M, BORDER_RADIUS_XL, UNIT_2, UNIT_3, UNIT_4} from '../../constants/StyleVariables';
import {BiAlarmAdd} from 'react-icons/bi';
import {useCreateTiming, useFetchTimings, useRemoveTiming} from '../../services/Settings.query';
import {useAppStore} from '../../hooks/UseAppStore';
import {Loading} from '../../components/Loading';
import {Card} from '../../components/card/Card';
import {NoRecords} from '../../components/NoRecords';
import {RemoveButtonWithConfirmation} from '../../components/RemoveButtonWithConfirmation';

// TODO: add form validations

const initialForm = {name: '', workTime: '', breakTime: '', pomodoros: '', longBreakTime: ''};

export const TimeSettings = () => {
  const {userInfo} = useAppStore();
  const [form, setForm] = useState(initialForm);
  const removedTimingIdRef = React.useRef(null);

  const {
    isLoading: isLoadingTimings,
    isFetching: isFetchingTimings,
    data: timings = []
  } = useFetchTimings(userInfo.id);

  const {
    isLoading: isRemovingTiming,
    mutateAsync: removeTiming
  } = useRemoveTiming({
    onSuccess: () => {
      removedTimingIdRef.current = null;
    }
  });

  const {
    isLoading: isCreatingTiming,
    mutateAsync: createTiming
  } = useCreateTiming({
    onSuccess: () => setForm(initialForm)
  });

  const isFormValid = () => {
    let isValid = true;

    if (!form.name) {
      isValid = false;
    } else if (!form.workTime) {
      isValid = false;
    } else if (!form.breakTime) {
      isValid = false;
    } else if (!form.pomodoros) {
      isValid = false;
    } else if (!form.longBreakTime) {
      isValid = false;
    }

    return isValid;
  };

  const handleOnClickAdd = () => {
    createTiming({userId: userInfo.id, ...form});
  };

  const handleOnClickRemove = (timingId) => {
    removedTimingIdRef.current = timingId;
    removeTiming(timingId);
  };

  return (
    <Pane
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      padding={UNIT_4}
    >
      <Pane
        borderRadius={BORDER_RADIUS_XL}
        backgroundColor="white"
        className="u-box-shadow-1"
        width={650}
        marginBottom={UNIT_4}
        position="relative"
      >
        <Loading overlay loading={isCreatingTiming}/>
        <Pane padding={UNIT_4}>
          <Heading size={900} paddingBottom={UNIT_2}>Timing</Heading>
          <Heading size={200} marginBottom={UNIT_3}>Everyone has their different best Pomodoro timing. In this section you can create as many as you want to find the best fit for you.</Heading>
          <TextInputField
            required
            autoFocus
            label="Name"
            value={form.name}
            maxLength="30"
            width="100%"
            marginBottom={UNIT_3}
            description="Used to show in the interface. Max. length 30"
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
          <Pane
            display="grid"
            gridTemplateColumns="1fr 1fr 1fr 1fr"
            gridGap={UNIT_2}
            marginBottom={UNIT_2}
          >
            <TextInputField
              required
              label="Work Time"
              marginBottom={UNIT_2}
              value={form.workTime}
              maxLength="2"
              width={120}
              description="Minutes"
              onChange={(e) => setForm({...form, workTime: e.target.value})}
            />
            <TextInputField
              required
              label="Break Time"
              marginBottom={UNIT_2}
              value={form.breakTime}
              maxLength="2"
              width={120}
              description="Minutes"
              onChange={(e) => setForm({...form, breakTime: e.target.value})}
            />
            <TextInputField
              required
              label="Pomodoros"
              marginBottom={UNIT_2}
              value={form.pomodoros}
              maxLength="1"
              width={120}
              description="Quantity"
              onChange={(e) => setForm({...form, pomodoros: e.target.value})}
            />
            <TextInputField
              required
              label="Long Break Time"
              marginBottom={UNIT_2}
              value={form.longBreakTime}
              maxLength="2"
              width={130}
              description="Minutes"
              onChange={(e) => setForm({...form, longBreakTime: e.target.value})}
            />
          </Pane>
          <Pane
            display="flex"
            justifyContent="flex-end"
          >
            <Button
              disabled={!isFormValid()}
              appearance="primary"
              onClick={handleOnClickAdd}
            ><BiAlarmAdd fontSize={UNIT_3} className="u-mr-1"/>Add</Button>
          </Pane>
        </Pane>
      </Pane>
      <Pane width="650px">
        <Pane display="grid" gridTemplateColumns="2fr 0.5fr 0.5fr 0.5fr 0.8fr 0.7fr" gridGap={UNIT_2} paddingBottom={UNIT_2}>
          <Heading size={100}>Name</Heading>
          <Heading size={100} display="flex" justifyContent="center">Work Time</Heading>
          <Heading size={100} display="flex" justifyContent="center">Break Time</Heading>
          <Heading size={100} display="flex" justifyContent="center">Pomodoros</Heading>
          <Heading size={100} display="flex" justifyContent="center">Long Break Time</Heading>
          <span/>
        </Pane>
        <Pane position="relative" borderRadius={BORDER_RADIUS_M}>
          <Loading loading={isLoadingTimings}/>
          {!isLoadingTimings && <NoRecords arr={timings}/>}
          {timings.map(({id, name, workTime, breakTime, pomodoros, longBreakTime}) => (
            <Card
              hoverable
              key={id}
              width="100%"
              display="grid"
              gridTemplateColumns="2fr 0.5fr 0.5fr 0.5fr 0.8fr 0.7fr"
              gridGap={UNIT_2}
            >
              <Text display="flex" alignSelf="center">{name}</Text>
              <Text display="flex" alignSelf="center" justifyContent="center">{workTime}</Text>
              <Text display="flex" alignSelf="center" justifyContent="center">{breakTime}</Text>
              <Text display="flex" alignSelf="center" justifyContent="center">{pomodoros}</Text>
              <Text display="flex" alignSelf="center" justifyContent="center">{longBreakTime}</Text>
              <Pane display="flex" justifyContent="flex-end" position="relative">
                <RemoveButtonWithConfirmation onClickYes={() => handleOnClickRemove(id)}/>
              </Pane>
            </Card>
          ))}
        </Pane>
      </Pane>
    </Pane>
  );
};