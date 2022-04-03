import React, {useState} from 'react';
import {Button, Heading, IconButton, Pane, Position, Text, TextInputField, Tooltip} from 'evergreen-ui';
import {BORDER_RADIUS_XL, UNIT_2, UNIT_3, UNIT_4} from '../../constants/StyleVariables';
import {BiAlarmAdd, BiTrash} from 'react-icons/bi';
import {useCreateTiming, useFetchTimings, useRemoveTiming} from '../../services/Settings.query';
import {useAppStore} from '../../hooks/UseAppStore';
import {Loading} from '../../components/Loading';

// TODO: add form validations

const initialForm = {name: '', workTime: '', breakTime: '', pomodoros: '', longBreakTime: ''};

export const TimeSettings = () => {
  const {userInfo} = useAppStore();
  const [form, setForm] = useState(initialForm);

  const {
    isLoading: isLoadingTimings,
    isFetching: isFetchingTimings,
    data: timings = []
  } = useFetchTimings(userInfo.id);

  const {
    isLoading: isRemovingTiming,
    mutateAsync: removeTiming
  } = useRemoveTiming();

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
      <Loading overlay loading={isCreatingTiming}/>
      <Pane
        borderRadius={BORDER_RADIUS_XL}
        background="white"
        padding={UNIT_4}
        position="relative"
        className="u-box-shadow-1"
        width={600}
      >
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
          paddingBottom={UNIT_4}
        >
          <Button
            disabled={!isFormValid()}
            appearance="primary"
            onClick={handleOnClickAdd}
          ><BiAlarmAdd fontSize={UNIT_3} className="u-mr-1"/>Add</Button>
        </Pane>
        <Pane display="flex" position="relative">
          <Loading overlay loading={isLoadingTimings || isFetchingTimings || isRemovingTiming}/>
          <Pane display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr 1fr 0.4fr" gridGap={UNIT_2}>
            <Heading size={100}>Name</Heading>
            <Heading size={100}>Work Time</Heading>
            <Heading size={100}>Break Time</Heading>
            <Heading size={100}>Pomodoros</Heading>
            <Heading size={100}>Long Break Time</Heading>
            <span/>
            {timings.length === 0 && <Pane gridColumn="span 6" textAlign="center" paddingTop={UNIT_2}>No records found</Pane>}
            {timings.map(({id, name, workTime, breakTime, pomodoros, longBreakTime}) => {
              return (
                <>
                  <Text display="flex" alignSelf="center">{name}</Text>
                  <Text display="flex" alignSelf="center">{workTime}</Text>
                  <Text display="flex" alignSelf="center">{breakTime}</Text>
                  <Text display="flex" alignSelf="center">{pomodoros}</Text>
                  <Text display="flex" alignSelf="center">{longBreakTime}</Text>
                  <Pane display="flex" justifyContent="flex-end">
                    <Tooltip content="Remove" position={Position.TOP}>
                      <IconButton
                        height={24}
                        intent="danger"
                        icon={<BiTrash/>}
                        onClick={() => handleOnClickRemove(id)}
                      />
                    </Tooltip>
                  </Pane>
                </>
              );
            })}
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
};