import {Alerter} from './Alerter';
import {useAlertStore} from '../../hooks/UseAlertStore';

export const AlertContainer = () => {
  const {alerts, removeAlert} = useAlertStore();

  return (
    <Alerter alerts={alerts} onRemoveAlert={removeAlert}/>
  );
};
